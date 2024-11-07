export const API_PRODUCT = "http://localhost:8081/api/v1/products";
export const API_PRODUCTVARIANT = "http://localhost:8081/api/v1/productvariants";
export const API_CATEGORY = "http://localhost:8081/api/v1/categories";
export const API_LOGIN = "http://localhost:8081/api/v1/login";
export const API_SIZE = "http://localhost:8081/api/v1/sizes";
export const API_ACCOUNT = "http://localhost:8081/api/v1/account";
export const API_TOPPING = "http://localhost:8081/api/v1/toppings";
export const API_ORDER = "http://localhost:8081/api/v1/orders";
export const API_MOMO = "http://localhost:2999";
export const API_TRANSACTION = "http://localhost:8081/api/v1/transactions";
export const API_GOOGLE_LOGIN = "http://localhost:8081/api/v1/auth/google"; 
export const GG_CLIENT_ID="1054341439647-mp87d5v01991tj7l16t3drpceeb21m2u.apps.googleusercontent.com"
export const API_INVOICE = "http://localhost:8081/api/v1/orders";
export const API_AUTHORITY = "http://localhost:8081/api/v1/authorities";
export const API_CARTDETAIL = "http://localhost:8081/api/v1/cartDetails";
export const API_ADDRESS = "http://localhost:8081/api/v1/address";
export const API_GHN_PROVINCE = "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
export const API_GHN_DISTRICT = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
export const API_GHN_WARD = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
export const API_GHN_AVAILABLE_SERVICES = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
export const API_GHN_FEE = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";


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
        return data.data; // Returns array of provinces
    } catch (error) {
        console.error("Error fetching provinces:", error);
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