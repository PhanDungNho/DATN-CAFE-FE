import React, { Component, createRef } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
  Divider,
  Image,
  message 
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AccountService from "../../../services/accountService";

class AccountForm extends Component {
  formRef = createRef();

  constructor(props) {
    super(props);

    this.state = {
      account: { username: "", fullName: "", email: "", password: "", phone: "", image: "", active: true },
      previewImage: "",
      previewVisible: false,
    };
  }

  componentDidMount() {
    const { account } = this.props;
    if (account && account.image) {
      const logoUrl = AccountService.getAccountLogoUrl(account.image);
      this.setState({
        fileList: [
          {
            uid: "-1",
            name: account.image,
            status: "done",
            url: logoUrl,
          },
        ],
      });
    }
  }

  handlePreview = (file) => {
    console.log(file);

    if (file.thumbUrl) {
      this.setState({
        ...this.state,
        previewImage: file.thumbUrl,
        previewVisible: true,
      });
    }
  };

 
  handleRemove = (value) => {
    console.log(value);
  };

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e.fileList.Length > 1) {
      return [e.fileList[1]];
    }

    return e && e.fileList;
  };

  render() {
    const { open, onSubmitForm, account = {}, onCancel } = this.props;
    const isEdit = !!account.username;
    const title = isEdit ? "Update Account" : "Add Account";
    const okText = isEdit ? "Update" : "Save";

    const logoUrl = AccountService.getAccountLogoUrl(account.image);

    const initialLogo = {
      url: logoUrl,
      uid: account.image,
    };

    return (
      <Modal
        open={open}
        title={title}
        okText={okText}
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          this.formRef.current
            .validateFields()
            .then((values) => {
              this.formRef.current.resetFields();
              onSubmitForm(values).catch(this.handleError); // Handling errors after submitting
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          ref={this.formRef}
          layout="vertical"
          initialValues={{
            username: account.username || "",
            fullName: account.fullName || "",
            password: "",
            email: account.email || "",
            phone: account.phone || "",
            active: account.active !== undefined ? account.active : true,
          }}
          key={account.username + account.image}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Username is required" },
              {
                min: 2,
                message: "Username cannot be less than 2 characters",
              },
              {
                max: 255,
                message: "Username must not exceed 255 characters",
              },
            ]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
          <Form.Item
            label="Full name"
            name="fullName"
            rules={[
              { required: true, message: "Full name is required" },
              {
                min: 2,
                message: "Full name must not be less than 2 characters",
              },
              {
                max: 255,
                message: "Full name must not exceed 255 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: !isEdit, // Bắt buộc khi không phải là edit (thêm mới)
                message: "Password is required",
              },
              {
                min: 8,
                message: "Password must have at least 8 characters",
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Password must include uppercase letters, lowercase letters, numbers and special characters",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          
          <Form.Item
            label="Phone number"
            name="phone"
            rules={[
              { required: true, message: "Phone number is required" },
              {
                len: 10,
                message: "Phone number must be 10 digits",
              },
              {
                pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                message: "Invalid phone number. Must be a valid Vietnamese phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              {
                type: "email",
                message: "Invalid email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Active"
            name="active"
            rules={[
              { required: true, message: "Please select an active status" },
            ]}
          >
            <Select>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Image"
            name="imageFile"
            initialValue={[initialLogo]}
            valuePropName="fileList"
            getValueFromEvent={this.normFile}
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload
              listType="picture"
              onPreview={this.handlePreview}
              onRemove={this.handleRemove}
              accept=".jpg, .png, .gif"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to upload
              </Button>
            </Upload>
          </Form.Item>
          <Divider></Divider>

          {this.state.previewVisible && (
            <Image
              src={this.state.previewImage}
              style={{ width: 200 }}
              preview={{ visible: false }}
            ></Image>
          )}
        </Form>
      </Modal>
    );
  }
}

export default AccountForm;
