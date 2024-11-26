import React, { useState } from "react";
import { Form, Input, Button, Card, message, Row, Col } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Hook điều hướng

const VerifyOtp = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái để quản lý khi gửi form

  const onFinish = async (values) => {
    setIsSubmitting(true); // Bắt đầu quá trình gửi form
    try {
      const response = await axios.get(`http://localhost:8081/api/verify?otp=${values.otp}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      message.success(response.data.message);

      // Điều hướng đến trang đăng nhập sau khi xác thực OTP thành công
      navigate("/login"); // Đường dẫn đến trang đăng nhập (có thể thay đổi theo router của bạn)
    } catch (error) {
      console.error("Xác thực OTP thất bại:", error);
      if (error.response) {
        message.error(error.response.data.message || "Xác thực OTP thất bại.");
      } else {
        message.error("Xác thực OTP thất bại! Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false); // Kết thúc quá trình gửi form
    }
  };

  return (
    <div
      className="otp-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: "url('../../assets/img/nennnn.jpg')", // Thay thế URL bằng ảnh nền mong muốn
        backgroundSize: "cover", // Phủ kín toàn bộ khung hình
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: "800px", // Tăng kích thước Card để chứa hình ảnh và form
          width: "100%",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Thêm shadow để form nổi bật
          background: "rgba(255, 255, 255, 0.8)", // Màu nền trắng với độ trong suốt 0.8
        }}
      >
        <Row gutter={16}>
          {/* Cột chứa hình ảnh */}
          <Col span={12}> {/* Đặt span là 12 để chia đều không gian */}
            <img
              src="../../assets/img/otpdangky.png" // Đường dẫn đến hình ảnh
              alt="OTP"
              style={{ 
                width: "100%", 
                borderRadius: "5px", // Bo tròn nhẹ cho góc
                objectFit: "cover", // Giữ tỷ lệ hình ảnh
                height: "100%" // Đảm bảo hình ảnh không bị méo
              }}
            />
          </Col>

          {/* Cột chứa form nhập mã OTP */}
          <Col span={12}> {/* Đặt span là 12 để chia đều không gian */}
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Xác nhận OTP</h1> {/* Tiêu đề */}
            <Form form={form} onFinish={onFinish}>
              <Form.Item
                name="otp"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
                style={{
                  border: "1px solid #d9d9d9", // Thêm khung viền xung quanh
                  borderRadius: "5px", // Bo tròn các góc
                  padding: "5px", // Thêm khoảng trống bên trong
                  marginBottom: "20px", // Khoảng cách dưới giữa các form
                }}
              >
                <Input.Password
                  placeholder="Nhập mã OTP" 
                  style={{
                    padding: "10px",
                    borderRadius: "5px", // Bo góc cho ô nhập
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting} // Hiển thị trạng thái chờ khi gửi form
                  block
                >
                  Xác nhận
                </Button>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
    <p>Trở về <a href="/">trang chủ</a></p>
  </div>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default VerifyOtp;
