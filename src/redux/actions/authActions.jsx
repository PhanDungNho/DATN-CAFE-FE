// import axios from "axios";
// import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "./actionType";
// import { API_LOGIN,API_GOOGLE_LOGIN } from "../../services/constant"; // Import API_LOGIN từ file constants

// export const login = (username, password) => async (dispatch) => {
//   try {
//     dispatch({ type: LOGIN_REQUEST });

//     // Sử dụng API_LOGIN thay vì URL cố định
//     const { data } = await axios.post(API_LOGIN, {
//       username,
//       password,
//     });

//     // Log ra response khi đăng nhập thành công
//     console.log("Login response:", data);

//     // Kiểm tra roles và alert ra giá trị phù hợp
//     if (data.roles.includes("ROLE_STAFF") || data.roles.includes("ROLE_ADMIN")) {
//        window.location.href = "/admin";
//     } else {
//       alert(2); // Ngược lại
//     }

//     // Xử lý khi đăng nhập thành công
//     dispatch({
//       type: LOGIN_SUCCESS,
//       payload: {
//         username: data.username,
//         roles: data.roles,
//         token: data.accessToken,
//       },
//     });

//     // Lưu token vào localStorage (nếu cần)
//     localStorage.setItem("token", data.accessToken);
//     localStorage.setItem("user", JSON.stringify(data));
  
//   } catch (error) {
//     // Xử lý khi đăng nhập thất bại
//     dispatch({
//       type: LOGIN_FAILURE,
//       payload: error.response ? error.response.data.message : "Login failed",
//     });
//   }
// };



// // Hàm xử lý khi đăng nhập Google thất bại
// const handleGoogleLoginFailure = (error) => {
//   console.error("Google login failed:", error);
// };

// export const logout = () => (dispatch) => {
//   // Xóa token từ localStorage
//   localStorage.removeItem("token");

//   // Dispatch hành động LOGOUT để cập nhật lại state trong Redux
//   dispatch({ type: LOGOUT });

//   // Điều hướng người dùng trở về trang đăng nhập
//   window.location.href = "/login"; // Hoặc dùng history.push("/login") nếu dùng React Router
// };

import axios from "axios";
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "./actionType";
import { API_LOGIN, API_GOOGLE_LOGIN } from "../../services/constant";

// Hàm đăng nhập với username và password
export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const { data } = await axios.post(API_LOGIN, {
      username,
      password,
    });

    console.log("Login response:", data);

    if (data.roles.includes("ROLE_STAFF") || data.roles.includes("ROLE_ADMIN")) {
      window.location.href = "/admin";
    } else {
      alert("Bạn không có quyền truy cập");
    }

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        username: data.username,
        roles: data.roles,
        token: data.accessToken,
      },
    });

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data));
  
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response ? error.response.data.message : "Login failed",
    });
  }
};

export const loginGG = () => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const { data } = await axios.post(API_GOOGLE_LOGIN);

    console.log("Login response:", data);

    if (data.roles.includes("ROLE_STAFF") || data.roles.includes("ROLE_ADMIN")) {
      window.location.href = "/admin";
    } else {
      alert("Bạn không có quyền truy cập");
    }

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        username: data.username,
        roles: data.roles,
        token: data.accessToken,
      },
    });

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data));
  
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response ? error.response.data.message : "Login failed",
    });
  }
};
export const handleGoogleLoginSuccess = async (credentialResponse) => {
  console.log(credentialResponse);
  console.log(credentialResponse.credential);
  try {
    // Gửi credential đến backend của bạn để xác thực
    const {data} = await axios.post(API_GOOGLE_LOGIN, credentialResponse, {
      // headers: {
      //   "Authorization": "Bearer " + localStorage.getItem("token") // Gửi token trong header
      // }
    });
    if (data.roles.includes("ROLE_STAFF") || data.roles.includes("ROLE_ADMIN")) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/admin";
    
    } else {
      window.location.href = "/";
    }

    console.log('Response from backend:', data);
    // Xử lý response từ backend ở đây, ví dụ lưu JWT vào localStorage
  } catch (error) {
    console.error('Error during Google login:', error);
  }
}; 
export   const handleGoogleAuth = async (response) => {
  try {
    const googleToken = response.credential; // Google ID token
    console.log(response)

    // Gửi token này lên backend để xác thực và nhận JWT token
    const authResponse = await axios.get("http://localhost:8081/api/v1/auth/google", {
      token: googleToken,
    });
    

    if (authResponse.data && authResponse.data.accessToken) {
      console.log("Authentication successful, received JWT token:", authResponse.data.accessToken);
      
      // Lưu JWT token vào localStorage
      localStorage.setItem("token", authResponse.data.accessToken);
      
      // Lưu thông tin người dùng nếu backend trả về
      localStorage.setItem("user", JSON.stringify(authResponse.data.user));

      // Chuyển hướng người dùng sau khi đăng nhập thành công
      window.location.href = "/dashboard";  // Hoặc bất kỳ trang nào bạn muốn
    } else {
      console.error("No token received from backend.");
    }
  } catch (error) {
    console.error("Authentication failed:", error.response?.data || error.message);
  }}

// Hàm xử lý thành công khi đăng nhập bằng Google
export const handleSuccess = (credentialResponse) => {
  const token = credentialResponse.credential;
  // Gửi token đến backend
  console.log(token)
};

// Hàm xử lý thất bại khi đăng nhập bằng Google
export const handleGoogleLoginFailure = (error) => {
  console.error("Google login failed:", error);
};

// Hàm đăng xuất
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  dispatch({ type: LOGOUT });

  window.location.href = "/login";
};
