import {
  PRODUCT_SET,
  PRODUCTS_SET,
  PRODUCT_UPDATE_ACTIVE,
  PRODUCT_APPEND,
  PRODUCT_STATE_CLEAR,
} from "../actions/actionType";

export const initialState = {
  product: {},
  products: [],
};

const productReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case PRODUCT_SET:
      return { ...state, product: payload };
    case PRODUCTS_SET:
      return { ...state, products: payload };
    case PRODUCT_APPEND:
      return {
        ...state,
        products: [payload, ...state.products],
      };
    case PRODUCT_UPDATE_ACTIVE:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === payload.id
            ? { ...product, active: payload.active }
            : product
        ),
      };
    case PRODUCT_STATE_CLEAR:
      return { product: {}, products: [] };

    default:
      return state;
  }
};

export default productReducer;
