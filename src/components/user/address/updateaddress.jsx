import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Select, Table, Modal, Switch, Tag, Spin } from "antd";
import { getAddressByUsername, insertAddress, updateAddress, updateAddressActive, findAddressByNameContainsIgnoreCase, deleteAddress } from "../../../redux/actions/addressAction"; // import thêm deleteAddress
import { ADDRESS_APPEND, ADDRESS_UPDATE } from "../../../redux/actions/actionType";

const { Option } = Select;

const UpdateAddress = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const addresses = useSelector((state) => state.addressReducer.addresses || []);
    const loading = useSelector((state) => state.commonReducer.loading);
    const dispatch = useDispatch();
    const username = JSON.parse(localStorage.getItem("user"))?.username;

    useEffect(() => {
        if (username && !searchTerm) {
            dispatch(getAddressByUsername(username));
        }
    }, [username, dispatch, searchTerm]);

    const onFinish = (values) => {
        if (currentAddress) {
            dispatch({
                type: ADDRESS_UPDATE,
                payload: { ...currentAddress, ...values },
            });
        } else {
            dispatch({
                type: ADDRESS_APPEND,
                payload: { ...values, active: true, isDefault: false },
            });
        }
        handleCancel();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentAddress(null);
    };

    const handleEdit = (address) => {
        setCurrentAddress(address);
        setIsModalVisible(true);
    };

    const handleToggleActive = (id, currentActiveStatus) => {
        dispatch(updateAddressActive(id, !currentActiveStatus));
    };

    const handleSetDefault = (id) => {
        addresses.forEach((address) => {
            dispatch({
                type: ADDRESS_UPDATE,
                payload: { ...address, isDefault: address.id === id },
            });
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteAddress(id));
    };


    const handleSearchChange = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);

        if (searchValue) {
            dispatch(findAddressByNameContainsIgnoreCase(searchValue));
        } else {
            if (username) {
                dispatch(getAddressByUsername(username));
            }
        }
    };

    const filteredAddresses = addresses.filter((address) =>
        address.fullAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: "Address",
            dataIndex: "fullAddress",
            key: "fullAddress",
            width: "60%",
        },
        {
            title: "Active",
            key: "active",
            render: (_, record) => (
                <Tag color={record.active ? "green" : "red"}>
                    {record.active ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Switch
                        checked={record.active}
                        onChange={() => handleToggleActive(record.id)}
                    />
                    <Button onClick={() => handleEdit(record)} type="primary">
                        Edit Address
                    </Button>
                    <Button
                        onClick={() => handleSetDefault(record.id)}
                        type="default"
                        style={{
                            backgroundColor: record.isDefault ? "red" : "#F28123",
                            color: "white",
                            border: "none",
                        }}
                        disabled={record.isDefault}
                    >
                        Set as default
                    </Button>
                    <Button onClick={() => handleDelete(record.id)} type="danger">
                        Delete Address
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: '100%', padding: "20px" }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, justifyContent: 'space-between' }}>
                <Input
                    placeholder="Search for addresses"
                    style={{ maxWidth: 300 }}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Add Address
                </Button>
            </div>

            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredAddresses.map((address) => ({ ...address, key: address.id }))}
                    style={{ marginTop: 20 }}
                />
            )}

            <Modal
                title={currentAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    name="update-address"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={currentAddress || {}}
                >
                    <Form.Item
                        label="Tỉnh/Thành phố"
                        name="province"
                        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
                    >
                        <Select placeholder="Chọn Tỉnh/Thành phố">
                            <Option value="An Giang">An Giang</Option>
                            <Option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</Option>
                            <Option value="Bình Dương">Bình Dương</Option>
                            <Option value="Bình Phước">Bình Phước</Option>
                            <Option value="Bình Thuận">Bình Thuận</Option>
                            <Option value="Bình Định">Bình Định</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Quận/Huyện"
                        name="district"
                        rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
                    >
                        <Select placeholder="Chọn Quận/Huyện">
                            <Option value="District1">Quận 1</Option>
                            <Option value="District2">Quận 2</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Phường/Xã"
                        name="ward"
                        rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
                    >
                        <Select placeholder="Chọn Phường/Xã">
                            <Option value="Ward1">Phường 1</Option>
                            <Option value="Ward2">Phường 2</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ chi tiết"
                        name="fullAddress"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {currentAddress ? "Cập nhật" : "Thêm"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UpdateAddress;
