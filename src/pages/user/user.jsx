import React from "react";
import { Layout } from "antd";
import { Route, Routes, useNavigate } from "react-router-dom";
import Index from "../../components/user/index";
import Login from "../../components/user/login";
import Register from "../../components/user/register";
import Cart from "../../components/user/cart";
import Checkout from "../../components/user/checkout";
import Shop from "../../components/user/shop";
import Product from "../../components/user/single-product";
import NotFound from "../../components/user/404";
import ManagerUser from "../../components/user/manageruser";
import UpdateAddress from "../../components/user/updateaddress";
import UpdateProfile from "../../components/user/updateprofile";
import AllOrder from "../../components/user/allorders";
import WaitOrder from "../../components/user/waitorders";
import TransOrder from "../../components/user/transorders";
import SuccessOrder from "../../components/user/successorders";
import CancelOrder from "../../components/user/cancelorder";
import ListProduct from "../../components/admin/products/ListProduct";

function User() {
  const navigate = useNavigate();

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
        <Route path="/single-product" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Route cho ManagerUser với đường dẫn /manager */}
       <Route path="/manager/*" element={<ManagerUser />} >
          <Route path="" element={<UpdateAddress />} />
          <Route path="address" element={<UpdateAddress />} />
          <Route path="info" element={<UpdateProfile />} />
          <Route path="orders/all" element={<AllOrder />} />
          <Route path="orders/pending" element={<WaitOrder />} />
          <Route path="orders/shipping" element={<TransOrder />} />
          <Route path="orders/completed" element={<SuccessOrder />} />
          <Route path="orders/canceled" element={<CancelOrder />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default User;
