import { Modal } from "antd";
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
  ADDRESS_UPDATE_ISDEFAULT,
} from "./actionType";

export const insertAddress = (address) => async (dispatch) => {
  const service = new addressService();

  try {
    dispatch({ type: COMMON_LOADING_SET, payload: true });
    const response = await service.createAddress(address); // Sử dụng createAddress

    if (response.status === 201) {
      dispatch({ type: ADDRESS_SET, payload: response.data });
      dispatch({ type: ADDRESS_APPEND, payload: response.data });
      dispatch({ type: COMMON_MESSAGE_SET, payload: "More success" });
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

export const deleteAddress = (id) => async (dispatch, getState) => {
  const service = new addressService();

  try {
    dispatch({ type: COMMON_LOADING_SET, payload: true });

    // Get the current addresses from the state
    const addresses = getState().addressReducer.addresses;
    const addressToDelete = addresses.find((address) => address.id === id);

    // Check if the address is the default address
    if (addressToDelete && addressToDelete.isDefault) {
      // If it's the default address, show a warning
      Modal.warning({
        title: "Cannot Delete Default Address",
        content: "You cannot delete an address that is set as default.",
      });
      return; // Exit the function early
    }

    const response = await service.deleteAddress(id); // Now just passing id

    // Handle successful deletion with status 204
    if (response.status === 204) {
      dispatch({ type: ADDRESS_DELETE, payload: id });
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Address deleted successfully",
      });
    } else {
      // If response status is unexpected, handle it as an error
      const errorMessage =
        response.message || "Unexpected response from server";
      dispatch({ type: COMMON_ERROR_SET, payload: errorMessage });
      console.error("Delete address error:", errorMessage);
    }
  } catch (error) {
    // Log the error message and dispatch it to the error handler
    console.error("Error in deleteAddress action:", error);
    dispatch({ type: COMMON_ERROR_SET, payload: error.message });
  } finally {
    // Always set loading to false at the end of the operation
    dispatch({ type: COMMON_LOADING_SET, payload: false });
  }
};

export const updateAddress = (id, address) => async (dispatch) => {
  const service = new addressService();

  try {
    dispatch({ type: COMMON_LOADING_SET, payload: true });
    const response = await service.updateAddress(id, address); // Sử dụng updateAddress

    if (response.status === 200) {
      // Thay đổi status về 200
      dispatch({ type: ADDRESS_SET, payload: response.data });
      dispatch({ type: ADDRESS_UPDATE, payload: response.data });
      dispatch({ type: COMMON_MESSAGE_SET, payload: "Updated successfully"});
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
      dispatch({ type: COMMON_MESSAGE_SET, payload: "Status update successful" });
      // Tải lại danh sách địa chỉ sau khi cập nhật
      if (username) {
        dispatch(getAddressByUsername(username));
      }
    } else {
      // Khôi phục trạng thái ban đầu nếu thất bại
      dispatch({
        type: ADDRESS_UPDATE_ACTIVE,
        payload: { id, active: !active },
      });
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
export const findAddressByNameContainsIgnoreCase =
  (query) => async (dispatch) => {
    const service = new addressService();

    try {
      const response = await service.getAddressByName(query); // Sử dụng getAddressByName
      console.log("API address: ", response);

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
    }
  };

// Instantiate the service once
export const getAddresses = () => async (dispatch) => {
  const service = new addressService();

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
  } 
};

export const getAddressByUsername = (username) => async (dispatch) => {
  const service = new addressService();

  try {
    console.log(`Fetching addresses for username: ${username}`);

    const response = await service.findAddressesByAccountUsername(username);
    console.log("API address: ", response);

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
  }
};

export const clearAddressState = () => (dispatch) => {
  dispatch({
    type: ADDRESS_STATE_CLEAR,
  });
};

// Action to set an address as default
export const setIsDefault = (id) => async (dispatch, getState) => {
  const service = new addressService();
  const addresses = getState().addressReducer.addresses; // Get the current addresses from the state
  const currentDefaultAddress = addresses.find((address) => address.isDefault); // Find the current default address

  try {
    dispatch({ type: COMMON_LOADING_SET, payload: true });

    if (currentDefaultAddress && currentDefaultAddress.id !== id) {
      // If there's a different default address, unset it first
      await service.setIsDefault(currentDefaultAddress.id, false); // Call service to unset the current default
      dispatch({
        type: ADDRESS_UPDATE_ISDEFAULT,
        payload: { id: currentDefaultAddress.id, isDefault: false },
      });
    }

    const response = await service.setIsDefault(id); // Set the new default address

    if (response.status === 200) {
      dispatch({ type: ADDRESS_UPDATE_ISDEFAULT, payload: { id, isDefault: true } });
      dispatch({ type: COMMON_MESSAGE_SET, payload: "The address has been set as default successfully" });

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

export const setIsDefaultCart = (id) => async (dispatch, getState) => {
  const service = new addressService();
  const addresses = getState().addressReducer.addresses; 
  const currentDefaultAddress = addresses.find((address) => address.isDefault); 

  try {
    if (currentDefaultAddress && currentDefaultAddress.id !== id) {
      await service.setIsDefault(currentDefaultAddress.id, false); 
      dispatch({
        type: ADDRESS_UPDATE_ISDEFAULT,
        payload: { id: currentDefaultAddress.id, isDefault: false },
      });
    }

    const response = await service.setIsDefault(id);

    if (response.status === 200) {
      dispatch({
        type: ADDRESS_UPDATE_ISDEFAULT,
        payload: { id, isDefault: true },
      });
    } else {
      dispatch({ type: COMMON_ERROR_SET, payload: response.message });
    }
  } catch (error) {
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  }
};
