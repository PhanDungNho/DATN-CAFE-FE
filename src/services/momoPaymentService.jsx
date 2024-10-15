import axios from "axios";
import { API_MOMO } from "./constant";
export default class momoPaymentService {
    createMomoPayment = async (category) => {
      return await axios.post(API_MOMO, category, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
        }
      });
    };
    
  
   
  }
  