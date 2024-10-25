import axios from "axios";
import { API_ACCOUNT } from "./constant";

export default class AccountService {
  insertAccount = (account) => {
    const formData = new FormData();

    // Append account fields to FormData
    formData.append("username", account.username);
    formData.append("fullName", account.fullName);
    formData.append("password", account.password);
    formData.append("phone", account.phone);
    formData.append("email", account.email);
    formData.append("amountPaid", account.amountPaid);
    formData.append("active", account.active);

    if (account.imageFile[0].originFileObj) {
      formData.append("imageFile", account.imageFile[0].originFileObj);
    }

    console.log("Account insert data:", [...formData]);

    return axios.post(API_ACCOUNT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  updateAccount = async (username, account) => {
    let formData = new FormData();

    formData.append("username", account.username);
    formData.append("fullName", account.fullName);
    formData.append("password", account.password);
    formData.append("phone", account.phone);
    formData.append("email", account.email);
    formData.append("amountPaid", account.amountPaid);
    formData.append("active", account.active);

    if (account.imageFile[0].originFileObj) {
      formData.append("imageFile", account.imageFile[0].originFileObj);
    }

    return axios.patch(API_ACCOUNT + "/" + username, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  getAccounts = async () => {
    return await axios.get(API_ACCOUNT, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };
  
  getAccountsAdmin = async () => {
    return await axios.get(API_ACCOUNT+"?admin=true", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  getAccount = async (username) => {
    return await axios.get(API_ACCOUNT + "/" + username + "/get", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  updateAccountActive = async (username, active) => {
    return await axios.patch(
      API_ACCOUNT + "/" + username + "/toggle-active",
      { active }, // Gửi `active` dưới dạng object
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
        },
      }
    );
  };

  findAccountByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_ACCOUNT + "/find", {
      params: {
        query: query,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  findAccountByPhoneContainsIgnoreCase = async (query) => {
    return await axios.get(API_ACCOUNT + "/find/phone", {
      params: {
        query: query,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  static getAccountLogoUrl = (filename) => {
    return API_ACCOUNT + "/image/" + filename;
  };
}
