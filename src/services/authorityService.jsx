import axios from "axios";
import { API_AUTHORITY } from "./constant";


export default class authorityService {

  getAuthorities = async () => {
    return await axios.get(API_AUTHORITY+"?admin=true",
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
        }
      });
  };

  findAuthoritiesByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_AUTHORITY + "/find", {
      params: {
        query: query,
      },
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  // Trao quyền cho tài khoản
  postAuthority = async (authorityDto) => {
    try {
      const response = await axios.post(API_AUTHORITY, authorityDto, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating authority", error);
      throw error;
    }
  };

  // Tước quyền (xóa quyền) của tài khoản
  deleteAuthority = async (id) => {
    try {
      const response = await axios.delete(`${API_AUTHORITY}/${id}`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting authority", error);
      throw error;
    }
  };

}

