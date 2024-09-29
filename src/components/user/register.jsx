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

const Register = () => {
  const onFinish = (values) => {
    console.log("Received values:", values);
  };

  return (
    <div className="register-container">
      <div className="card">
        <Row gutter={16}>
          <Col xs={24} xl={12} className="register-image-col">
            <img
              src="/assets/img/banner.jpg" // Đường dẫn tới hình ảnh trong thư mục public
              alt="Sample"
              className="register-image img-fluid"
            />
          </Col>
          <Col xs={24} xl={12}>
            <Card className="register-card">
              <h3 className="register-title">Đăng ký</h3>
              <Form onFinish={onFinish}>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Tài khoản" />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                  ]}
                >
                  <Input
                    prefix={<MdDriveFileRenameOutline />}
                    placeholder="Họ và tên"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                      type: "email",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password prefix={<FaLock />} placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item
                  name="confirmpassword"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập lại mật khẩu"
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Số điện thoại"
                  />
                </Form.Item>
                <div className="register-buttons">
                  <Button type="default" className="reset-button">
                    Reset all
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-button"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Register;
