import axios from "axios";
import { API_TOPPING } from "./constant";


export default class toppingService {
  insertTopping = async (topping) => {
    return await axios.post(API_TOPPING, topping, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  };

  getToppings = async () => {
    return await axios.get(API_TOPPING,
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
        }
      });
  };

  updateToppingActive = async (id, active) => {
    return await axios.patch(
      API_TOPPING + "/" + id + "/toggle-active",
      { active }, // Gửi `active` dưới dạng object
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
        }
      }
    );
  };
  

  findToppingByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_TOPPING + "/find", {
      params: {
        query: query,
      },
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"), 
      },
    });
  };

  updateTopping = async (id, topping) => {
    return await axios.patch(API_TOPPING + "/" + id, topping, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  };

  getTopping = async (id) => {
    return await axios.get(API_TOPPING + "/" + id + "/get", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  };
}

