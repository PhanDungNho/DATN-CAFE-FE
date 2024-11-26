import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // Thêm import useNavigate
import 'antd/dist/reset.css'; // CSS của Ant Design

const NewPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  const onFinish = async (values) => {
    setLoading(true); // Bắt đầu loading
    try {
      const email = localStorage.getItem('email'); // Lấy email từ localStorage
  
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
        message.error(errorData.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      } else {
        const data = await response.json();
        message.success(data.message);
  
        // Xóa email khỏi localStorage sau khi đặt lại mật khẩu thành công
        localStorage.removeItem('email');
  
        // Chuyển hướng đến trang đăng nhập và thay thế lịch sử để không thể quay lại
        navigate('/login', { replace: true });
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại.');
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
              src="/assets/img/pass2.webp"
              alt="New Password"
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
            />
          </Col>
          <Col lg={10}>
            <div style={{ textAlign: 'center' }}>
              <h1>Nhập Mật Khẩu Mới</h1>
              <Form
                name="new-password-form"
                onFinish={onFinish}
                layout="vertical"
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <Form.Item
                  name="newPassword"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                >
                  <Input.Password placeholder="Mật khẩu mới" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Xác nhận mật khẩu" />
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

export default NewPasswordForm;
