import React, { useState } from "react";
import { Form, Input, Button, Card, message, Row, Col } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Navigation hook
import { API } from "../../services/constant";

const VerifyOtp = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Using the useNavigate hook for navigation
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage form submission

  const onFinish = async (values) => {
    setIsSubmitting(true); // Start the form submission process
    try {
      const response = await axios.get(API + `/api/verify?otp=${values.otp}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      message.success(response.data.message);

      // Navigate to the login page after successful OTP verification
      navigate("/login"); // Redirect to the login page (can be changed according to your router)
    } catch (error) {
      console.error("OTP verification failed:", error);
      if (error.response) {
        message.error(
          error.response.data.message || "OTP verification failed."
        );
      } else {
        message.error("OTP verification failed! Please try again.");
      }
    } finally {
      setIsSubmitting(false); // End the form submission process
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
        backgroundImage: "url('../../assets/img/nennnn.jpg')", // Replace URL with desired background image
        backgroundSize: "cover", // Cover the entire screen
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: "800px", // Increase card size to fit image and form
          width: "100%",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow to make the form stand out
          background: "rgba(255, 255, 255, 0.8)", // White background with 0.8 transparency
        }}
      >
        <Row gutter={16}>
          {/* Column containing image */}
          <Col span={12}>
            <img
              src="../../assets/img/otpdangky.png" // Image path
              alt="OTP"
              style={{
                width: "100%",
                borderRadius: "5px", // Slightly rounded corners
                objectFit: "cover", // Maintain aspect ratio of the image
                height: "100%", // Ensure image doesn't get stretched
              }}
            />
          </Col>

          {/* Column containing OTP form */}
          <Col span={12}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
              Confirm OTP
            </h1>
            <Form form={form} onFinish={onFinish}>
              <Form.Item
                name="otp"
                rules={[{ required: true, message: "Please enter the OTP!" }]}
                style={{
                  marginBottom: "20px",
                }}
              >
                <Input.OTP
                  length={6} // Độ dài OTP tùy chỉnh
                  formatter={(str) => str.toUpperCase()} // Chuyển thành chữ in hoa
                  placeholder="Enter OTP"
                  style={{
                    padding: "10px",
                    borderRadius: "5px", // Rounded corners for the input field
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting} // Show loading state when submitting
                  block
                >
                  Confirm
                </Button>
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <p>
                    Return to <a href="/">home page</a>
                  </p>
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