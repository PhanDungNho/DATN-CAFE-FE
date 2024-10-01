import React from "react";
import { Route, Routes } from "react-router-dom";
import ListProduct from "../../components/admin/products/ListProduct";
import DashboardPage from "../../components/admin/page/DashboardPage";
import ListCategory from "../../components/admin/categories/ListCategory";
import CounterForm from "../../components/admin/sales-counter/CounterForm";
import ListSize from "../../components/admin/sizes/ListSize";

function Admin() {
  return (
    <>
      <Routes>
        <Route path="*" element={<DashboardPage />}>
          <Route path="categories/list" element={<ListCategory />} />
          <Route path="orders" element={<CounterForm />} />
          <Route path="products/list" element={<ListProduct />} />
          <Route path="sizes/list" element={<ListSize />} />
        </Route>
      </Routes>
    </>
  );
}

export default Admin;
