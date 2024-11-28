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

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Giá trị form:", values);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/register",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Vui Lòng Nhập Mã OTP Để Xác Nhận Đăng Ký!");

      // Điều hướng đến trang xác thực OTP sau khi đăng ký thành công
      navigate("/register/verifyotp"); // Thay đổi đường dẫn theo cấu trúc router của bạn
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      if (error.response) {
        const { status, data } = error.response;
        console.error("Error status:", status);
        console.error("Error data:", data);

        // Kiểm tra lỗi trùng username
        if (data.message === "Username already exists") {
          message.error(
            "Tài khoản này đã tồn tại. Vui lòng chọn tài khoản khác."
          );
        } else {
          message.error(
            data.message ||
              "Username này đã tồn tại. Vui lòng nhập Username khác."
          );
        }
      } else {
        message.error("Đăng ký thất bại! Vui lòng thử lại.");
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
    return Promise.reject(new Error("Mật khẩu nhập lại không khớp!"));
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
              alt="Hình ảnh đăng ký"
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
                Đăng ký
              </h3>
              <Form form={form} onFinish={onFinish}>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tài khoản!" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Tài khoản" />
                </Form.Item>
                <Form.Item
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
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
                      message: "Vui lòng nhập email!",
                      type: "email",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password prefix={<FaLock />} placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item
                  name="confirmpassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                    { validator: validatePassword },
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
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Số điện thoại phải bao gồm đúng 10 chữ số!",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Số điện thoại"
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
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
                  {/* <a href="http://localhost:8081/oauth2/authorization/google"
      class="btn btn-block btn-google auth-form-btn w-100"  > <i
      class="mdi mdi-google  me-2 text-warning"></i>Connect using
      google
    </a> */}

                  {/* <Row gutter={16}>
                    <Col span={4}>
                      {" "}
                    
                      <Button
                        type="default"
                        icon={<HomeOutlined />}
                        onClick={() => navigate("/")} // Chuyển hướng về trang chủ khi nhấn nút
                        style={{
                          backgroundColor: "#1890ff", // Màu nền cho nút
                          color: "white",
                          borderColor: "#1890ff",
                          width: "100%",
                          marginLeft: "20px",
                          // Làm cho nút chiếm toàn bộ chiều rộng
                        }}
                      ></Button>
                    </Col>
                  </Row> */}
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
