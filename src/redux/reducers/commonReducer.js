import { COMMON_ERROR_SET, COMMON_LOADING_SET, COMMON_MESSAGE_SET } from "../actions/actionType";

const initialState = {
  message: "",
  error: "",
  isLoading: false,
};

const commonReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case COMMON_ERROR_SET:
      return { ...state, error: payload };
    case COMMON_LOADING_SET:
      return { ...state, isLoading: payload };
    case COMMON_MESSAGE_SET:
      return { ...state, message: payload };
    default:
      return state;
  }
};

export default commonReducer;
