import {
  INVOICE_SET,
  INVOICE_UPDATE,
  INVOICE_UPDATE_ACTIVE,
  INVOICES_SET,
} from "../actions/actionType";

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
    case INVOICE_UPDATE_ACTIVE:
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === payload.id
            ? { ...invoice, active: payload.active }
            : invoice
        ),
      };
    case INVOICE_UPDATE:
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === payload.id
            ? { ...invoice, ...payload.order } 
            : invoice
        ),
      };

    default:
      return state;
  }
};

export default invoiceReducer;
