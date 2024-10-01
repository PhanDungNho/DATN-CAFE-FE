import axios from "axios";
import { API_CATEGORY } from "./constant";

export default class categoryService {
  insertCategory = async (category) => {
    return await axios.post(API_CATEGORY, category, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  };
  

  updateCategory = async (id, category) => {
    return await axios.patch(API_CATEGORY + "/" + id, category, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  };
  

getCategories = async () => {
  return await axios.get(API_CATEGORY, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
    }
  });
};

getCategory = async (id) => {
  return await axios.get(API_CATEGORY + "/" + id + "/get", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
    }
  });
};

  updateCategoryActive = async (id, active) => {
    return await axios.patch(
      API_CATEGORY + "/" + id + "/toggle-active",
      { active }, // Gửi `active` dưới dạng object
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
        }
      }
    );
  };
  

  findCategoryByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_CATEGORY + "/find", {
      params: {
        query: query,
      },
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"), 
      },
    });
  };
}
