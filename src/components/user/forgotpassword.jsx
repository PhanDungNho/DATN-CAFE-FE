import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import 'antd/dist/reset.css'; // CSS của Ant Design

const ForgotPassword = () => {
const onFinish = (values) => {
    console.log('Success:', values);
    // Gửi request đến server hoặc xử lý form
};

return (
    <div
    style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: 'url(assets/img/nennnn.jpg)', // Đường dẫn ảnh nền
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)', // Màu nền với độ trong suốt
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
            <div style={{ textAlign: 'center', }}>
              <h1>Quên Mật Khẩu</h1>
              <Form
                name="forgot-password"
                onFinish={onFinish}
                layout="vertical" // Sắp xếp label trên input
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }, { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' }]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block icon={<i className="fa fa-envelope"></i>}>
                    Gửi Mã
                  </Button>
                </Form.Item>
              </Form>
              <p>Không có tài khoản? <a href="/auth/register">Đăng ký tại đây</a></p>
              <p>Trở về <a href="/home">trang chủ</a></p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ForgotPassword;