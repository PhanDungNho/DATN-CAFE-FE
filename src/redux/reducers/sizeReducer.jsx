import {
  SIZES_SET,
  SIZE_APPEND,
  SIZE_SET,
  SIZE_STATE_CLEAR,
  SIZE_UPDATE,
  SIZE_UPDATE_ACTIVE,
} from "../actions/actionType";

const initialState = {
  size: {},
  sizes: [],
  pagination: { current: 1, pageSize: 10, total: 0 },
};

const sizeReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SIZE_SET:
      return { ...state, size: payload };
    case SIZES_SET:
      return { ...state, sizes: payload };
    case SIZE_STATE_CLEAR:
      return { size: {}, sizes: [] };
    case SIZE_APPEND:
      return {
        ...state,
        sizes: [payload, ...state.sizes],
      };
    case SIZE_UPDATE:
      const newSizes = state.sizes.filter(
        (item) => item.id !== payload.id
      );
      return {
        ...state,
        sizes: [payload, ...newSizes],
      };
    case SIZE_UPDATE_ACTIVE:
      return {
        ...state,
        sizes: state.sizes.map((size) =>
          size.id === payload.id
            ? { ...size, active: payload.active }
            : size
        ),
      };
     
    default:
      return state;
  }
};

export default sizeReducer;
