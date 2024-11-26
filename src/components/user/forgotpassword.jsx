import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import 'antd/dist/reset.css'; // Ant Design CSS

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const onFinish = async (values) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch('http://localhost:8081/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }), // Send email to backend
      });

      if (!response.ok) {
        const errorData = await response.json();
        message.error(errorData.message || 'An error occurred, please try again.');
      } else {
        const data = await response.json();
        message.success(data.message);
        // Save email to local storage or state before redirecting
        localStorage.setItem('email', values.email); // Save email to local storage
        navigate('/forgotpassword/otp'); // Redirect to OTP verification page
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
        backgroundImage: 'url(assets/img/nennnn.jpg)', // Background image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)', // Background color with transparency
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '1000px',
        }}
      >
        <Row gutter={20} justify="center" align="middle">
          <Col lg={10}>
            <img
              src="assets/img/pass2.webp"
              alt="Forgot Password"
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
            />
          </Col>
          <Col lg={10}>
            <div style={{ textAlign: 'center' }}>
              <h1>Forgot Password</h1>
              <Form
                name="forgot-password"
                onFinish={onFinish}
                layout="vertical" // Layout with label on top of input
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email format!' },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading}>
                    Send Code
                  </Button>
                </Form.Item>
              </Form>
              <p>Don't have an account? <a href="/register">Sign up here</a></p>
              <p>Return to <a href="/">home page</a></p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ForgotPassword;
