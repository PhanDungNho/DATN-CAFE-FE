import axios from "axios";
import { API_ACCOUNT } from "./constant";

export default class AccountService {
  insertAccount = async (account) => {
    return await axios.post(API_ACCOUNT, account, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  };
  

  updateAccount = async (id, account) => {
    return await axios.patch(API_ACCOUNT + "/" + id, account, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      }
    });
  };
  

getAccounts = async () => {
  return await axios.get(API_ACCOUNT, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
    }
  });
};

getAccount = async (id) => {
  return await axios.get(API_ACCOUNT + "/" + id + "/get", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
    }
  });
};

  updateAccountActive = async (id, active) => {
    return await axios.patch(
      API_ACCOUNT + "/" + id + "/toggle-active",
      { active }, // Gửi `active` dưới dạng object
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
        }
      }
    );
  };
  
 
  findAccountByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_ACCOUNT + "/find", {
      params: {
        query: query,
      },
      headers: {

        "Authorization": "Bearer " + localStorage.getItem("token"), 
      },

    });
  };
}
