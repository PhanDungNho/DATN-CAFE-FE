import {
  ADDRESSES_SET,
  ADDRESS_APPEND,
  ADDRESS_SET,
  ADDRESS_STATE_CLEAR,
  ADDRESS_UPDATE,
  ADDRESS_UPDATE_ACTIVE,
  ADDRESS_DELETE,
  ADDRESS_UPDATE_ISDEFAULT, // Import the new action type

} from "../actions/actionType";

const initialState = {
  address: {},
  addresses: [],
};

const addressReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADDRESS_SET:
      return { ...state, address: payload };
    case ADDRESSES_SET:
      return { ...state, addresses: payload };
    case ADDRESS_STATE_CLEAR:
      return { address: {}, addresses: [] };
    case ADDRESS_APPEND:
      return {
        ...state,
        addresses: [payload, ...state.addresses],
      };
    case ADDRESS_UPDATE:
      return {
        ...state,
        addresses: state.addresses.map((address) =>
          address.id === payload.id ? { ...address, ...payload } : address
        ),
      };
    case ADDRESS_UPDATE_ACTIVE:
      return {
        ...state,
        addresses: state.addresses.map((address) =>
          address.id === payload.id
            ? { ...address, active: payload.active }
            : address
        ),
      };
    case ADDRESS_UPDATE_ISDEFAULT: // Handle the new action
      return {
        ...state,
        addresses: state.addresses.map((address) =>
          address.id === payload.id
            ? { ...address, isDefault: payload.isDefault } // Update isDefault field
            : address
        ),
      };
    case ADDRESS_DELETE:
      return {
        ...state,
        addresses: state.addresses.filter((address) => address.id !== payload),
      };
    default:
      return state;
  }
};

export default addressReducer;
