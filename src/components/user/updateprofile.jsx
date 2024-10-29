import React from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const Updateprofile = () => {
  // Hàm xử lý khi form được submit
  const onFinish = (values) => {
    console.log("Form values: ", values);
  };

  const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} đã được tải lên thành công.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  return (
    <div style={{ maxWidth:'100%', padding: "20px" }}>
      <h2>Cập nhật thông tin tài khoản</h2>
      <Form
        name="update-profile"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: "Nguyễn Văn A",
          email: "nguyenvana@gmail.com",
          phone: "0123456789",
        }}
      >
        <Form.Item
          label="Tên đầy đủ"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên đầy đủ!" },
          ]}
        >
          <Input placeholder="Nhập tên đầy đủ" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              message: "Địa chỉ email không hợp lệ!",
            },
            { required: true, message: "Vui lòng nhập email!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại!",
            },
            {
              pattern: new RegExp(/^[0-9]{10}$/),
              message: "Số điện thoại phải có 10 chữ số!",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="password"
          rules={[
            {
              min: 6,
              message: "Mật khẩu phải ít nhất 6 ký tự!",
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới (không bắt buộc)" />
        </Form.Item>

        <Form.Item
          label="Chọn ảnh đại diện (không bắt buộc)"
          name="avatar"
          valuePropName="fileList" // Đặt giá trị prop cho fileList
          getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList} // Lấy fileList từ sự kiện
        >
          <Upload
            name="avatar"
            beforeUpload={() => false} // Ngăn upload tự động
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Updateprofile;
