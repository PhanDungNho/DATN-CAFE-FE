import {
    PRODUCTVARIANT_APPEND,
    PRODUCTVARIANT_SET,
    PRODUCTVARIANT_STATE_CLEAR,
    PRODUCTVARIANT_UPDATE_ACTIVE,
    PRODUCTVARIANTS_SET,
    
  } from "../actions/actionType";
  
  export const initialState = {
    productVariant: {},
    productVariants: [],
  };
  
  const productVariantReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case PRODUCTVARIANT_SET:
        return { ...state, productVariant: payload };
      case PRODUCTVARIANTS_SET:
        return { ...state, productVariants: payload };  
      case PRODUCTVARIANT_APPEND:
        return {
          ...state,
          productVariants: [payload, ...state.productVariants],
        };
      case PRODUCTVARIANT_UPDATE_ACTIVE:
        return {
          ...state,
          productVariants: state.productVariants.map((productVariant) =>
            productVariant.id === payload.id
              ? { ...productVariant, active: payload.active }
              : productVariant
          ),
        };
      case PRODUCTVARIANT_STATE_CLEAR:
        return { productVariant: {}, productVariants: [] };
  
      default:
        return state;
    }
  };
  
  
  export default productVariantReducer;
  