import React from "react";
import { Route, Routes } from "react-router-dom";
import ListProduct from "../../components/admin/products/ListProduct";
import DashboardPage from "../../components/admin/page/DashboardPage";
import ListCategory from "../../components/admin/categories/ListCategory";
import ListSize from "../../components/admin/sizes/ListSize";
import ListTopping from "../../components/admin/toppings/ListTopping";
import CounterForm from "../../components/admin/sales-counter/CounterForm";

import Counter from "../../components/admin/sales-counter/Counter";

import AddOrEditProduct from "../../components/admin/products/AddOrEditProduct";
import ListInvoices from "../../components/admin/orders/ListInvoices";


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
          <Route path="products/update/:id" element={<AddOrEditProduct  />} />
          <Route path="sizes/list" element={<ListSize />} />
          <Route path="toppings/list" element={<ListTopping />} />
        </Route>
      </Routes>
    </>
  );
}

export default Admin;
