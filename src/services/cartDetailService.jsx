import axios from "axios";
import { API_CARTDETAIL } from "./constant";

export default class CartDetailService {
  insertCartDetail(cartDetail) {
    return axios.post(API_CARTDETAIL, cartDetail, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  getCartDetailsByUsername(username) {
    return axios.get(API_CARTDETAIL + "/" + username, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }
}