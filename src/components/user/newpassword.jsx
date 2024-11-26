import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // Add useNavigate import
import 'antd/dist/reset.css'; // Ant Design CSS

const NewPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const onFinish = async (values) => {
    setLoading(true); // Start loading
    try {
      const email = localStorage.getItem('email'); // Get email from localStorage

      const response = await fetch('http://localhost:8081/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        message.error(errorData.message || 'An error occurred, please try again.');
      } else {
        const data = await response.json();
        message.success(data.message);

        // Remove email from localStorage after successful password reset
        localStorage.removeItem('email');

        // Redirect to the login page and replace history to prevent going back
        navigate('/login', { replace: true });
      }
    } catch (error) {
      message.error('An error occurred, please try again.');
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
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background color
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
              src="/assets/img/pass2.webp"
              alt="New Password"
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
            />
          </Col>
          <Col lg={10}>
            <div style={{ textAlign: 'center' }}>
              <h1>Enter New Password</h1>
              <Form
                name="new-password-form"
                onFinish={onFinish}
                layout="vertical"
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Please enter a new password!' },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, 
                      message: 'Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one number.',
                    },
                  ]}
                >
                  <Input.Password placeholder="New Password" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm Password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading}>
                    Confirm
                  </Button>
                </Form.Item>
              </Form>
              <p>Back to <a href="/">home page</a></p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default NewPasswordForm;
