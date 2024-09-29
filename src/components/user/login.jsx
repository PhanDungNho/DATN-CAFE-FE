import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { FaLock } from "react-icons/fa";
import {
  UserOutlined,
} from "@ant-design/icons";

const Login = () => {
  const onFinish = (values) => {
    console.log("Received values:", values);
    // Xử lý đăng nhập ở đây
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100 login-form">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone"
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <Form
              name="login-form"
              onFinish={onFinish}
              className="login-form"
              layout="vertical"
            >
              <h3 className="mb-5 text-uppercase text-center">Đăng nhập</h3>

              {/* Tài khoản Input */}
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập tài khoản!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Tài khoản"
                  className="form-control-md"
                />
              </Form.Item>

              {/* Mật khẩu Input */}
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<FaLock />}
                  placeholder="Mật khẩu"
                  className="form-control-md"
                />
              </Form.Item>

              <Form.Item>
                <Checkbox defaultChecked>Nhớ tài khoản</Checkbox>
                <a href="#!" style={{ float: "right" }}>
                  Quên mật khẩu?
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-block btn-form btn-sign"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <p className="text-center fw-bold my-3 text-muted">HOẶC</p>

              <Form.Item>
                <Button
                  type="default"
                  className="btn-block btn-form btn-gg"
                  icon={<GoogleOutlined />}
                >
                  Đăng nhập với Google
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
