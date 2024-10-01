import categoryService from "../../services/categoryService";
import {
  CATEGORIES_SET,
  CATEGORY_APPEND,
  CATEGORY_SET,
  CATEGORY_STATE_CLEAR,
  CATEGORY_UPDATE,
  CATEGORY_UPDATE_ACTIVE,
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
} from "./actionType";

export const insertCategory = (category) => async (dispatch) => {
  const service = new categoryService();

  try {
    console.log("insert category");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.insertCategory(category);
    console.log(response);

    if (response.status === 201) {
      dispatch({
        type: CATEGORY_SET,
        payload: response.data,
      });

      dispatch({
        type: CATEGORY_APPEND,
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
    console.error("Error response:", error.response);
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

export const updateCategory = (id, category) => async (dispatch) => {
  const service = new categoryService();

  if (!category.id) {
    console.error("No ID provided for updating category.");
    return;
  }
  console.log("update category");

  try {
    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.updateCategory(id, category);
    console.log(response);

    if (response.status === 201) {
      dispatch({
        type: CATEGORY_SET,
        payload: response.data,
      });

      dispatch({
        type: CATEGORY_UPDATE,
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

export const getCategories = () => async (dispatch) => {
  const service = new categoryService();

  try {
    console.log("get all categories");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getCategories();
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: CATEGORIES_SET,
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

export const getCategory = (id) => async (dispatch) => {
  const service = new categoryService();

  try {
    console.log("get category by id");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getCategory(id);
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: CATEGORY_SET,
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

export const clearCategoryState = () => (dispatch) => {
  dispatch({
    type: CATEGORY_STATE_CLEAR,
  });
};

export const updateCategoryActive =
  (id, active) => async (dispatch, getState) => {
    const service = new categoryService();

    try {
      console.log("Updating category active status on server");

      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });

      const response = await service.updateCategoryActive(id, active);
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: CATEGORY_UPDATE_ACTIVE,
          payload: { id, active },
        });

        dispatch({
          type: COMMON_MESSAGE_SET,
          payload: "Cập nhật trạng thái thành công",
        });
      } else {
        const previousActive = !active;
        dispatch({
          type: CATEGORY_UPDATE_ACTIVE,
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
        type: CATEGORY_UPDATE_ACTIVE,
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

export const findCategoryByNameContainsIgnoreCase =
  (query) => async (dispatch) => {
    const service = new categoryService();

    console.log("Find")
    try {
      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });

      const response = await service.findCategoryByNameContainsIgnoreCase(
        query
      );

      if (response.status === 200) {
        const categories = Array.isArray(response.data) ? response.data : [];
        dispatch({
          type: CATEGORIES_SET,
          payload: categories,
        });
      } else {
        dispatch({
          type: CATEGORIES_SET,
          payload: [],
        });
        dispatch({
          type: COMMON_ERROR_SET,
          payload:
            response.message || "An error occurred while fetching categories",
        });
      }
    } catch (error) {
      dispatch({
        type: CATEGORIES_SET,
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
