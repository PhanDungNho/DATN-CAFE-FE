import React from "react";
import { Form, Input, Button, Card, Col, Row } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { FaLock } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { GoogleOutlined } from "@ant-design/icons";

const Register = () => {
  const onFinish = (values) => {
    console.log("Received values:", values);
  };

  return (
    <div
      className="register-container"
      style={{
        backgroundImage: "url('assets/img/nennnn.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "50px", 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center", 
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ maxWidth: "1000px", width: "100%" , height: "600px" , opacity: "0.95"}}>
        <Row gutter={32} align="middle" justify="center">
          <Col xs={24} xl={14} className="register-image-col">
            <img
              src="/assets/img/nenregister2.png"
              alt="Sample"
              className="register-image img-fluid"
              style={{
                width: "630px", 
                height: "550px",
                objectFit: "cover", 
                borderRadius: "10px", 
                opacity:"none",
              }}
            />
          </Col>
          <Col xs={16} xl={10}>
            <Card
              className="register-card"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Tăng độ trong suốt
                borderRadius: "10px",
                padding: "10px", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
                
              }}
            >
              <h3 className="register-title" style={{ textAlign: "center", marginBottom: "5px" }}>
                Đăng ký
              </h3>
              <Form onFinish={onFinish}>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: "Please input your username!" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Tài khoản" />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  rules={[{ required: true, message: "Please input your full name!" }]}
                >
                  <Input prefix={<MdDriveFileRenameOutline />} placeholder="Họ và tên" />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[{
                    required: true,
                    message: "Please input your email!",
                    type: "email",
                  }]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
                >
                  <Input.Password prefix={<FaLock />} placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item
                  name="confirmpassword"
                  rules={[{ required: true, message: "Please confirm your password!" }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: "Please input your phone number!" }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                </Form.Item>
                <div className="register-buttons" style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button type="default" className="reset-button">Reset all</Button>
                  <Button type="primary" htmlType="submit" className="submit-button">Submit</Button>
                </div>
                <p className="text-center fw-bold my-3 text-muted">HOẶC</p>

                  <Form.Item>
                    <Button
                      type="default"
                      className="btn-block btn-form btn-gg"
                      icon={<GoogleOutlined />}
                    >
                      Đăng ký với Google
                    </Button>
                  </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Register;
