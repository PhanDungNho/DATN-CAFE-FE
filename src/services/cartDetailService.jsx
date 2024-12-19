import axios from "axios";
import { API_CARTDETAIL, API_CARTDETAILTOPPING } from "./constant";

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

  deleteCartDetail(id) {
    return axios.delete(API_CARTDETAIL + "/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  deleteCartDetailTopping(id) {
    return axios.delete(API_CARTDETAILTOPPING + "/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }
}
