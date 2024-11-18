import axios from "axios";
import { API_ADDRESS } from "./constant";

export default class addressService {
  getAddresses = async () => {
    return await axios.get(API_ADDRESS, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  findAddressesByAccountUsername = async (username) => {
    return await axios.get(API_ADDRESS + "/" + username + "/get", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };
  // Tìm địa chỉ theo chuỗi tìm kiếm trong địa chỉ đầy đủ
  getAddressByName = async (query) => {
    return await axios.get(`${API_ADDRESS}/find`, {
      params: { query },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Tạo mới địa chỉ
  createAddress = async (addressDto) => {
    return await axios.post(API_ADDRESS, addressDto, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Cập nhật địa chỉ
  updateAddress = async (id, addressDto) => {
    return await axios.patch(`${API_ADDRESS}/${id}`, addressDto, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Đặt một địa chỉ là mặc định (isDefault)
  setIsDefault = async (addressId) => {
    return await axios.patch(
      `${API_ADDRESS}/${addressId}/setIsDefault`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
  };

  // Toggle trạng thái active của một địa chỉ
  toggleActive = async (addressId) => {
    return await axios.patch(
      `${API_ADDRESS}/${addressId}/toggle-active`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
  };

  deleteAddress = async (id) => {
    return await axios.delete(`${API_ADDRESS}/${id}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
  };
  
}
