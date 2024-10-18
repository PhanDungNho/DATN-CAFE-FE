import axios from "axios";
import { API_PRODUCTVARIANT } from "./constant";
import { getProductVariant } from "../redux/actions/productVariantAction";

export default class ProductVariantService {
  insertProductVariant = async (prodcutVariant) => {
    return await axios.post(API_PRODUCTVARIANT, prodcutVariant, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  getProductVariants = async () => {
    return await axios.get(API_PRODUCTVARIANT, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  getProductVariant = async (id) => {
    return await axios.get(API_PRODUCTVARIANT + "/" + id + "/get", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };
}
