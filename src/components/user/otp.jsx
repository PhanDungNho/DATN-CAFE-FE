import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // Add useNavigate import
import 'antd/dist/reset.css'; // Ant Design CSS

const OTPForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const onFinish = async (values) => {
    setLoading(true); // Start loading
    try {
      // Assuming the email was sent previously and stored somewhere in the state
      const email = localStorage.getItem('email'); // Get email from local storage or state
      
      const response = await fetch('http://localhost:8081/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: values.otp }), // Send email and OTP
      });

      if (!response.ok) {
        const errorData = await response.json();
        message.error(errorData.message || 'An error occurred, please try again.');
      } else {
        const data = await response.json();
        message.success(data.message);
        
        // Redirect the user to the password reset page
        navigate('/forgotpassword/otp/newpassword'); // Redirect
      }
    } catch (error) {
      message.error('An error occurred, please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: 'url(../../assets/img/nennnn.jpg)', // Background image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Background color with transparency
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '900px',
          width: '100%',
        }}
      >
        <Row gutter={20} justify="center" align="middle">
          <Col lg={10}>
            <img
              src="../assets/img/pass2.webp"
              alt="Forgot Password"
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
            />
          </Col>
          <Col lg={10}>
            <div style={{ textAlign: 'center' }}>
              <h1>Enter OTP</h1>
              <Form
                name="otp-form"
                onFinish={onFinish}
                layout="vertical"
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: 'Please enter the OTP!' }]}
                >
                  <Input placeholder="OTP" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading}>
                    Confirm
                  </Button>
                </Form.Item>
              </Form>
              <p>Return to <a href="/">home page</a></p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OTPForm;
