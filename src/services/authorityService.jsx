import axios from "axios";
import { API_AUTHORITY } from "./constant";


export default class authorityService {
  
  getAuthorities = async () => {
    return await axios.get(API_AUTHORITY,
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


}

