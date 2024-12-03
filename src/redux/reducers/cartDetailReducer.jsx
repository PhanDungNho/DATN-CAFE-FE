import {
  CARTDETAIL_DELETE,
  CARTDETAIL_SET,
  CARTDETAILS_SET,
  CARTDETAILTOPPING_DELETE,
  CLEAR_SELECTED_ITEMS,
  SET_SELECTED_ITEMS,
} from "../actions/actionType";

const initialState = {
  cartDetail: {},
  cartDetails: [],
  selectedItems: [],
};

const CartDetailReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CARTDETAIL_SET:
      return { ...state, cartDetail: payload };
    case CARTDETAILS_SET:
      return { ...state, cartDetails: payload };
    case CARTDETAIL_DELETE:
      return {
        ...state,
        cartDetails: state.cartDetails.filter((item) => item.id !== payload),
      };
      case CARTDETAILTOPPING_DELETE:
      return {
        ...state,
        cartDetails: state.cartDetails.filter((item) => item.id !== payload),
      };
    case SET_SELECTED_ITEMS:
      return { ...state, selectedItems: payload };
    case CLEAR_SELECTED_ITEMS:
      return { ...state, selectedItems: {} };
    default:
      return state;
  }
};

export default CartDetailReducer;
