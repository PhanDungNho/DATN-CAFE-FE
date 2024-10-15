import axios from "axios";
import { API_INVOICE } from "./constant";

export default class invoiceService {
  getInvoices = async () => {
    return await axios.get(API_INVOICE, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  getInvoicesByDate = async (startDate, endDate) => {
    try {
      return await axios.get(API_INVOICE + "/between-dates", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
        },
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  };

  updateOrderActive = async (id, active) => {
    return await axios.patch(
      API_INVOICE + "/" + id + "/toggle-active",
      { active },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
        },
      }
    );
  };

  static getOrderStatus = async () => {
    return await axios.get(API_INVOICE + "/order-statuses", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  updateOrderStatus = async (id, order) => {
    return await axios.patch(API_INVOICE + "/" + id, order, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") 
      }
    });
  }

}
