import axios from "axios";
import { API_SIZE } from "./constant";


export default class sizeService {
  insertSize = async (size) => {
    return await axios.post(API_SIZE, size, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  };

  getSizes = async () => {
    return await axios.get(API_SIZE,
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
        }
      });
  };

  updateSizeActive = async (id, active) => {
    return await axios.patch(
      API_SIZE + "/" + id + "/toggle-active",
      { active }, // Gửi `active` dưới dạng object
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
        }
      }
    );
  };
  

  findSizeByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_SIZE + "/find", {
      params: {
        query: query,
      },
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"), 
      },
    });
  };

  updateSize = async (id, size) => {
    return await axios.patch(API_SIZE + "/" + id, size, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  };
}

