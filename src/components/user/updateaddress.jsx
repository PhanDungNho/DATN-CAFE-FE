import React, { useState } from "react";
import { Form, Input, Button, Select, Radio, Table, Modal } from "antd";

const { Option } = Select;

const UpdateAddress = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addresses, setAddresses] = useState([
    { key: 1, name: "Lê Quang Vinh", phone: "+84336179835", province: "An Giang", district: "District1", ward: "Ward1", address: "Nhà Trọ Dũng Khanh 2", addressType: "home" },
    { key: 2, name: "Nguyễn Văn A", phone: "+84336179836", province: "Bình Dương", district: "District2", ward: "Ward2", address: "Nhà Trọ Bình Minh", addressType: "home" },
    { key: 3, name: "Trần Thị B", phone: "+84336179837", province: "Bình Thuận", district: "District1", ward: "Ward1", address: "Văn Phòng Công Ty XYZ", addressType: "office" },
  ]);

  // Hàm xử lý khi form được submit
  const onFinish = (values) => {
    if (currentAddress) {
      // Cập nhật địa chỉ
      setAddresses((prev) =>
        prev.map((address) =>
          address.key === currentAddress.key ? { ...address, ...values } : address
        )
      );
    } else {
      // Thêm địa chỉ mới
      const newAddress = { key: Date.now(), ...values }; // Tạo key duy nhất cho mỗi địa chỉ
      setAddresses((prev) => [...prev, newAddress]);
    }
    handleCancel(); // Đóng modal sau khi hoàn thành
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentAddress(null); // Reset địa chỉ hiện tại
  };

  const handleEdit = (address) => {
    setCurrentAddress(address);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setAddresses((prev) => prev.filter((address) => address.key !== key));
  };

  const columns = [
    { title: "Họ và tên", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Tỉnh/Thành phố", dataIndex: "province", key: "province" },
    { title: "Quận/Huyện", dataIndex: "district", key: "district" },
    { title: "Phường/Xã", dataIndex: "ward", key: "ward" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} type="link">Cập nhật</Button>
          <Button onClick={() => handleDelete(record.key)} type="link" danger>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '100%', padding: "20px" }}>
      <h2>Cập nhật địa chỉ</h2>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Thêm địa chỉ
      </Button>
      
      <Table
        columns={columns}
        dataSource={addresses}
        style={{ marginTop: 20 }}
      />

      <Modal
        title={currentAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Không hiển thị footer tự động
      >
        <Form
          name="update-address"
          layout="vertical"
          onFinish={onFinish}
          initialValues={currentAddress || {}} // Thiết lập giá trị mặc định cho form
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Lê Quang Vinh" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: new RegExp(/^\+84\d{9}$/),
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="(+84) 336 179 835" />
          </Form.Item>

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
              {/* Thêm các quận/huyện khác */}
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
              {/* Thêm các phường/xã khác */}
            </Select>
          </Form.Item>

          <Form.Item
            label="Địa chỉ cụ thể"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }]}
          >
            <Input placeholder="Nhà Trọ Dũng Khanh 2" />
          </Form.Item>

          <Form.Item
            label="Loại địa chỉ"
            name="addressType"
            rules={[{ required: true, message: "Vui lòng chọn loại địa chỉ!" }]}
          >
            <Radio.Group>
              <Radio value="home">Nhà Riêng</Radio>
              <Radio value="office">Văn Phòng</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateAddress;
