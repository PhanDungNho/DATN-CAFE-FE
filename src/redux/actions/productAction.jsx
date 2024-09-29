import ProductService from "../../services/productService";
import { PRODUCT_SET, PRODUCTS_SET } from "./actionType";

export const getProducts = () => async (dispatch) => {
  const service = new ProductService();

  try {
    console.log("get products");

    const response = await service.getProducts();

    console.log(response);

    if (response.status === 200) {
      dispatch({
        type: PRODUCTS_SET,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = (id) => async (dispatch) => {
  const service = new ProductService();

  try {
    console.log("get product by id");

    const response = await service.getProduct(id);

    console.log(response);

    if (response.status === 200) { 
      dispatch({
        type: PRODUCT_SET,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log(error);
  }
};