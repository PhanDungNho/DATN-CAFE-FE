import {
    AUTHORITIES_SET,
    AUTHORITY_APPEND,
    AUTHORITY_SET,
    AUTHORITY_STATE_CLEAR,
  } from "../actions/actionType";
  
  const initialState = {
    authority: {},
    authorities: [],
    pagination: { current: 1, pageSize: 10, total: 0 },
  };
  
  const authorityReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case AUTHORITY_SET:
        return { ...state, authority: payload };
      case AUTHORITIES_SET:
        return { ...state, authorities: payload };
      case AUTHORITY_STATE_CLEAR:
        return { authority: {}, authorities: [] };
      case AUTHORITY_APPEND:
        return {
          ...state,
          authorities: [payload, ...state.authorities],
        };
      default:
        return state;
    }
  };
  
  export default authorityReducer;
  