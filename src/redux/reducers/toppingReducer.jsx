import {
    TOPPINGS_SET,
    TOPPING_APPEND,
    TOPPING_SET,
    TOPPING_STATE_CLEAR,
    TOPPING_UPDATE,
    TOPPING_UPDATE_ACTIVE,
  } from "../actions/actionType";
  
  const initialState = {
    topping: {},
    toppings: [],
    pagination: { current: 1, pageSize: 10, total: 0 },
  };
  
  const toppingReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case TOPPING_SET:
        return { ...state, topping: payload };
      case TOPPINGS_SET:
        return { ...state, toppings: payload };
      case TOPPING_STATE_CLEAR:
        return { topping: {}, toppings: [] };
      case TOPPING_APPEND:
        return {
          ...state,
          toppings: [payload, ...state.toppings],
        };
      case TOPPING_UPDATE:
        const newSizes = state.toppings.filter(
          (item) => item.id !== payload.id
        );
        return {
          ...state,
          toppings: [payload, ...newSizes],
        };
      case TOPPING_UPDATE_ACTIVE:
        return {
          ...state,
          toppings: state.toppings.map((topping) =>
            topping.id === payload.id
              ? { ...topping, active: payload.active }
              : topping
          ),
        };
       
      default:
        return state;
    }
  };
  
  export default toppingReducer;
  