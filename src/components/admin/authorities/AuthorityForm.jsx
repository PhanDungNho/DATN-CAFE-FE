// src/components/AuthorityForm.jsx

import React, { Component } from "react";
import { Modal, Form, Input, Select, Checkbox } from "antd";

class AuthorityForm extends Component {
    formRef = React.createRef();

    componentDidUpdate(prevProps) {
        if (prevProps.size !== this.props.size && this.props.size) {
            this.formRef.current?.setFieldsValue(this.props.size);
        }
    }

    render() {
        const { open, onSubmitForm, size = {}, onCancel } = this.props;
        const isEdit = !!size.id;
        const title = isEdit ? "Update Authority" : "Add New Authority";
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
                        name: size.name || "",
                        active: size.active !== undefined ? size.active : true,
                        customer: size.customer || false,
                        staff: size.staff || false,
                        director: size.director || false,
                    }}
                >
                    {isEdit && (
                        <Form.Item label="Authority ID" name="id" initialValue={size.id}>
                            <Input readOnly />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Authority Name"
                        name="name"
                        rules={[
                            { required: true, message: "Authority name is required" },
                            {
                                min: 2,
                                message: "Authority name must be at least 2 characters",
                            },
                            {
                                max: 255,
                                message: "Authority name must not exceed 255 characters",
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
                    <Form.Item label="Roles" name="roles">
                        <Checkbox.Group>
                            <Checkbox value="customer" style={{ lineHeight: '32px' }}>
                                Customer
                            </Checkbox>
                            <Checkbox value="staff" style={{ lineHeight: '32px' }}>
                                Staff
                            </Checkbox>
                            <Checkbox value="director" style={{ lineHeight: '32px' }}>
                                Director
                            </Checkbox>
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default AuthorityForm;
