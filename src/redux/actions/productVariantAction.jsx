import ProductVariantService from "../../services/productVariantService";
import {
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
  PRODUCTVARIANT_APPEND,
  PRODUCTVARIANT_SET,
  PRODUCTVARIANT_STATE_CLEAR,
  PRODUCTVARIANTS_SET,
} from "./actionType";

export const insertProductVariant =
  (productVariant, navigate) => async (dispatch) => {
    const service = new ProductVariantService();

    try {
      console.log("insert variant");
      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });

      const response = await service.insertProductVariant(productVariant);
      console.log("API Response: ", response);

      if (response.status === 201) {
        dispatch({
          type: PRODUCTVARIANT_SET,
          payload: response.data,
        });

        dispatch({
          type: PRODUCTVARIANT_APPEND,
          payload: response.data,
        });

        dispatch({
          type: COMMON_MESSAGE_SET,
          payload: "Thêm thành công",
        });
        navigate("/admin/productvariants/list");
      } else {
        dispatch({
          type: COMMON_ERROR_SET,
          payload: response.message,
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
    } finally {
      dispatch({
        type: COMMON_LOADING_SET,
        payload: false,
      });
    }
  };

export const getProductVariants = () => async (dispatch) => {
  const service = new ProductVariantService();

  try {
    console.log("get all variant");
    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getProductVariants();
    console.log("Product Variant: ", response);

    if (response.status === 200) {
      dispatch({
        type: PRODUCTVARIANTS_SET,
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

export const getProductVariant = (id) => async (dispatch) => {
  const service = new ProductVariantService();

  try {
    console.log("get variant by id");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getProductVariant(id);
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: PRODUCTVARIANT_SET,
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

export const clearProductVariantState = () => (dispatch) => {
  dispatch({
    type: PRODUCTVARIANT_STATE_CLEAR,
  });
};
