import { INVOICE_SET, INVOICES_SET } from "../actions/actionType";

const initialState = {
  invoice: {},
  invoices: [],
};

const invoiceReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INVOICE_SET:
      return { ...state, invoice: payload };
    case INVOICES_SET:
      return { ...state, invoices: payload };
    default:
      return state;
  }
};

export default invoiceReducer;
