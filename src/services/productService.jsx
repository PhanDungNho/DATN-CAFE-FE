import axios from "axios";
import { API_PRODUCT } from "./constant";

export default class ProductService {
  insertProduct(product) {
    const formData = new FormData();

    // Append product fields to FormData
    formData.append("name", product.name);
    formData.append("active", product.active);
    formData.append("description", product.description);
    formData.append("categoryid", product.categoryid);

    // Append image files
    product.imageFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });

    console.log("insert nè", [...formData]); 

    return axios.post(API_PRODUCT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  updateProduct = async (id, product) => {
    const formData = new FormData();

    // Append product fields to FormData
    formData.append("name", product.name);
    formData.append("active", product.active);
    formData.append("description", product.description);
    formData.append("categoryid", product.categoryid);

    // Append image files
    product.imageFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });

    console.log([...formData]); 

    return axios.patch(API_PRODUCT + "/" + id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  getProducts = async () => {
    return await axios.get(API_PRODUCT, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  getProductsByName = async (params) => {
    return await axios.get(API_PRODUCT + "/find", {
      params,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  getProduct = async (id) => {
    return await axios.get(API_PRODUCT + "/" + id + "/get", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  static deleteProductImage = async (fileName) => {
    await axios.delete(API_PRODUCT + "/images/" + fileName, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  static getProductImageUrl = (fileName) => {
    return API_PRODUCT + "/images/" + fileName;
  };

  static getProductImageUploadUrl = () => {
    return API_PRODUCT + "/images/one";
  };

  updateProductActive = async (id, active) => {
    return await axios.patch(
      API_PRODUCT + "/" + id + "/toggle-active",
      { active }, // Gửi `active` dưới dạng object
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
        },
      }
    );
  };

  findProductByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_PRODUCT + "/find", {
      params: {
        query: query,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  async uploadImages(formData) {
    const response = await axios.post(
      "http://localhost:8081/api/v1/products/images/", // Địa chỉ API của bạn
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }
}
