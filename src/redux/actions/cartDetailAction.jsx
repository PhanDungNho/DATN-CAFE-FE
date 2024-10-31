import CartDetailService from "../../services/cartDetailService";
import {
  CARTDETAIL_SET,
  CARTDETAILS_SET,
  COMMON_ERROR_SET,
  COMMON_MESSAGE_SET,
} from "./actionType";

const service = new CartDetailService();

export const insertCartDetail = (cartDetail) => async (dispatch) => {
  try {
    console.log("Inset product");

    const response = await service.insertCartDetail(cartDetail);
    console.log("API Response: ", response);

    if (response && response.status === 201) {
      dispatch({
        type: CARTDETAIL_SET,
        payload: response.data,
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Insert successfully!",
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response ? response.message : "Unknown error",
      });
    }
  } catch (error) {
    console.log("Error response: ", error.response);

    dispatch({
      type: COMMON_ERROR_SET,
      payload:
        error.response && error.response.data
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getCartDetailsByUsername = (username) => async (dispatch) => {
  console.log("Get cart details by username");
  try {
    const response = await service.getCartDetailsByUsername(username);
    console.log("API response cart details: ", response);

    if (response.status === 200) {
      dispatch({
        type: CARTDETAILS_SET,
        payload: response.data,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
};
