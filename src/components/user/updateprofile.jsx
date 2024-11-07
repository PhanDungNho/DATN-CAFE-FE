import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Form, Input, Button, Upload, Modal, message, Slider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AvatarEditor from "react-avatar-editor";

const UpdateProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imageFileList, setImageFileList] = useState([]);
  const [croppingImage, setCroppingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1.2); // Trạng thái để lưu mức thu phóng
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
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
          password: "",
        });

        if (profileData.image) {
          setImageFileList([
            {
              uid: "-1",
              name: profileData.image,
              status: "done",
              url: `http://localhost:8081/uploads/${profileData.image}`,
            },
          ]);
        }
      } catch (error) {
        message.error("Cannot load account data.");
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
      const errorMessage =
        error.response?.data?.message || "Failed to update information.";
      message.error(errorMessage);
    }
  };

  const handleImageUpload = ({ file }) => {
    setSelectedImage(file);
    setCroppingImage(true);
  };

  const handleCrop = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], selectedImage.name, {
          type: selectedImage.type,
          lastModified: Date.now(),
        });

        setImageFileList([
          {
            uid: "-1",
            name: croppedFile.name,
            status: "done",
            originFileObj: croppedFile,
            url: URL.createObjectURL(croppedFile),
          },
        ]);
      });
    }
    setCroppingImage(false);
    setSelectedImage(null);
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
          rules={[{ min: 6, message: "Password must be at least 6 characters!" }]}
        >
          <Input.Password placeholder="Enter new password (optional)" />
        </Form.Item>

        <Form.Item label="Select Profile Picture (optional)">
          <Upload
            listType="picture"
            maxCount={1}
            accept=".jpg,.jpeg,.png,.gif"
            beforeUpload={() => false}
            onChange={handleImageUpload}
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

      {/* Crop Image Modal */}
      <Modal
        visible={croppingImage}
        onCancel={() => setCroppingImage(false)}
        onOk={handleCrop}
        title="Cắt ảnh đại diện"
      >
        {selectedImage && (
          <AvatarEditor
            ref={editorRef}
            image={selectedImage}
            width={400} // Tăng chiều rộng cho avatar
            height={400} // Điều chỉnh chiều cao để phù hợp với chiều rộng mới
            border={20} // Điều chỉnh đường viền để kiểm soát khoảng trống quanh ảnh
            scale={zoom} // Sử dụng trạng thái zoom để điều chỉnh thu phóng
            rotate={0}
          />
        )}

        {/* Thanh trượt để thu phóng */}
        <div style={{ marginTop: 20 }}>
          <span>Thu phóng:</span>
          <Slider
            min={0}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(value) => setZoom(value)} // Cập nhật giá trị zoom
          />
        </div>
      </Modal>
    </div>
  );
};

export default UpdateProfile;
