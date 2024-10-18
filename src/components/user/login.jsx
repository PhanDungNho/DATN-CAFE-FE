import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  handleGoogleLoginSuccess,
  handleGoogleLoginFailure,
} from "./../../redux/actions/authActions";
import { GoogleOutlined } from "@ant-design/icons";
import { FaLock } from "react-icons/fa";
import { UserOutlined } from "@ant-design/icons";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Color } from "antd/lib/color-picker";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const onFinish = (values) => {
    dispatch(login(values.username, values.password));
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

              {error && <p className="error-message">{error}</p>}

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
                  loading={loading}
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <p className="text-center fw-bold my-3 text-muted">HOẶC</p>

              <Form.Item >
          
                <GoogleOAuthProvider  clientId="1054341439647-mp87d5v01991tj7l16t3drpceeb21m2u.apps.googleusercontent.com">
            
                    <GoogleLogin useOneTap width={"360"}     type="standard" size="medium" shape="square"   theme="filled_black" type="standard" text="continue_with" className="w-100" style={{color:"red"}} 
                    
                    
                      onSuccess={handleGoogleLoginSuccess}
                      onError={(error) => {
                        console.error("Login Failed:", error);
                      }}
                      
                    />
                
                </GoogleOAuthProvider>

                {/* <a href="http://localhost:8081/oauth2/authorization/google"
										class="btn btn-block btn-google auth-form-btn w-100"  > <i
										class="mdi mdi-google  me-2 text-warning"></i>Connect using
										google
									</a> */}
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
