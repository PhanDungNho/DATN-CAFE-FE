import addressService from "../../services/addressService";
import {
  ADDRESSES_SET,
  ADDRESS_APPEND,
  ADDRESS_SET,
  ADDRESS_STATE_CLEAR,
  ADDRESS_UPDATE,
  ADDRESS_UPDATE_ACTIVE,
  ADDRESS_DELETE,
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
} from "./actionType";

// Thêm địa chỉ
export const insertAddress = (address) => async (dispatch) => {
  const service = new addressService();

  try {
    dispatch({ type: COMMON_LOADING_SET, payload: true });
    const response = await service.createAddress(address); // Sử dụng createAddress

    if (response.status === 201) {
      dispatch({ type: ADDRESS_SET, payload: response.data });
      dispatch({ type: ADDRESS_APPEND, payload: response.data });
      dispatch({ type: COMMON_MESSAGE_SET, payload: "Thêm thành công" });
    } else {
      dispatch({ type: COMMON_ERROR_SET, payload: response.message });
    }
  } catch (error) {
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  } finally {
    dispatch({ type: COMMON_LOADING_SET, payload: false });
  }
};

export const deleteAddress = (id) => async (dispatch) => {
  try {
    dispatch({ type: COMMON_LOADING_SET, payload: true });
    const response = await addressService.deleteAddress(id);
    if (response.status === 200) {
      dispatch({ type: ADDRESS_DELETE, payload: id });
      dispatch({ type: COMMON_MESSAGE_SET, payload: "Address deleted successfully" });
    }
  } catch (error) {
    dispatch({ type: COMMON_ERROR_SET, payload: error.message });
  } finally {
    dispatch({ type: COMMON_LOADING_SET, payload: false });
  }
};


// Cập nhật địa chỉ
export const updateAddress = (id, address) => async (dispatch) => {
  const service = new addressService();

  try {
    dispatch({ type: COMMON_LOADING_SET, payload: true });
    const response = await service.updateAddress(id, address); // Sử dụng updateAddress

    if (response.status === 200) { // Thay đổi status về 200
      dispatch({ type: ADDRESS_SET, payload: response.data });
      dispatch({ type: ADDRESS_UPDATE, payload: response.data });
      dispatch({ type: COMMON_MESSAGE_SET, payload: "Cập nhật thành công" });
    } else {
      dispatch({ type: COMMON_ERROR_SET, payload: response.message });
    }
  } catch (error) {
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  } finally {
    dispatch({ type: COMMON_LOADING_SET, payload: false });
  }
};
export const updateAddressActive = (id, active) => async (dispatch) => {
  const service = new addressService();
  const username = JSON.parse(localStorage.getItem("user"))?.username;

  try {
    dispatch({ type: COMMON_LOADING_SET, payload: true });
    
    const response = await service.toggleActive(id);
    if (response.status === 200) {
      dispatch({ type: ADDRESS_UPDATE_ACTIVE, payload: { id, active } });
      dispatch({ type: COMMON_MESSAGE_SET, payload: "Cập nhật trạng thái thành công" });

      // Tải lại danh sách địa chỉ sau khi cập nhật
      if (username) {
        dispatch(getAddressByUsername(username));
      }
    } else {
      // Khôi phục trạng thái ban đầu nếu thất bại
      dispatch({ type: ADDRESS_UPDATE_ACTIVE, payload: { id, active: !active } });
      dispatch({ type: COMMON_ERROR_SET, payload: response.message });
    }
  } catch (error) {
    dispatch({ type: ADDRESS_UPDATE_ACTIVE, payload: { id, active: !active } });
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  } finally {
    dispatch({ type: COMMON_LOADING_SET, payload: false });
  }
};

// Tìm địa chỉ theo tên
export const findAddressByNameContainsIgnoreCase = (query) => async (dispatch) => {
  const service = new addressService();

  try {
    dispatch({ type: COMMON_LOADING_SET, payload: true });
    const response = await service.getAddressByName(query); // Sử dụng getAddressByName

    if (response.status === 200) {
      const addresses = Array.isArray(response.data) ? response.data : [];
      dispatch({ type: ADDRESSES_SET, payload: addresses });
    } else {
      dispatch({ type: ADDRESSES_SET, payload: [] });
      dispatch({ type: COMMON_ERROR_SET, payload: response.message });
    }
  } catch (error) {
    dispatch({ type: ADDRESSES_SET, payload: [] });
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  } finally {
    dispatch({ type: COMMON_LOADING_SET, payload: false });
  }
};
// Instantiate the service once

export const getAddresses = () => async (dispatch) => {
  const service = new addressService();

  dispatch({
    type: COMMON_LOADING_SET,
    payload: true,
  });

  try {
    console.log("Fetching all addresses");

    const response = await service.getAddresses();
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: ADDRESSES_SET,
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
      payload: error.response?.data?.message || error.message,
    });
    window.location.href = "/login";
  } finally {
    dispatch({
      type: COMMON_LOADING_SET,
      payload: false,
    });
  }
};

export const getAddressByUsername = (username) => async (dispatch) => {
  const service = new addressService();

  dispatch({
    type: COMMON_LOADING_SET,
    payload: true,
  });

  try {
    console.log(`Fetching addresses for username: ${username}`);

    const response = await service.findAddressesByAccountUsername(username);
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: ADDRESSES_SET, // Make sure you're dispatching ADDRESSES_SET
        payload: response.data, // Ensure this correctly sets the addresses in the state
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
  } finally {
    dispatch({
      type: COMMON_LOADING_SET,
      payload: false,
    });
  }
};

export const clearAddressState = () => (dispatch) => {
  dispatch({
    type: ADDRESS_STATE_CLEAR,
  });
};


  
  
