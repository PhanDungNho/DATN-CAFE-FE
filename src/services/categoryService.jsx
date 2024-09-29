import axios from "axios";
import { API_CATEGORY } from "./constant";

export default class categoryService {
  insertCategory = async (category) => {
    return await axios.post(API_CATEGORY, category);
  };

  updateCategory = async (id, category) => {
    return await axios.patch(API_CATEGORY + "/" + id, category);
  };

  getCategories = async () => {
    return await axios.get(API_CATEGORY);
  };

  getCategory = async (id) => {
    return await axios.get(API_CATEGORY + "/" + id + "/get");
  };

  updateCategoryActive = async (id, active) => {
    return await axios.patch(
      API_CATEGORY + "/" + id + "/toggle-active",
      active
    );
  };

  findCategoryByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_CATEGORY + "/find", {
      params: {
        query: query,
      },
    });
  };
}
