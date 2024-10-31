import { type } from "@testing-library/user-event/dist/type";
import ProductService from "../../services/productService";
import {
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
  PRODUCT_APPEND,
  PRODUCT_SET,
  PRODUCT_UPDATE_ACTIVE,
  PRODUCTS_SET,
  PRODUCT_STATE_CLEAR,
  PRODUCT_UPDATE_ORDERING,
} from "./actionType";

export const insertProduct = (product, navigate) => async (dispatch) => {
  const services = new ProductService();

  try {
    console.log("Insert Product");

    const response = await services.insertProduct(product);
    console.log("API Response:", response);

    if (response && response.status === 201) {
      // Kiểm tra xem response có tồn tại
      dispatch({
        type: PRODUCT_SET,
        payload: response.data,
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Insert successfully!",
      });

      navigate("/admin/products/list");

      dispatch({
        type: PRODUCT_APPEND,
        payload: response.data,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response ? response.message : "Unknown error",
      });
    }
  } catch (error) {
    console.error("Error response:", error.response);

    // Kiểm tra xem error.response có tồn tại trước khi truy cập
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : error.message;

    dispatch({
      type: COMMON_ERROR_SET,
      payload: errorMessage,
    });
  }
};

export const updateProduct = (id, product, navigate) => async (dispatch) => {
  const services = new ProductService();

  try {
    console.log("Update Product");

    const response = await services.updateProduct(id, product);
    console.log("API update Response:", response);

    if (response.status === 200) {
      dispatch({
        type: PRODUCT_SET,
        payload: response.data,
      });

      dispatch({
        type: PRODUCT_APPEND,
        payload: response.data,
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Update successfully!",
      });

      navigate("/admin/products/list");
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.data?.message || "Unknown error",
      });
    }
  } catch (error) {
    console.error("Error response:", error.response);
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getProducts = () => async (dispatch) => {
  const service = new ProductService();
  try {
    console.log("get all products");

    const response = await service.getProducts();
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: PRODUCTS_SET,
        payload: response.data,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
};

export const getProduct = (id) => async (dispatch) => {
  const service = new ProductService();

  try {
    console.log("get product by id");

    const response = await service.getProduct(id);
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: PRODUCT_SET,
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
};

export const updateProductActive =
  (id, active) => async (dispatch, getState) => {
    const service = new ProductService();

    try {
      console.log("Updating product active status on server");

      // dispatch({
      //   type: COMMON_LOADING_SET,
      //   payload: true,
      // });

      const response = await service.updateProductActive(id, active);
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: PRODUCT_UPDATE_ACTIVE,
          payload: { id, active },
        });

        dispatch({
          type: COMMON_MESSAGE_SET,
          payload: "Cập nhật trạng thái thành công",
        });
      } else {
        const previousActive = !active;
        dispatch({
          type: PRODUCT_UPDATE_ACTIVE,
          payload: { id, active: previousActive },
        });

        dispatch({
          type: COMMON_ERROR_SET,
          payload: response.message,
        });
      }
    } catch (error) {
      const previousActive = !active;
      dispatch({
        type: PRODUCT_UPDATE_ACTIVE,
        payload: { id, active: previousActive },
      });

      dispatch({
        type: COMMON_ERROR_SET,
        payload: error.response?.data?.message || error.message,
      });
    }

    // dispatch({
    //   type: COMMON_LOADING_SET,
    //   payload: false,
    // });
  };

export const findProductNameContainsIgnoreCase =
  (query) => async (dispatch) => {
    const service = new ProductService();

    console.log("Find");
    try {
      // dispatch({
      //   type: COMMON_LOADING_SET,
      //   payload: true,
      // });

      const response = await service.findProductByNameContainsIgnoreCase(query);
      console.log(response);

      if (response.status === 200) {
        const products = Array.isArray(response.data) ? response.data : [];
        dispatch({
          type: PRODUCTS_SET,
          payload: products,
        });
      } else {
        dispatch({
          type: PRODUCTS_SET,
          payload: [],
        });
        dispatch({
          type: COMMON_ERROR_SET,
          payload:
            response.message || "An error occurred while fetching product",
        });
      }
    } catch (error) {
      dispatch({
        type: PRODUCTS_SET,
        payload: [],
      });
      dispatch({
        type: COMMON_ERROR_SET,
        payload: error.response?.data?.message || error.message,
      });
    }
    // dispatch({
    //   type: COMMON_LOADING_SET,
    //   payload: false,
    // });
  };

export const clearProductState = () => (dispatch) => {
  dispatch({
    type: PRODUCT_STATE_CLEAR,
  });
};

export const uploadImages = (formData) => async (dispatch) => {
  const service = new ProductService();

  try {
    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.uploadImages(formData);
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: PRODUCTS_SET,
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
  } finally {
    dispatch({
      type: COMMON_LOADING_SET,
      payload: false,
    });
  }
};

export const deleteProductImage = (fileName) => async (dispatch) => {
  const services = new ProductService();

  try {
    console.log("Delete Product Image");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await services.deleteProductImage(fileName);

    if (response && (response.status === 200 || response.status === 204)) {
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "removed",
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response?.data?.message || "Lỗi không xác định",
      });
    }
  } catch (error) {
    console.error(error);
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

export const getProductsUser = () => async (dispatch) => {
  const service = new ProductService();
  try {
    console.log("get all products");
    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getProductsUser();
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: PRODUCTS_SET,
        payload: response.data,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  } finally {
    dispatch({
      type: COMMON_LOADING_SET,
      payload: false,
    });
  }
};

export const updateProductOrdering = (newData) => async (dispatch) => {
  const service = new ProductService();
  console.log("Update ordering");
  try {
    const response = await service.updateProductOrdering(newData);
    console.log("API response: ", response);

    if (response.status === 200) {
      dispatch({
        type: PRODUCT_UPDATE_ORDERING,
        payload: response.data,
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Update ordering successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
};
