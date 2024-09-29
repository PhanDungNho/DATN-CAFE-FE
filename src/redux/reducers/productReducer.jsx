import { PRODUCT_SET, PRODUCTS_SET } from "../actions/actionType";

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
    default:
      return state;
  }
};

export default productReducer;
