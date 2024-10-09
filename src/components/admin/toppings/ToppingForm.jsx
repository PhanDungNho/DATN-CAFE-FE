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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ToppingService from "../../../services/toppingService";

class ToppingForm extends Component {
  formRef = createRef();

  constructor(props) {
    super(props);

    this.state = {
      topping: { id: "", name: "", image: "", price: "", active: true },
      previewImage: "",
      previewVisible: false,
    };
  }

  componentDidMount() {
    const { topping } = this.props;
    if (topping && topping.image) {
      const logoUrl = ToppingService.getToppingLogoUrl(topping.image);
      this.setState({
        fileList: [
          {
            uid: "-1",
            name: topping.image,
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
    const { open, onSubmitForm, topping = {}, onCancel } = this.props;
    const isEdit = !!topping.id;
    const title = isEdit ? "Cập nhật Topping" : "Thêm mới Topping";
    const okText = isEdit ? "Cập nhật" : "Lưu";

    const logoUrl = ToppingService.getToppingLogoUrl(topping.image);

    const initialLogo = {
      url: logoUrl,
      uid: topping.image,
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
            name: topping.name || "",
            price: topping.price || 0,
            active: topping.active !== undefined ? topping.active : true,
          }}
          key={topping.id + topping.name + topping.image}
        >
          {isEdit && (
            <Form.Item label="Topping ID" name="id" initialValue={topping.id}>
              <Input readOnly />
            </Form.Item>
          )}

          <Form.Item
            label="Topping Name"
            name="name"
            rules={[
              { required: true, message: "Topping name is required" },
              {
                min: 2,
                message: "Topping name must be at least 2 characters",
              },
              {
                max: 255,
                message: "Topping name must not exceed 255 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Price is required" },
              {
                type: "number",
                min: 0,
                message: "Price must be a positive number",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Active"
            name="active"
            rules={[
              { required: true, message: "Please select the active status" },
            ]}
          >
            <Select>
              <Select.Option value={true}>Visible</Select.Option>
              <Select.Option value={false}>In-Visible</Select.Option>
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
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Divider></Divider>
          {/*
          {this.state.previewVisible && (
            <Image
              src={this.state.previewImage}
              style={{ width: 200 }}
              preview={{ visible: false }}
            ></Image>
          )} 
          */}
        </Form>
      </Modal>
    );
  }
}

export default ToppingForm;
