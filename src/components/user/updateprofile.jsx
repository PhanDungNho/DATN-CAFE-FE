import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Upload, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AvatarEditor from "react-avatar-editor";

const UpdateProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imageFileList, setImageFileList] = useState([]); // To store the uploaded image list
  const [editor, setEditor] = useState(null); // State for AvatarEditor
  const [cropModalVisible, setCropModalVisible] = useState(false); // Modal visibility for cropping
  const [croppedImage, setCroppedImage] = useState(null); // Cropped image blob
  const [account, setAccount] = useState(null); // State to hold account info, including image

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
        setAccount(profileData); // Set the account data in state

        form.setFieldsValue({
          name: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          password: "", // Optional field for new password
        });

        // If the profile has an image, set it in the imageFileList
        if (profileData.image) {
          setImageFileList([
            {
              uid: "-1",
              name: profileData.image,
              status: "done",
              url: `http://localhost:8081/api/files/logo/${profileData.image}`, // Full URL to the image
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

      // If there's a cropped image, append it to the form data
      if (croppedImage) {
        formData.append("imageFile", croppedImage, "profile.jpg");
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

      message.success("Profile updated successfully!");
    } catch (error) {
      const errorResponse = error.response?.data;
      const errorMessage =
        errorResponse && errorResponse.message
          ? errorResponse.message
          : "Failed to update information. Please try again.";

      if (errorMessage === "Email đã tồn tại.") {
        message.error("Email already exists.");
      } else {
        message.error(errorMessage);
      }
    }
  };

  const handleCropImage = () => {
    if (editor) {
      // Convert the cropped image to Blob and save it
      editor.getImageScaledToCanvas().toBlob((blob) => {
        setCroppedImage(blob); // Save the cropped image
        setCropModalVisible(false); // Close the crop modal
        message.success("Cropped image saved successfully!");
      });
    }
  };

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
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
            { min: 8, message: "Password must be at least 8 characters!" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, and one number!",
            },
          ]}
        >
          <Input.Password placeholder="Enter new password (optional)" />
        </Form.Item>

        <Form.Item label="Profile Picture">
  <Upload
    name="imageFile"
    listType="picture"
    maxCount={1}
    accept="image/*"  // Chỉ chấp nhận các file hình ảnh
    beforeUpload={(file) => {
      setCropModalVisible(true); // Mở modal cắt ảnh
      const reader = new FileReader();
      reader.onload = () => {
        setImageFileList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: reader.result,
            originFileObj: file,
          },
        ]);
      };
      reader.readAsDataURL(file);
      return false; // Ngừng tải lên tự động
    }}
    fileList={imageFileList}
    onRemove={() => {
      setImageFileList([]);
      setCroppedImage(null); // Xóa hình đã cắt khi xóa ảnh
    }}
  >
    <Button icon={<UploadOutlined />}>Upload Image</Button>
  </Upload>
</Form.Item>


        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Information
          </Button>
        </Form.Item>
      </Form>

      {/* Crop Modal */}
      <Modal
        title="Crop Image"
        visible={cropModalVisible}
        onOk={handleCropImage}
        onCancel={() => setCropModalVisible(false)}
      >
        <AvatarEditor
          ref={(ref) => setEditor(ref)}
          image={imageFileList[0]?.url}
          width={350}
          height={350}
          border={50}
          scale={1.25} // Zoom level
          rotate={0} // No rotation
        />
      </Modal>
    </div>
  );
};

export default UpdateProfile;
