const API = "http://103.166.183.216:8080"


export const API_PRODUCT = API + "/api/v1/products";
export const API_PRODUCTVARIANT =
  API + "/api/v1/productvariants";
export const API_CATEGORY = API + "/api/v1/categories";
export const API_LOGIN = API + "/api/v1/login";
export const API_SIZE = API + "/api/v1/sizes";
export const API_ACCOUNT = API + "/api/v1/account";
export const API_TOPPING = API + "/api/v1/toppings";
export const API_ORDER = API + "/api/v1/orders";
export const API_MOMO = "http://localhost:2999";
export const API_TRANSACTION = API + "/api/v1/transactions";
export const API_GOOGLE_LOGIN = API + "/api/v1/auth/google";
export const GG_CLIENT_ID =
  "1054341439647-mp87d5v01991tj7l16t3drpceeb21m2u.apps.googleusercontent.com";
export const API_INVOICE = API + "/api/v1/orders";
export const API_AUTHORITY = API + "/api/v1/authorities";
export const API_CARTDETAIL = API + "/api/v1/cartDetails";
export const API_CARTDETAILTOPPING = API + "/api/v1/cartDetailToppings";
export const API_ADDRESS = API + "/api/v1/address";
export const API_GHN_PROVINCE =
  "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
export const API_GHN_DISTRICT =
  "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
export const API_GHN_WARD =
  "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
export const API_GHN_AVAILABLE_SERVICES =
  "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
export const API_GHN_FEE =
  "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";

// GHN API Key (replace with your key)
const API_KEY = "7033118c-14d0-11ef-8aec-2293d60b7bbb";

// Fetch Provinces
export async function fetchProvinces() {
  try {
    const response = await fetch(API_GHN_PROVINCE, {
      headers: {
        "Content-Type": "application/json",
        Token: API_KEY,
      },
    });
    const data = await response.json();
    console.log("API GHN: ", data.data);
    return data.data; // Returns array of provinces
  } catch (error) {
    console.error("Error fetching provinces:", error);
  }
}

export async function calculateShippingFee(body) {
  try {
    const response = await fetch(API_GHN_FEE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: API_KEY,
      },
      body: JSON.stringify(body), // Chuyển đổi body thành chuỗi JSON
    });

    // Nếu mã trạng thái không thành công
    if (!response.ok) {
      const errorResponse = await response.json(); // Parse nội dung lỗi
      throw new Error(`Error ${response.status}: ${errorResponse.message || 'Unknown error occurred'}`);
    }

    const data = await response.json(); // Lấy dữ liệu từ phản hồi
    return data; // Trả về dữ liệu đã parse
  } catch (error) {
    console.error("Error calculating shipping fee:", error);
    throw error; // Ném lại lỗi để có thể xử lý ở nơi gọi hàm
  }
}

// Fetch Districts based on Province ID
export async function fetchDistricts(provinceId) {
  try {
    const response = await fetch(API_GHN_DISTRICT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: API_KEY,
      },
      body: JSON.stringify({ province_id: parseInt(provinceId) }),
    });
    const data = await response.json();
    return data.data; // Returns array of districts
  } catch (error) {
    console.error("Error fetching districts:", error);
  }
}

// Fetch Wards based on District ID
export async function fetchWards(districtId) {
  try {
    const response = await fetch(API_GHN_WARD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: API_KEY,
      },
      body: JSON.stringify({ district_id: parseInt(districtId) }),
    });
    const data = await response.json();
    return data.data; // Returns array of wards
  } catch (error) {
    console.error("Error fetching wards:", error);
  }
}
