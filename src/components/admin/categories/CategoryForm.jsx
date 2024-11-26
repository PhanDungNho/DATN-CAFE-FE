import React, { Component, createRef } from "react";
import { Modal, Form, Input, Select } from "antd";

class CategoryForm extends Component {
  formRef = createRef();

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category && this.props.category) {
      this.formRef.current?.setFieldsValue(this.props.category);
    }
  }

  render() {
    const { open, onSubmitForm, category = {}, onCancel } = this.props;
    const isEdit = !!category.id;
    const title = isEdit ? "Update Category" : "Add new Category";
    const okText = isEdit ? "Update" : "Save";

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
            name: category.name || "",
            active: category.active !== undefined ? category.active : true,
          }}
        >
          {isEdit && (
            <Form.Item label="Category ID" name="id" initialValue={category.id}>
              <Input readOnly />
            </Form.Item>
          )}
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              { required: true, message: "Category name is required" },
              {
                min: 2,
                message: "Category name must be at least 2 characters",
              },
              {
                max: 255,
                message: "Category name must not exceed 255 characters",
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
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CategoryForm;
