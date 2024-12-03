import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { message } from "antd"; // Import thông báo
import ListProduct from "../../components/admin/products/ListProduct";
import DashboardPage from "../../components/admin/page/DashboardPage";
import ListCategory from "../../components/admin/categories/ListCategory";
import ListSize from "../../components/admin/sizes/ListSize";
import ListTopping from "../../components/admin/toppings/ListTopping";
import ListAuthority from "../../components/admin/authorities/ListAuthority";
import ListAccount from "../../components/admin/accounts/ListAccount";
import Counter from "../../components/admin/sales-counter/Counter";
import AddOrEditProduct from "../../components/admin/products/AddOrEditProduct";
import ListInvoices from "../../components/admin/orders/ListInvoices";
import ListProductVariant from "../../components/admin/productvariants/ListProductVariant";
import AddorEditVariant from "../../components/admin/productvariants/AddorEditVariant";
import Statistic from "../../components/admin/statistics/StatisticList";
import NotFound from "../../components/user/404";
import PrivateRoute from "../../components/admin/protected/ProtectedRoute";

function NotFoundDashBoard() {
  return <h1 style={{ textAlign: "center" }}>You do not have permission</h1>;
}

function Admin() {
 

  return (
    <>
      <Routes>
        <Route path="*" element={<DashboardPage />}>
          <Route path="categories/list" element={<ListCategory />} />
          <Route path="orders" element={<Counter />} />
          <Route path="invoices" element={<ListInvoices />} />
          <Route path="products/list" element={<ListProduct />} />
          <Route path="products/add" element={<AddOrEditProduct />} />
          <Route path="products/update/:id" element={<AddOrEditProduct />} />
          <Route path="productvariants/list" element={<ListProductVariant />} />
          <Route path="productvariants/add" element={<AddorEditVariant />} />
          <Route
            path="productvariants/update/:id"
            element={<AddorEditVariant />}
          />
          <Route path="sizes/list" element={<ListSize />} />
          <Route path="toppings/list" element={<ListTopping />} />
          {/* Kiểm tra quyền truy cập trước khi render route authorities */}
          <Route
            path="authorities/list"
            element={
              <PrivateRoute requiredRoles={["ROLE_SUPERADMIN"]}>
                <ListAuthority />
              </PrivateRoute>
            }
          />
          <Route path="accounts/list" element={<ListAccount />} />
          <Route path="statistics/list" element={<Statistic />} />
          <Route path="*" element={<NotFoundDashBoard />} />
        </Route>
      </Routes>
    </>
  );
}

export default Admin;
