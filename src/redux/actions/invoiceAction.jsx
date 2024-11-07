import invoiceService from "../../services/invoiceService";
import OrderService from "../../services/orderService";
import {
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
  INVOICE_DELETE,
  INVOICE_UPDATE,
  INVOICE_UPDATE_ACTIVE,
  INVOICES_SET,
} from "./actionType";

export const getInvoices = () => async (dispatch) => {
  const service = new invoiceService();

  try {
    console.log("get all invoices");

    // dispatch({
    //   type: COMMON_LOADING_SET,
    //   payload: true,
    // });

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

export const getInvoicesByDate = (startDate, endDate) => async (dispatch) => {
  const service = new invoiceService();

  try {
    console.log("get invoices by date");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getInvoicesByDate(startDate, endDate);
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

export const updateOrderActive = (id, active) => async (dispatch) => {
  const service = new invoiceService();

  console.log("update active order");

  try {
    // dispatch({
    //   type: COMMON_LOADING_SET,
    //   payload: true,
    // });

    const response = await service.updateOrderActive(id, active);
    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: INVOICE_UPDATE_ACTIVE,
        payload: { id, active },
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Cập nhật trạng thái thành công",
      });
    } else {
      const prevActive = !active;
      dispatch({
        type: INVOICE_UPDATE_ACTIVE,
        payload: { id, active: prevActive },
      });
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    const previousActive = !active;
    dispatch({
      type: INVOICE_UPDATE_ACTIVE,
      payload: { id, active: previousActive },
    });

    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  }
  dispatch({
    type: COMMON_LOADING_SET,
    payload: false,
  });
};

export const updateOrder = (id, order) => async (dispatch) => {
  const services = new invoiceService();

  try {
    console.log("Update order");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await services.updateOrderStatus(id, order);
    console.log("response order: ", response);

    if (response.status === 201) {
      dispatch({
        type: INVOICE_UPDATE,
        payload: { id, order },
      });

      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: `Cập nhật thành công cho order ID: ${id}`,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.data?.message || "Unknown error",
      });
    }
  } catch (error) {
    console.error("Error response:", error.response);
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response?.data?.message || error.message,
    });
  } finally {
    dispatch({ type: COMMON_LOADING_SET, payload: false });
  }
};

export const deleteOrderById = (id) => async (dispatch) => {
  const service = new OrderService();

  try {
    console.log("delete order by id", id);

    const response = await service.deleteOrderById(id);
    console.log("API response delete: ", response);

    if (response.status === 200) {
      dispatch({
        type: INVOICE_DELETE,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
};
