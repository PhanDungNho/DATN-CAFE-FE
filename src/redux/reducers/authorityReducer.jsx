import {
  AUTHORITIES_SET,
  AUTHORITY_APPEND,
  AUTHORITY_SET,
  AUTHORITY_STATE_CLEAR,
  AUTHORITY_UPDATE,
  AUTHORITY_DELETE,
  COMMON_ERROR_SET,
  COMMON_MESSAGE_SET
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
    case AUTHORITY_UPDATE:
      return {
        ...state,
        authorities: state.authorities.map((authority) =>
          authority.id === payload.id ? payload : authority
        ),
      };
    case AUTHORITY_DELETE:
      return {
        ...state,
        authorities: state.authorities.filter(
          (authority) => authority.id !== payload
        ),
      };
    case COMMON_ERROR_SET:
      return {
        ...state,
        error: payload,
      };
    case COMMON_MESSAGE_SET:
      return {
        ...state,
        message: payload,
      };
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
