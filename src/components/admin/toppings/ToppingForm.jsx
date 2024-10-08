import React, { Component, createRef } from "react";
import { Modal, Form, Input, Select, InputNumber, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

class ToppingForm extends Component {
  formRef = createRef();

  state = {
    fileList: [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.topping !== this.props.topping && this.props.topping) {
      const { topping } = this.props;
      // Nếu topping có hình ảnh, đặt nó vào fileList
      if (topping.image) {
        this.setState({
          fileList: [
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: topping.image, // Đường dẫn hình ảnh
            },
          ],
        });
      } else {
        this.setState({ fileList: [] });
      }

      this.formRef.current?.setFieldsValue({
        ...topping,
        // Đảm bảo rằng trường image được đặt giá trị phù hợp
        image: topping.image ? [topping.image] : [],
      });
    }
  }

  handleUploadChange = ({ fileList }) => {
    // Cập nhật fileList trong state
    this.setState({ fileList });
  };

  beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên các tệp hình ảnh!");
      return Upload.LIST_IGNORE;
    }
    // Ngăn chặn upload tự động
    return false;
  };

  render() {
    const { open, onSubmitForm, topping = {}, onCancel } = this.props;
    const { fileList } = this.state;
    const isEdit = !!topping.id;
    const title = isEdit ? "Cập nhật Topping" : "Thêm mới Topping";
    const okText = isEdit ? "Cập nhật" : "Lưu";

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
              // Kiểm tra xem có hình ảnh được tải lên không
              if (fileList.length === 0) {
                message.error("Vui lòng tải lên hình ảnh cho topping.");
                return;
              }

              // Đính kèm danh sách file vào giá trị gửi đi
              // Bạn có thể xử lý `fileList` tùy theo yêu cầu backend của bạn
              const processedImage = fileList.map(file => {
                if (file.originFileObj) {
                  return file.originFileObj;
                }
                return file.url;
              });

              const submitValues = {
                ...values,
                image: processedImage,
              };

              this.formRef.current.resetFields();
              this.setState({ fileList: [] });
              onSubmitForm(submitValues);
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
            // Đảm bảo rằng trường image được đặt giá trị phù hợp
            image: topping.image ? [topping.image] : [],
          }}
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
                type: 'number',
                min: 0,
                message: "Price must be a positive number",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[
              { required: true, message: "Please upload an image" },
            ]}
          >
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={this.handleUploadChange}
              beforeUpload={this.beforeUpload}
              multiple={false}
            >
              {fileList.length >= 1 ? null : (
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              )}
            </Upload>
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
        </Form>
      </Modal>
    );
  }
}

export default ToppingForm;
