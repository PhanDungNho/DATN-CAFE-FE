import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Select, Table, Modal, Spin } from "antd";
import {
  getAddressByUsername,
  insertAddress,
  updateAddress,
  findAddressByNameContainsIgnoreCase,
  deleteAddress,
  setIsDefault,
} from "../../../redux/actions/addressAction";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "../../../services/constant";

const { Option } = Select;

export const mapAddressToDto = (address) => ({
  id: address.id,
  active: address.active !== undefined ? address.active : true,
  cityCode: address.cityCode,
  districtCode: address.districtCode,
  fullAddress: address.fullAddress,
  isDefault: address.isDefault,
  street: address.street,
  wardCode: address.wardCode,
  account: address.account ? address.account.username : null,
});

const UpdateAddress = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const addresses = useSelector(
    (state) => state.addressReducer.addresses || []
  );
  const loading = useSelector((state) => state.commonReducer.loading);
  const dispatch = useDispatch();
  const username = JSON.parse(localStorage.getItem("user"))?.username;

  // Form instance
  const [form] = Form.useForm();

  useEffect(() => {
    if (username && !searchTerm) {
      dispatch(getAddressByUsername(username))
        .then((result) => {
          const addresses = result || [];
          addresses.forEach(async (address) => {
            if (address.wardCode) await handleWardChange(address.wardCode);
            if (address.cityCode) await handleProvinceChange(address.cityCode);
            if (address.districtCode)
              await handleDistrictChange(address.districtCode);
          });
        })
        .catch((error) => {
          console.error("Failed to fetch addresses:", error);
        });
    }
    loadProvinces();
  }, [username, dispatch, searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      dispatch(findAddressByNameContainsIgnoreCase(searchTerm));
    } else {
      dispatch(getAddressByUsername(username));
    }
  }, [searchTerm, dispatch, username]);

  const loadProvinces = async () => {
    try {
      const provinceData = await fetchProvinces();

      // Lọc ra thành phố "Cần Thơ"
      const canTho = provinceData.find(
        (province) => province.ProvinceName === "Cần Thơ"
      );

      if (canTho) {
        setProvinces([canTho]); // Chỉ đặt "Cần Thơ" trong danh sách tỉnh/thành phố
        form.setFieldsValue({ cityCode: canTho.ProvinceID }); // Đặt giá trị mặc định

        // Gọi hàm để tải danh sách quận/huyện của Cần Thơ
        await handleProvinceChange(canTho.ProvinceID);
      } else {
        console.error("Cần Thơ không có trong danh sách tỉnh/thành phố.");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách tỉnh/thành phố:", error);
    }
  };

  const handleProvinceChange = async (value) => {
    setDistricts([]);
    setWards([]);
    if (value) {
      const districtData = await fetchDistricts(value);
      setDistricts(districtData); // Load new district names based on city
      form.setFieldsValue({ districtCode: undefined, wardCode: undefined }); // Reset district and ward fields
    }
  };

  const handleDistrictChange = async (value) => {
    setWards([]);
    if (value) {
      const wardData = await fetchWards(value);
      setWards(wardData); // Load new ward names based on district
      form.setFieldsValue({ wardCode: undefined }); // Reset ward field
    }
  };

  const handleWardChange = (value) => {};

  const mapAddressWithNames = (address) => {
    const provinceName =
      provinces.find((p) => p.ProvinceID === address.cityCode)?.ProvinceName ||
      "Unknown City";
    const districtName =
      districts.find((d) => d.DistrictID === address.districtCode)
        ?.DistrictName || "Unknown District";
    const wardName =
      wards.find((w) => w.WardID === address.wardCode)?.WardName ||
      "Unknown District";

    return {
      ...address,
      cityName: provinceName,
      districtName: districtName,
      wardName: wardName,
      street: address.street || "",
    };
  };

  useEffect(() => {
    if (currentAddress) {
      form.setFieldsValue(mapAddressWithNames(currentAddress));
    } else {
      form.resetFields();
    }
  }, [currentAddress, form]);

  const onFinish = (values) => {
    const provinceName =
      provinces.find((p) => p.ProvinceID === values.cityCode)?.ProvinceName ||
      "Unknown City";
    const districtName =
      districts.find((d) => d.DistrictID === values.districtCode)
        ?.DistrictName || "Unknown District";
    const wardName =
      wards.find((w) => w.WardCode === values.wardCode)?.WardName ||
      "Unknown Ward";

    const fullAddressText = `${values.street}, ${wardName}, ${districtName}, ${provinceName}`;

    const addressDto = mapAddressToDto({
      ...currentAddress,
      ...values,
      fullAddress: fullAddressText,
    });

    if (!currentAddress) {
      addressDto.account = username;
      addressDto.active = true;
    }

    if (currentAddress) {
      dispatch(updateAddress(currentAddress.id, addressDto));
    } else {
      dispatch(insertAddress(addressDto)).then(() => {
        form.resetFields();
        handleCancel();
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentAddress(null);
  };

  const handleEdit = async (address) => {
    setCurrentAddress(address);
    setIsModalVisible(true);

    if (address.cityCode) {
      const districtData = await fetchDistricts(address.cityCode);
      setDistricts(districtData);

      if (address.districtCode) {
        const wardData = await fetchWards(address.districtCode);
        setWards(wardData);

        console.log("Fetched Wards:", wardData);

        const selectedWard = wardData.find(
          (ward) => String(ward.WardCode) === String(address.wardCode)
        );

        if (selectedWard) {
          form.setFieldsValue({
            ...mapAddressWithNames(address),
            wardCode: selectedWard.WardCode,
            wardName: selectedWard.WardName,
          });
        } else {
          form.setFieldsValue({
            ...mapAddressWithNames(address),
            wardCode: undefined,
            wardName: undefined,
          });
        }
      }
    } else {
      form.setFieldsValue(mapAddressWithNames(address));
    }
  };

  const confirmDelete = (addressId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this address?",
      content: "Once deleted, this action cannot be undone.",
      onOk: () => dispatch(deleteAddress(addressId)),
      onCancel: () => console.log("Delete action canceled"),
    });
  };

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search for addresses"
          style={{ maxWidth: 300 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Address
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={[
            {
              title: "Address",
              dataIndex: "fullAddress",
              key: "fullAddress",
              width: "60%",
              render: (_, record) => record.fullAddress,
            },
            {
              title: "Action",
              key: "action",
              render: (_, record) => (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Button onClick={() => handleEdit(record)} type="primary">
                    Edit Address
                  </Button>
                  <Button
                    onClick={() => dispatch(setIsDefault(record.id))}
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
                  <Button
                    onClick={() => confirmDelete(record.id)} // Confirm delete action
                    type="danger"
                    disabled={record.isDefault}
                  >
                    Delete Address
                  </Button>
                </div>
              ),
            },
          ]}
          dataSource={addresses.map((address) => ({
            ...address,
            key: address.id,
          }))}
          style={{ marginTop: 20 }}
        />
      )}

      <Modal
        title={currentAddress ? "Update address" : "Add address"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="update-address"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Province/City"
            name="cityCode"
            rules={[
              { required: true, message: "Please select province/city!" },
            ]}
          >
            <Select
              placeholder="Select Province/City"
              onChange={handleProvinceChange}
              value={currentAddress?.cityCode}
            >
              {provinces.map((province) => (
                <Option key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="District/District"
            name="districtCode"
            rules={[{ required: true, message: "Please select District!" }]}
          >
            <Select
              placeholder="Select District/District"
              onChange={handleDistrictChange}
              value={currentAddress?.districtCode}
              disabled={!districts.length}
            >
              {districts.map((district) => (
                <Option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ward/Commune"
            name="wardCode"
            rules={[{ required: true, message: "Please select ward/commune!" }]}
          >
            <Select
              placeholder="Select Ward/Commune"
              onChange={handleWardChange}
              value={currentAddress?.wardCode}
              disabled={!wards.length}
            >
              {wards.map((ward) => (
                <Option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Detailed address"
            name="street"
            rules={[
              { required: true, message: "Please enter detailed address!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {currentAddress ? "Update Address" : "Add Address"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateAddress;
