import axios from "axios";
import { API_PRODUCTVARIANT } from "./constant";

export default class ProductVariantService {
  insertProductVariant = async (productVariant) => {
    return await axios.post(API_PRODUCTVARIANT, productVariant, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  updateProductVariant = async (id, productVariant) => {
    return await axios.patch(API_PRODUCTVARIANT + "/" + id, productVariant, {
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

  updateProductVariantActive = async (id, active) => {
    return await axios.patch(
      API_PRODUCTVARIANT + "/" + id + "/toggle-active",
      { active },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
        },
      }
    );
  };

  findProductVariantByName = async (productName) => {
    return await axios.get(API_PRODUCTVARIANT + "/find", {
      params: { productName: productName },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };
}
