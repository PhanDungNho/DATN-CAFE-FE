import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // Thêm import useNavigate
import 'antd/dist/reset.css'; // CSS của Ant Design

const OTPForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  const onFinish = async (values) => {
    setLoading(true); // Bắt đầu loading
    try {
      // Giả định rằng bạn đã gửi email trước đó và lưu nó ở đâu đó trong state
      const email = localStorage.getItem('email'); // Lấy email từ local storage hoặc state
      
      const response = await fetch('http://localhost:8081/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: values.otp }), // Gửi email và OTP
      });

      if (!response.ok) {
        const errorData = await response.json();
        message.error(errorData.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      } else {
        const data = await response.json();
        message.success(data.message);
        
        // Chuyển hướng người dùng đến trang đổi mật khẩu
        navigate('/forgotpassword/otp/newpassword'); // Chuyển hướng
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: 'url(../../assets/img/nennnn.jpg)', // Đường dẫn ảnh nền
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Màu nền với độ trong suốt
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
              <h1>Nhập Mã OTP</h1>
              <Form
                name="otp-form"
                onFinish={onFinish}
                layout="vertical"
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
                >
                  <Input placeholder="OTP" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading}>
                    Xác Nhận
                  </Button>
                </Form.Item>
              </Form>
              <p>Trở về <a href="/">trang chủ</a></p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OTPForm;
