import React, { useEffect } from "react";
import { Layout, message } from "antd";
import { Route, Routes, useNavigate } from "react-router-dom";
import Index from "../../components/user/index";
import Login from "../../components/user/login";
import Register from "../../components/user/register";
import OtpRegister from "../../components/user/VerifyOtp.jsx";
import Cart from "../../components/user/cart";
import Checkout from "../../components/user/checkout";
import Shop from "../../components/user/shop";
import Product from "../../components/user/single-product";
import NotFound from "../../components/user/404";
import ManagerUser from "../../components/user/manageruser";
import UpdateAddress from "../../components/user/address/updateaddress";
import UpdateProfile from "../../components/user/updateprofile";

import WaitOrder from "../../components/user/waitorders";
import TransOrder from "../../components/user/transorders";
import SuccessOrder from "../../components/user/successorders";
import CancelOrder from "../../components/user/cancelorder";
import NewPassword from "../../components/user/newpassword";
import ForgotPassword from "../../components/user/forgotpassword";
import OtpPassword from "../../components/user/otp";

import PaymentService from "../../services/PaymentService";
import PaymentResult from "../../components/user/PaymentResult";
import GoogleCallback from "../../services/GoogleAuthService";
import Loginwithgoogledrap from "../../components/user/loginwithgoogledrap";

import About from "../../components/user/about";
import { useDispatch, useSelector } from "react-redux";
import { setError, setMessage } from "../../redux/actions/commonAction.js";
import Allorder from "../../components/user/orders/allorders.jsx";
import Bill from "../../components/user/bill.jsx";

function User() {
  const navigate = useNavigate();

  const msg = useSelector((state) => state.commonReducer.message);
  const err = useSelector((state) => state.commonReducer.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (msg) {
      dispatch(setMessage(""));
      message.success(msg);
    }

    if (err) {
      dispatch(setError(""));
      message.error(err);
    }
  }, [msg, err]);

  const handleOtherMenuClick = (path) => {
    // Điều hướng đến các route chính
    navigate(`/${path}`);
  };

  return (
    <Layout>
      <Routes>
        {/* Định nghĩa các routes chính */}
        <Route path="/" element={<Index />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/single-product/:id" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/VerifyOtp" element={<OtpRegister />} />
        <Route
          path="/forgotpassword/otp/newpassword"
          element={<NewPassword />}
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/forgotpassword/otp" element={<OtpPassword />} />

        <Route path="/drap" element={<PaymentService />} />
        <Route path="/drap1" element={<Loginwithgoogledrap />} />
        <Route path="/paymentresult" element={<PaymentResult />} />
        <Route path="/google-callback" element={<GoogleCallback />} />

        <Route path="/About" element={<About />} />
        <Route path="/bill/:billId" element={<Bill />} />

        {/* Route cho ManagerUser với đường dẫn /manager */}
        <Route path="/manager/*" element={<ManagerUser />}>
          <Route path="" element={<UpdateAddress />} />
          <Route path="address" element={<UpdateAddress />} />
          <Route path="info" element={<UpdateProfile />} />
          <Route path="orders" element={<Allorder />} />
          {/* <Route path="orders/pending" element={<WaitOrder />} />
          <Route path="orders/shipping" element={<TransOrder />} />
          <Route path="orders/completed" element={<SuccessOrder />} />
          <Route path="orders/canceled" element={<CancelOrder />} /> */}
        </Route>
        <Route path="*" element={<Index />} />
      </Routes>
    </Layout>
  );
}

export default User;
