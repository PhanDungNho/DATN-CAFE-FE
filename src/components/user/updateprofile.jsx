import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UpdateProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/profile");
        const profileData = response.data;
        form.setFieldsValue({
          name: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          password: "", // Để trống mật khẩu ban đầu
          image: profileData.image // Nếu cần lấy hình ảnh
        });
      } catch (error) {
        message.error("Không thể tải dữ liệu tài khoản.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const onFinish = async (values) => {
    try {
        const formData = new FormData();
        formData.append("fullName", values.name);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        if (values.password) {
            formData.append("password", values.password);
        }
        if (values.image && values.image[0]) {
            formData.append("image", values.image[0].originFileObj);
        }

        const response = await axios.put("http://localhost:8081/api/profile/update", formData);

        message.success(response.data);
    } catch (error) {
        console.error("Chi tiết lỗi:", error);
        message.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <h2>Cập nhật thông tin tài khoản</h2>
      <Form
        form={form}
        name="update-profile"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: "", email: "", phone: "" }}
      >
        <Form.Item
          label="Tên đầy đủ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ!" }]}
        >
          <Input placeholder="Nhập tên đầy đủ" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Địa chỉ email không hợp lệ!" }, { required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }, { pattern: new RegExp(/^[0-9]{10}$/), message: "Số điện thoại phải có 10 chữ số!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="password"
          rules={[{ min: 6, message: "Mật khẩu phải ít nhất 6 ký tự!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới (không bắt buộc)" />
        </Form.Item>

        <Form.Item
          label="Chọn hình ảnh đại diện (không bắt buộc)"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            name="image"
            beforeUpload={() => false}
            onChange={(info) => {
                if (info.file.status === "done") {
                    message.success(`${info.file.name} đã tải lên thành công.`);
                } else if (info.file.status === "error") {
                    message.error(`${info.file.name} tải lên thất bại.`);
                }
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateProfile;
