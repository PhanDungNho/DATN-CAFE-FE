import axios from "axios";
import { API_ORDER, API_TRANSACTION } from "./constant";

export default class OrderService {
  insertOrder = async (order) => {
    return await axios.post(API_ORDER, order, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  updateOrder = async (id, order) => {
    return await axios.patch(API_ORDER + "/" + id, order, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  getOrders = async () => {
    return await axios.get(API_ORDER, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  getOrder = async (id) => {
    return await axios.get(API_ORDER + "/" + id + "/get", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  updateOrderActive = async (id, active) => {
    return await axios.patch(
      API_ORDER + "/" + id + "/toggle-active",
      { active }, // Gửi `active` dưới dạng object
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
        },
      }
    );
  };

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

  deleteOrderById = async (id) => {
    return await axios.delete(API_ORDER + "/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };
}
