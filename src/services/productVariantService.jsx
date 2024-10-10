import axios from "axios";
import { API_PRODUCT } from "./constant";

export default class ProductService {
  getProducts = async () => {
    return await axios.get(API_PRODUCT, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  }

  getProduct = async (id) => {
    return await axios.get(API_PRODUCT + "/" + id + "/get", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  }
}

