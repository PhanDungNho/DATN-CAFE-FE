import invoiceService from "../../services/invoiceService";
import { COMMON_ERROR_SET, COMMON_LOADING_SET, INVOICES_SET } from "./actionType";

export const getInvoices = () => async (dispatch) => {
    const service = new invoiceService();
  
    try {
      console.log("get all invoices");
  
      dispatch({
        type: COMMON_LOADING_SET,
        payload: true,
      });
  
      const response = await service.getInvoices();
      console.log(response);
  
      if (response.status === 200) {
        dispatch({
          type: INVOICES_SET,
          payload: response.data,
        });
      } else {
        dispatch({
          type: COMMON_ERROR_SET,
          payload: response.message,
        });
      }
    } catch (error) {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: error.response.data
          ? error.response.data.message
          : error.message,
      });
    }
    dispatch({
      type: COMMON_LOADING_SET,
      payload: false,
    });
  };