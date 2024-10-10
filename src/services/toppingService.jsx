import axios from "axios";
import { API_TOPPING } from "./constant";

export default class ToppingService {
  insertTopping = (topping) => {
    const formData = new FormData();
  
    // Append topping fields to FormData
    formData.append("name", topping.name);
    formData.append("price", topping.price);
    formData.append("active", topping.active);
  
    if (topping.imageFile[0].originFileObj) {
      formData.append("imageFile", topping.imageFile[0].originFileObj);
    }
  
    console.log("Topping insert data:", [...formData]);
  
    // Send the POST request with the form data
    return axios.post(API_TOPPING, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  updateTopping = async (id, topping) => {
    let formData = new FormData();

    formData.append("name", topping.name);
    formData.append("price", topping.price);
    formData.append("active", topping.active);

    if (topping.imageFile[0].originFileObj) {
      formData.append("imageFile", topping.imageFile[0].originFileObj);
    }

    return axios.patch(API_TOPPING + "/" + id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  getToppings = async () => {
    return await axios.get(API_TOPPING, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  getTopping = async (id) => {
    return await axios.get(API_TOPPING + "/" + id + "/get", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  updateToppingActive = async (id, active) => {
    return await axios.patch(
      API_TOPPING + "/" + id + "/toggle-active",
      { active }, // Gửi `active` dưới dạng object
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
        },
      }
    );
  };

  findToppingByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_TOPPING + "/find", {
      params: {
        query: query,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  static getToppingLogoUrl = (filename) => {
    return API_TOPPING + "/image/" + filename;
  };
}
