import CartDetailService from "../../services/cartDetailService";
import {
  CARTDETAIL_DELETE,
  CARTDETAIL_SET,
  CARTDETAILS_SET,
  CLEAR_SELECTED_ITEMS,
  COMMON_ERROR_SET,
  COMMON_MESSAGE_SET,
  SET_SELECTED_ITEMS,
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

export const deleteCartDetail = (id) => async (dispatch) => {
  try {
    console.log("Delete cart detail with: ", id);
    const response = await service.deleteCartDetail(id);
    console.log("API response delete: ", response);

    if (response.status === 200) {
      dispatch({
        type: CARTDETAIL_DELETE,
        payload: id,
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Delete successfully!",
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

export const removeCartDetail = (id) => async (dispatch) => {
  try {
    console.log("Delete cart detail with: ", id);
    const response = await service.deleteCartDetail(id);
    console.log("API response delete: ", response);

    if (response.status === 200) {
      dispatch({
        type: CARTDETAIL_DELETE,
        payload: id,
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

export const setSelectedItems = (items) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_ITEMS,
    payload: items,
  });
};

export const clearSelectedItems = () => (dispatch) => {
  dispatch({
    type: CLEAR_SELECTED_ITEMS,
  })
};