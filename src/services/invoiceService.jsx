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
}
