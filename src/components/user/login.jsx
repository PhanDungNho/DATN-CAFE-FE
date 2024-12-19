import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  handleGoogleLoginSuccess,
} from "./../../redux/actions/authActions";
import { FaLock } from "react-icons/fa";
import { UserOutlined } from "@ant-design/icons";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [rememberMe, setRememberMe] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Khi component được mount, kiểm tra local storage
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    if (savedUsername) {
      form.setFieldsValue({ username: savedUsername });
    }
    if (savedPassword) {
      form.setFieldsValue({ password: savedPassword });
    }
  }, [form]);

  const onFinish = (values) => {
    const { username, password } = values;
    dispatch(login(username, password));

    // Nếu checkbox "Nhớ tài khoản" được chọn
    if (rememberMe) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
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
              form={form}
              name="login-form"
              onFinish={onFinish}
              className="login-form"
              layout="vertical"
            >
              <h3 className="mb-5 text-uppercase text-center">LOGIN</h3>

              {error && <p className="error-message">{error}</p>}

              <Form.Item
                name="username"
                rules={[{ required: true, message: "Please enter username!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  className="form-control-md"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "0" }}
                name="password"
                rules={[{ required: true, message: "Please enter password!" }]}
              >
                <Input.Password
                  prefix={<FaLock />}
                  placeholder="Password "
                  className="form-control-md"
                />
              </Form.Item>

              <Form.Item>
                <Checkbox
                  defaultChecked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember
                </Checkbox>
                <a href="/forgotpassword" style={{ float: "right" }}>
                  Forgot password
                </a>
              </Form.Item>

              <Form.Item style={{ marginBottom: "0" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-block btn-form btn-sign"
                  loading={loading}
                >
                  Login
                </Button>
              </Form.Item>
              <label style={{ textAlign: "right", display: "block" }}>
                New here? <a href="/register">Create an account</a>
              </label>

              <p className="text-center fw-bold my-3 text-muted">OR</p>

              <Form.Item style={{ marginBottom: "10px" }}>
                <GoogleOAuthProvider clientId="1054341439647-mp87d5v01991tj7l16t3drpceeb21m2u.apps.googleusercontent.com">
                  <GoogleLogin
                    useOneTap
                    width={"360"}
                    type="standard"
                    size="medium"
                    shape="square"
                    theme="filled_black"
                    text="continue_with"
                    className="w-100"
                    style={{ color: "red" }}
                    onSuccess={handleGoogleLoginSuccess}
                    onError={(error) => {
                      console.error("Login Failed:", error);
                    }}
                  />
                </GoogleOAuthProvider>
              </Form.Item>
              <label style={{ textAlign: "center", display: "block" }}>
               <a href="/">Home</a>
              </label>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
