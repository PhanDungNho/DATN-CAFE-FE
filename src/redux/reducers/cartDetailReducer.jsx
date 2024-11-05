import { CARTDETAIL_DELETE, CARTDETAIL_SET, CARTDETAILS_SET } from "../actions/actionType";

const initialState = {
  cartDetail: {},
  cartDetails: [],
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
        cartDetails: state.cartDetails.filter(
          (item) => item.id !== payload
        ),
      };
    default:
      return state;
  }
};

export default CartDetailReducer;
