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
          <Route path="productvariants/list" element={<ListProductVariant />} />
          <Route path="productvariants/add" element={<AddorEditVariant />} />

          <Route
            path="categories/list"
            element={
              <PrivateRoute requiredRoles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <ListCategory />
              </PrivateRoute>
            }
          />

          <Route
            path="orders"
            element={
              <PrivateRoute requiredRoles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <Counter />
              </PrivateRoute>
            }
          />

          <Route
            path="invoices"
            element={
              <PrivateRoute requiredRoles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <ListInvoices />
              </PrivateRoute>
            }
          />

          <Route
            path="products/list"
            element={
              <PrivateRoute requiredRoles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <ListProduct />
              </PrivateRoute>
            }
          />

          <Route
            path="products/add"
            element={
              <PrivateRoute requiredRoles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <AddOrEditProduct />
              </PrivateRoute>
            }
          />

          <Route
            path="products/update/:id"
            element={
              <PrivateRoute requiredRoles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <AddOrEditProduct />
              </PrivateRoute>
            }
          />

          <Route
            path="productvariants/update/:id"
            element={
              <PrivateRoute requiredRoles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <AddorEditVariant />
              </PrivateRoute>
            }
          />

          <Route
            path="sizes/list"
            element={
              <PrivateRoute requiredRoles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <ListSize />
              </PrivateRoute>
            }
          />

          <Route
            path="toppings/list"
            element={
              <PrivateRoute requiredRoles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <ListTopping />
              </PrivateRoute>
            }
          />

          <Route
            path="authorities/list"
            element={
              <PrivateRoute requiredRoles={["ROLE_SUPERADMIN"]}>
                <ListAuthority />
              </PrivateRoute>
            }
          />

          <Route
            path="accounts/list"
            element={
              <PrivateRoute requiredRoles={["ROLE_SUPERADMIN", "ROLE_ADMIN"]}>
                <ListAccount />
              </PrivateRoute>
            }
          />

          <Route
            path="statistics/list"
            element={
              <PrivateRoute requiredRoles={[ "ROLE_ADMIN"]}>
                <Statistic />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundDashBoard />} />
        </Route>
      </Routes>
    </>
  );
}

export default Admin;
