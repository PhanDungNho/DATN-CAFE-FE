import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} from "../actions/actionType";
  
  
  // Trạng thái khởi tạo
  const initialState = {
    loading: false,
    isAuthenticated: false,
    user: null,
    roles: [],
    error: null,
  };
  
  // Reducer cho auth
 const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          user: action.payload.username,
          roles: action.payload.roles,
        };
      case LOGIN_FAILURE:
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  export default authReducer;
  