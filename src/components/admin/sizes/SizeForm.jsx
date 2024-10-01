import React, { Component, createRef } from "react";
import { Modal, Form, Input, Select } from "antd";

class SizeForm extends Component {
  formRef = createRef();

  componentDidUpdate(prevProps) {
    if (prevProps.size !== this.props.size && this.props.size) {
      this.formRef.current?.setFieldsValue(this.props.size);
    }
  }

  render() {
    const { open, onSubmitForm, size = {}, onCancel } = this.props;
    const isEdit = !!size.id;
    const title = isEdit ? "Cập nhật Size" : "Thêm mới Size";
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
            name: size.name || "",
            active: size.active !== undefined ? size.active : true,
          }}
        >
          {isEdit && (
            <Form.Item label="Size ID" name="id" initialValue={size.id}>
              <Input readOnly />
            </Form.Item>
          )}
          <Form.Item
            label="Size Name"
            name="name"
            rules={[
              { required: true, message: "Size name is required" },
              {
                min: 2,
                message: "Size name must be at least 2 characters",
              },
              {
                max: 255,
                message: "Size name must not exceed 255 characters",
              },
            ]}
          >
            <Input />
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

export default SizeForm;
