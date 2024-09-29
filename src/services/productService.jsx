import axios from "axios";
import { API_PRODUCT } from "./constant";

export default class ProductService {
  getProducts = async () => {
    return await axios.get(API_PRODUCT);
  }

  getProduct = async (id) => {
    return await axios.get(API_PRODUCT + "/" + id + "/get");
  }
}

