import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Select, Table, Modal, Switch, Tag, Spin } from "antd";
import {
    getAddressByUsername,
    insertAddress,
    updateAddress,
    findAddressByNameContainsIgnoreCase,
    deleteAddress,
    setIsDefault
} from "../../../redux/actions/addressAction";
import { ADDRESS_APPEND, ADDRESS_UPDATE } from "../../../redux/actions/actionType";

const { Option } = Select;

// Helper function to map address to DTO
export const mapAddressToDto = (address) => {
    return {
        id: address.id,
        active: address.active !== undefined ? address.active : true,
        cityCode: address.cityCode,
        districtCode: address.districtCode,
        fullAddress: address.fullAddress,
        isDefault: address.isDefault,
        street: address.street,
        wardCode: address.wardCode,
        account: address.account ? address.account.username : null,
    };
};

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
        const addressDto = mapAddressToDto({ ...currentAddress, ...values });
        if (!currentAddress) {
            addressDto.account = username;
            addressDto.active = true;
        }
        if (currentAddress) {
            dispatch(updateAddress(currentAddress.id, addressDto));
        } else {
            dispatch(insertAddress(addressDto));
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

    const handleSetIsDefault = (id) => {
        dispatch(setIsDefault(id));
    };

    const handleDelete = (id) => {
        const addressToDelete = addresses.find(address => address.id === id);

        if (addressToDelete && addressToDelete.isDefault) {
            Modal.warning({
                title: "Cannot Delete Default Address",
                content: "You cannot delete an address that is set as default.",
            });
            return; // Prevent deletion of default address
        }

        Modal.confirm({
            title: "Are you sure you want to delete this address?",
            content: "This action cannot be undone.",
            onOk() {
                if (id) {
                    dispatch(deleteAddress(id));
                } else {
                    console.error("Attempted to delete an address without a valid ID");
                }
            },
            onCancel() {
                // Optionally handle cancel action
            }
        });
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
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <Button onClick={() => handleEdit(record)} type="primary">
                        Edit Address
                    </Button>
                    <Button
                        onClick={() => handleSetIsDefault(record.id)}
                        type="default"
                        style={{
                            backgroundColor: record.isDefault ? "red" : "#F28123", // Red if default
                            color: "white",
                            border: "none",
                        }}
                        disabled={record.isDefault} // Disable the button if it's already default
                    >
                        Set as default
                    </Button>
                    <Button
                        onClick={() => handleDelete(record.id)}
                        type="danger"
                        disabled={record.isDefault} // Disable delete if it's the default address
                    >
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
                open={isModalVisible} // Use open instead of visible
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
                        name="cityCode"
                        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
                    >
                        <Select placeholder="Chọn Tỉnh/Thành phố">
                            <Option value={1}>An Giang</Option>
                            <Option value={2}>Bà Rịa - Vũng Tàu</Option>
                            <Option value={3}>Bình Dương</Option>
                            <Option value={4}>Bình Phước</Option>
                            <Option value={5}>Bình Thuận</Option>
                            <Option value={6}>Bình Định</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Quận/Huyện"
                        name="districtCode"
                        rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
                    >
                        <Select placeholder="Chọn Quận/Huyện">
                            <Option value={1}>Quận 1</Option>
                            <Option value={2}>Quận 2</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Phường/Xã"
                        name="wardCode"
                        rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
                    >
                        <Select placeholder="Chọn Phường/Xã">
                            <Option value={1}>Phường 1</Option>
                            <Option value={2}>Phường 2</Option>
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
