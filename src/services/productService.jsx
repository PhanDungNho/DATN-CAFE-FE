import axios from "axios";
import { API, API_PRODUCT } from "./constant";

export default class ProductService {
  insertProduct(product) {
    const formData = new FormData();

    const baseSlug = this.createSlug(product.name);

    // Append product fields to FormData
    formData.append("name", product.name);
    formData.append("active", product.active);
    formData.append("slug", baseSlug);
    formData.append("description", product.description);
    formData.append("categoryId", product.categoryId);

    // Append image files (giữ lại file thực tế)
    product.imageFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });

    // Append product variants
    product.productVariants.forEach((variant, index) => {
      formData.append(`productVariants[${index}].sizeId`, variant.sizeId);
      formData.append(`productVariants[${index}].price`, variant.price);
      formData.append(`productVariants[${index}].active`, variant.active);
    });

    // Append product toppings
    product.productToppings.forEach((topping, index) => {
      formData.append(`productToppings[${index}].toppingId`, topping.toppingId);
      formData.append(`productToppings[${index}].productId`, product.id || "");
    });

    console.log("insert nè", [...formData]);

    return axios.post(API_PRODUCT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s]+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  generateUniqueSlug(baseSlug, existingSlugs) {
    let newSlug = baseSlug;
    let count = 1;

    while (existingSlugs.includes(newSlug)) {
      newSlug = `${baseSlug}-${count}`;
      count++;
    }

    return newSlug;
  }

  updateProduct = async (id, product) => {
    const formData = new FormData();

    const baseSlug = this.createSlug(product.name);

    // Append product fields to FormData
    formData.append("name", product.name);
    formData.append("active", product.active);
    formData.append("slug", baseSlug); // Thêm slug
    formData.append("description", product.description);
    formData.append("categoryId", product.categoryId);

    // Kiểm tra nếu imageFiles tồn tại và không rỗng trước khi append
    if (product.imageFiles && product.imageFiles.length > 0) {
      product.imageFiles.forEach((file) => {
        if (file) {
          formData.append("imageFiles", file);
        }
      });
    }

    // Append product variants (nếu có)
    if (product.productVariants && product.productVariants.length > 0) {
      product.productVariants.forEach((variant, index) => {
        formData.append(`productVariants[${index}].id`, variant.id);
        formData.append(`productVariants[${index}].sizeId`, variant.sizeId);
        formData.append(`productVariants[${index}].price`, variant.price);
        formData.append(`productVariants[${index}].active`, variant.active);
      });
    }

    // Append product toppings (nếu có)
    if (product.productToppings && product.productToppings.length > 0) {
      product.productToppings.forEach((topping, index) => {
        formData.append(
          `productToppings[${index}].toppingId`,
          topping.toppingId
        ); // Sử dụng topping.toppingId thay vì topping.id
        formData.append(`productToppings[${index}].productId`, product.id);
      });
    }

    console.log("update nè", [...formData]);

    return axios.patch(API_PRODUCT + "/" + id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  getProducts = async () => {
    return await axios.get(API_PRODUCT, {
  
    });
  };

  getProductsUser = async () => {
    return await axios.get(API_PRODUCT, {});
  };

  getProductsByName = async (params) => {
    return await axios.get(API_PRODUCT + "/find", {
      params,
   
    });
  };

  getProduct = async (id) => {
    return await axios.get(API_PRODUCT + "/" + id + "/get", {
   
    });
  };

  getProductBySlug = async (slug) => {
    return await axios.get(API_PRODUCT + "/" + slug + "/getBySlug", {
   
    });
  };



  deleteProductImage = async (fileName) => {
    await axios.delete(API_PRODUCT + "/images/" + fileName, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  static getProductImageUrl = (fileName) => {
    return API_PRODUCT + "/images/" + fileName;
  };

  static getProductImageUploadUrl = () => {
    return API_PRODUCT + "/images/one";
  };

  updateProductActive = async (id, active) => {
    return await axios.patch(
      API_PRODUCT + "/" + id + "/toggle-active",
      { active }, // Gửi `active` dưới dạng object
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
        },
      }
    );
  };

  findProductByNameContainsIgnoreCase = async (query) => {
    return await axios.get(API_PRODUCT + "/find", {
      params: {
        query: query,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  async uploadImages(formData) {
    const response = await axios.post(
      API +  "/api/v1/products/images/", // Địa chỉ API của bạn
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }

  updateProductOrdering = async (newData) => {
    return await axios.patch(API_PRODUCT + "/update-ordering", newData, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };
}
