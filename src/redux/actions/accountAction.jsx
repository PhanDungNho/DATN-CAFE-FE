import accountService from "../../services/accountService";
import {
  ACCOUNTS_SET,
  ACCOUNT_APPEND,
  ACCOUNT_SET,
  ACCOUNT_STATE_CLEAR,
  ACCOUNT_UPDATE,
  ACCOUNT_UPDATE_ACTIVE,
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
} from "./actionType";

export const insertAccount = (account) => async (dispatch) => {
  const service = new accountService();

  try {
    console.log("insert account");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.insertAccount(account);
    console.log(response);

    if (response.status === 201) {
      dispatch({
        type: ACCOUNT_SET,
        payload: response.data,
      });

      dispatch({
        type: ACCOUNT_APPEND,
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

export const updateAccount = (id, account) => async (dispatch) => {
  const service = new accountService();

  if (!account.id) {
    console.error("No ID provided for updating account.");
    return;
  }
  console.log("update account");

  try {
    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.updateAccount(id, account);
    console.log(response);

    if (response.status === 201) {
      dispatch({
        type: ACCOUNT_SET,
        payload: response.data,
      });

      dispatch({
        type: ACCOUNT_UPDATE,
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

export const getAccounts = () => async (dispatch) => {
  const service = new accountService();

  try {
    console.log("get all accounts");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getAccounts();
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: ACCOUNTS_SET,
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

export const getAccount = (id) => async (dispatch) => {
  const service = new accountService();

  try {
    console.log("get account by id");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getAccount(id);
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: ACCOUNT_SET,
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

export const clearAccountState = () => (dispatch) => {
  dispatch({
    type: ACCOUNT_STATE_CLEAR,
  });
};

export const updateAccountActive =
  (id, active) => async (dispatch, getState) => {
    const service = new accountService();

    try {
      console.log("Updating account active status on server");

      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });

      const response = await service.updateAccountActive(id, active);
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: ACCOUNT_UPDATE_ACTIVE,
          payload: { id, active },
        });

        dispatch({
          type: COMMON_MESSAGE_SET,
          payload: "Cập nhật trạng thái thành công",
        });
      } else {
        const previousActive = !active;
        dispatch({
          type: ACCOUNT_UPDATE_ACTIVE,
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
        type: ACCOUNT_UPDATE_ACTIVE,
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

export const findAccountByNameContainsIgnoreCase =
  (query) => async (dispatch) => {
    const service = new accountService();

    console.log("Find")
    try {
      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });

      const response = await service.findAccountByNameContainsIgnoreCase(
        query
      );

      if (response.status === 200) {
        const accounts = Array.isArray(response.data) ? response.data : [];
        dispatch({
          type: ACCOUNTS_SET,
          payload: accounts,
        });
      } else {
        dispatch({
          type: ACCOUNTS_SET,
          payload: [],
        });
        dispatch({
          type: COMMON_ERROR_SET,
          payload:
            response.message || "An error occurred while fetching accounts",
        });
      }
    } catch (error) {
      dispatch({
        type: ACCOUNTS_SET,
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
