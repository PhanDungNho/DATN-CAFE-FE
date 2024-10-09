import toppingService from "../../services/toppingService";
import {
  TOPPINGS_SET,
  TOPPING_APPEND,
  TOPPING_SET,
  TOPPING_UPDATE,
  TOPPING_UPDATE_ACTIVE,
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
} from "./actionType";

export const getToppings = () => async (dispatch) => {
  const service = new toppingService();

  try {
    console.log("get all toppings");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getToppings();
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: TOPPINGS_SET,
        payload: response.data,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
  dispatch({
    type: COMMON_LOADING_SET,
    payload: false,
  });
};

export const updateToppingActive = (id, active) => async (dispatch) => {
  const service = new toppingService();

  console.log("update topping");
  try {
    console.log("Updating topping active status on server");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.updateToppingActive(id, active);
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: TOPPING_UPDATE_ACTIVE,
        payload: { id, active },
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Cập nhật trạng thái thành công",
      });
    } else {
      const previousActive = !active;
      dispatch({
        type: TOPPING_UPDATE_ACTIVE,
        payload: { id, active: previousActive },
      });

      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    // Nếu có lỗi, quay lại trạng thái trước đó
    const previousActive = !active;
    dispatch({
      type: TOPPING_UPDATE_ACTIVE,
      payload: { id, active: previousActive }, // Quay lại trạng thái cũ
    });

    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  }

  dispatch({
    type: COMMON_LOADING_SET,
    payload: false,
  });
};

export const findToppingByNameContainsIgnoreCase =
  (query) => async (dispatch) => {
    const service = new toppingService();
    try {
      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });

      const response = await service.findToppingByNameContainsIgnoreCase(query);

      // Kiểm tra nếu mã phản hồi không phải là 200
      if (response.status === 200) {
        // Nếu response.data là mảng, trả về dữ liệu; ngược lại trả về mảng rỗng
        const toppings = Array.isArray(response.data) ? response.data : [];
        dispatch({
          type: TOPPINGS_SET,
          payload: toppings,
        });
      } else {
        dispatch({
          type: TOPPINGS_SET,
          payload: [],
        });
        dispatch({
          type: COMMON_ERROR_SET,
          payload:
            response.message || "An error occurred while fetching toppings",
        });
      }
    } catch (error) {
      dispatch({
        type: TOPPINGS_SET,
        payload: [],
      });
      dispatch({
        type: COMMON_ERROR_SET,
        payload: error.response?.data?.message || error.message,
      });
    } finally {
      dispatch({
        type: COMMON_LOADING_SET,
        payload: false,
      });
    }
  };

export const insertTopping = (topping) => async (dispatch) => {
  const service = new toppingService();

  try {
    console.log("insert topping");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.insertTopping(topping);
    console.log(response);

    if (response.status === 201) {
      dispatch({
        type: TOPPING_SET,
        payload: response.data,
      });

      dispatch({
        type: TOPPING_APPEND,
        payload: response.data,
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Thêm thành công",
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.error("Error response:", error);
    dispatch({
      type: COMMON_ERROR_SET,
      payload:
        error.response && error.response.data
          ? error.response.data.message
          : error.message || "An unexpected error occurred",
    });
  }

  dispatch({
    type: COMMON_LOADING_SET,
    payload: false,
  });
};

export const updateTopping = (id, topping) => async (dispatch) => {
  const service = new toppingService();

  if (!topping.id) {
    console.error("No ID provided for updating topping.");
    return;
  }
  console.log("update topping");

  try {
    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.updateTopping(id, topping);
    console.log(response);

    if (response.status === 201) {
      dispatch({
        type: TOPPING_SET,
        payload: response.data,
      });

      dispatch({
        type: TOPPING_UPDATE,
        payload: response.data,
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Cập nhật thành công",
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  }

  dispatch({
    type: COMMON_LOADING_SET,
    payload: false,
  });
};

export const getTopping = (id) => async (dispatch) => {
  const service = new toppingService();
  try {
    console.log("get category by id");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getTopping(id);
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: TOPPING_SET,
        payload: response.data,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
  dispatch({
    type: COMMON_LOADING_SET,
    payload: false,
  });
};
