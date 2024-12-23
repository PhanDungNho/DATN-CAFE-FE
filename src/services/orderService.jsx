import axios from "axios";
import { API_ORDER, API_TRANSACTION } from "./constant";

export default class OrderService {
  // Thêm đơn hàng mới
  insertOrder = async (order) => {
    return await axios.post(API_ORDER, order, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Cập nhật đơn hàng theo ID
  updateOrder = async (id, order) => {
    return await axios.patch(API_ORDER + "/" + id, order, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Lấy tất cả đơn hàng
  getOrders = async () => {
    return await axios.get(API_ORDER, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Lấy đơn hàng theo ID
  getOrder = async (id) => {
    return await axios.get(API_ORDER + "/" + id + "/get", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Cập nhật trạng thái hoạt động của đơn hàng
  updateOrderActive = async (id, active) => {
    return await axios.patch(
      API_ORDER + "/" + id + "/toggle-active",
      { active },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
  };

  // Tìm đơn hàng theo tên
  findOrderByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_ORDER + "/find", {
      params: {
        query: query,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Xóa đơn hàng theo ID
  deleteOrderById = async (id) => {
    return await axios.delete(API_ORDER + "/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Đếm số lượng đơn hàng
  countOrders = async () => {
    return await axios.get(API_ORDER + "/count", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };
}
