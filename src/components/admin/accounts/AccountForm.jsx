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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AccountService from "../../../services/accountService";

class AccountForm extends Component {
  formRef = createRef();

  constructor(props) {
    super(props);

    this.state = {
      account: { username: "", fullName: "", amountPaid: "", email: "", password: "", phone: "", image: "", active: true },
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
    const title = isEdit ? "Cập nhật Account" : "Thêm mới Account";
    const okText = isEdit ? "Cập nhật" : "Lưu";

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
              onSubmitForm(values);
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
            amountPaid: account.amountPaid || "",
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
              { required: true, message: "Username là bắt buộc" },
              {
                min: 2,
                message: "Username không được dưới 2 kí tự",
              },
              {
                max: 255,
                message: "Username không được vượt quá 255 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              { required: true, message: "Họ và tên là bắt buộc" },
              {
                min: 2,
                message: "Họ và tên không được dưới 2 kí tự",
              },
              {
                max: 255,
                message: "Họ và tên không được vượt quá 255 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: !isEdit, // Bắt buộc khi không phải là edit (thêm mới)
                message: "Mật khẩu là bắt buộc",
              },
              {
                min: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự",
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Số tiền đã trả"
            name="amountPaid"
            rules={[
              { required: true, message: "Số tiền đã trả là bắt buộc" },
              {
                type: "number",
                min: 0,
                message: "Số tiền đã trả phải lớn hơn 0",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Số điện thoại là bắt buộc" },
              {
                len: 10,
                message: "Số điện thoại phải là 10 số",
              },
              {
                pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                message: "Số điện thoại không hợp lệ. Phải là số điện thoại Việt Nam hợp lệ",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email là bắt buộc" },
              {
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="active"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái hoạt động" },
            ]}
          >
            <Select>
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="imageFile"
            initialValue={[initialLogo]}
            valuePropName="fileList"
            getValueFromEvent={this.normFile}
            rules={[{ required: true, message: "Vui lòng tải lên một hình ảnh" }]}
          >
            <Upload
              listType="picture"
              onPreview={this.handlePreview}
              onRemove={this.handleRemove}
              accept=".jpg, .png, .gif"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Bấm để tải lên
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
