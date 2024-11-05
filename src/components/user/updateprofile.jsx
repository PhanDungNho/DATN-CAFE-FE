import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UpdateProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imageFileList, setImageFileList] = useState([]); // Biến trạng thái lưu tệp hình ảnh

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy JWT token từ localStorage
        const response = await axios.get("http://localhost:8081/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = response.data;
        form.setFieldsValue({
          name: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          password: "", // Để trống mật khẩu ban đầu
        });

        // Hiển thị ảnh hiện tại nếu có
        if (profileData.image) {
          setImageFileList([
            {
              uid: "-1", // ID giả lập cho ảnh hiện tại
              name: profileData.image, // Tên tệp ảnh
              status: "done",
              url: `http://localhost:8081/uploads/${profileData.image}`, // Đường dẫn tới ảnh trên server
            },
          ]);
        }
      } catch (error) {
        message.error("Cannot load account data."); // Thông báo lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullName", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);

      if (values.password) {
        formData.append("password", values.password);
      }

      // Gửi tệp mới nếu có
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("imageFile", imageFileList[0].originFileObj);
      }

      const response = await axios.put(
        "http://localhost:8081/api/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success(response.data);
    } catch (error) {
      console.error("Error details:", error);

      // Kiểm tra xem có phản hồi từ backend
      const errorResponse = error.response?.data;

      // Kiểm tra cấu trúc phản hồi để lấy thông báo
      const errorMessage =
        errorResponse &&
        typeof errorResponse === "object" &&
        errorResponse.message
          ? errorResponse.message // Lấy thông điệp từ đối tượng
          : "Failed to update information. Please try again."; // Thông báo lỗi chung

      // Hiển thị thông báo lỗi cho người dùng
      if (errorMessage === "Email đã tồn tại.") {
        message.error("Email already exists."); // Thông báo cụ thể cho trường hợp email đã tồn tại
      } else {
        message.error(errorMessage); // Thông báo lỗi chung
      }
    }
  };

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <h2>Update Information</h2>
      <Form
        form={form}
        name="update-profile"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: "", email: "", phone: "" }}
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please enter full name!" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", message: "Invalid email address!" },
            { required: true, message: "Please enter email!" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please enter phone number!" },
            {
              pattern: new RegExp(/^[0-9]{10}$/),
              message: "Phone number must have 10 digits!",
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="password"
          rules={[
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password placeholder="Enter new password (optional)" />
        </Form.Item>

        <Form.Item
          label="Select Profile Picture (optional)"
          name="imageFile"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList ? e.fileList : [];
          }}
        >
         <Upload
            name="imageFile"
            listType="picture"
            maxCount={1} // Giới hạn 1 ảnh
            defaultFileList={imageFileList} // Hiển thị ảnh hiện tại
            accept=".jpg,.jpeg,.png,.gif" // Chỉ cho phép các định dạng ảnh
            beforeUpload={() => false} // Ngăn chặn upload tự động
            onChange={(info) => {
              // Giữ lại chỉ một hình ảnh mới nhất
              setImageFileList(info.fileList.slice(-1));
              if (info.file.status === "done") {
                message.success(`${info.file.name} has been uploaded successfully.`);
              } else if (info.file.status === "error") {
                message.error(`${info.file.name} upload failed.`);
              }
            }}
          >
            <Button icon={<UploadOutlined />}>Choose Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Information
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateProfile;
