import React from "react";
import { Form, Input, Button, Card, Col, Row, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { FaLock } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { GoogleOutlined, HomeOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { handleGoogleLoginSuccess } from "../../redux/actions/authActions";
import { API } from "../../services/constant";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Giá trị form:", values);

    try {
      const response = await axios.post(API + "/api/register", values, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      message.success(
        "Please enter the OTP code to confirm your registration!"
      );

      // Điều hướng đến trang xác thực OTP sau khi đăng ký thành công
      navigate("/register/verifyotp"); // Thay đổi đường dẫn theo cấu trúc router của bạn
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response) {
        const { status, data } = error.response;
        console.error("Error status:", status);
        console.error("Error data:", data);

        // Kiểm tra lỗi trùng username
        if (data.message === "Username already exists") {
          message.error(
            "This account already exists. Please select a different account."
          );
        } else {
          message.error(
            data.message ||
              "This username already exists. Please enter a different Username."
          );
        }
      } else {
        message.error("Registration failed! Please try again.");
      }
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const validatePassword = (_, value) => {
    if (!value || form.getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("The re-entered password does not match!"));
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
      <div
        className="card"
        style={{
          maxWidth: "1000px",
          width: "100%",
          opacity: "0.95",
          marginTop: "20px",
        }}
      >
        <Row
          gutter={32}
          align="middle"
          justify="center"
          style={{ height: "100%" }}
        >
          <Col xs={24} xl={14} className="register-image-col">
            <img
              src="/assets/img/nenregister2.png"
              alt=""
              className="register-image img-fluid"
              style={{
                width: "630px",
                height: "550px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </Col>
          <Col xs={16} xl={10}>
            <Card
              className="register-card"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                padding: "10px",
                height: "550px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h3
                className="register-title"
                style={{ textAlign: "center", marginBottom: "5px" }}
              >
                Register
              </h3>
              <Form form={form} onFinish={onFinish}>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your account!" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Account" />
                </Form.Item>
                <Form.Item
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your first and last name!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MdDriveFileRenameOutline />}
                    placeholder="Full name"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email!",
                      type: "email",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please enter the password!" },
                  ]}
                >
                  <Input.Password prefix={<FaLock />} placeholder="Password" />
                </Form.Item>
                <Form.Item
                  name="confirmpassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please re-enter the password!",
                    },
                    { validator: validatePassword },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Re-enter the password"
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number!",
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message:
                        "The phone number must include exactly 10 digits!",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Phone Number"
                  />
                </Form.Item>
                <div
                  className="register-buttons"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    type="default"
                    onClick={onReset}
                    className="reset-button"
                  >
                    Reset all
                  </Button>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="submit-button"
                    >
                      Submit
                    </Button>
                    <Button
                      type="default"
                      className="back-button"
                      onClick={() => (window.location.href = "/")}
                      icon={<HomeOutlined />}
                    />
                  </div>
                </div>

                <Form.Item>
                  <p className="text-center fw-bold my-3 text-muted">OR</p>

                  <Form.Item>
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
