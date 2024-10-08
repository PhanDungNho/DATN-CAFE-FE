import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import 'antd/dist/reset.css'; // CSS của Ant Design

const OTPForm = () => {
  const onFinish = (values) => {
    console.log('Form submitted with values:', values);
    // Xử lý logic gửi OTP tại đây
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
                  <Button type="primary" htmlType="submit" block>
                    Xác Nhận
                  </Button>
                </Form.Item>
              </Form>
              <p>Trở về <a href="/home">trang chủ</a></p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OTPForm;
