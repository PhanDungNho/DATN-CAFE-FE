import axios from "axios";
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "./actionType";
import { API_LOGIN } from "../../services/constant"; // Import API_LOGIN từ file constants

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    // Sử dụng API_LOGIN thay vì URL cố định
    const { data } = await axios.post(API_LOGIN, {
      username,
      password,
    });

    // Log ra response khi đăng nhập thành công
    console.log("Login response:", data);

    // Kiểm tra roles và alert ra giá trị phù hợp
    if (data.roles.includes("ROLE_STAFF") || data.roles.includes("ROLE_ADMIN")) {
       window.location.href = "/admin";
    } else {
      alert(2); // Ngược lại
    }

    // Xử lý khi đăng nhập thành công
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        username: data.username,
        roles: data.roles,
        token: data.accessToken,
      },
    });

    // Lưu token vào localStorage (nếu cần)
    localStorage.setItem("token", data.accessToken);
  } catch (error) {
    // Xử lý khi đăng nhập thất bại
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response ? error.response.data.message : "Login failed",
    });
  }
};

export const logout = () => (dispatch) => {
  // Xóa token từ localStorage
  localStorage.removeItem("token");

  // Dispatch hành động LOGOUT để cập nhật lại state trong Redux
  dispatch({ type: LOGOUT });

  // Điều hướng người dùng trở về trang đăng nhập
  window.location.href = "/login"; // Hoặc dùng history.push("/login") nếu dùng React Router
};
