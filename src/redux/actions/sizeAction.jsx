import sizeService from "../../services/sizeService";
import {
  SIZES_SET,
  SIZE_APPEND,
  SIZE_SET,
  SIZE_UPDATE,
  SIZE_UPDATE_ACTIVE,
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
} from "./actionType";


export const getSizes = () => async (dispatch) => {
    const service = new sizeService();
  
    try {
      console.log("get all sizes");
  
      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });
  
      const response = await service.getSizes();
      console.log(response);
  
      if (response.status === 200) {
        dispatch({
          type: SIZES_SET,
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


  export const updateSizeActive =
  (id, active) => async (dispatch, getState) => {
    const service = new sizeService();

    try {
      console.log("Updating size active status on server");

      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });

      const response = await service.updateSizeActive(id, active);
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: SIZE_UPDATE_ACTIVE,
          payload: { id, active },
        });

        dispatch({
          type: COMMON_MESSAGE_SET,
          payload: "Cập nhật trạng thái thành công",
        });
      } else {
        const previousActive = !active;
        dispatch({
          type: SIZE_UPDATE_ACTIVE,
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
        type: SIZE_UPDATE_ACTIVE,
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

export const findSizeByNameContainsIgnoreCase =
  (query) => async (dispatch) => {
    const service = new sizeService();

    try {
      console.log("Find size")
      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });

      const response = await service.findSizeByNameContainsIgnoreCase(
        query
      );

      if (response.status === 200) {
        const sizes = Array.isArray(response.data) ? response.data : [];
        dispatch({
          type: SIZES_SET,
          payload: sizes,
        });
      } else {
        dispatch({
          type: SIZES_SET,
          payload: [],
        });
        dispatch({
          type: COMMON_ERROR_SET,
          payload:
            response.message || "An error occurred while fetching sizes",
        });
      }
    } catch (error) {
      dispatch({
        type: SIZES_SET,
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


  export const insertSize = (size) => async (dispatch) => {
    const service = new sizeService();
  
    try {
      console.log("insert size");
  
      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });
  
      const response = await service.insertSize(size);
      console.log(response);
  
      if (response.status === 201) {
        dispatch({
          type: SIZE_SET,
          payload: response.data,
        });
  
        dispatch({
          type: SIZE_APPEND,
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


  export const updateSize = (id, size) => async (dispatch) => {
    const service = new sizeService();
  
    if (!size.id) {
      console.error("No ID provided for updating size.");
      return;
    }
    console.log("update size");
  
    try {
      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });
  
      const response = await service.updateSize(id, size);
      console.log(response);
  
      if (response.status === 201) {
        dispatch({
          type: SIZE_SET,
          payload: response.data,
        });
  
        dispatch({
          type: SIZE_UPDATE,
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
  