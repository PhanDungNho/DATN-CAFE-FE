// src/components/user/UserLayout.js
import React from "react";
import { Layout } from "antd";
import Header from "./Header";

const { Content } = Layout;

const UserLayout = ({ children }) => {
  return (
    <Layout>
      <Content>
        {children}
      </Content>
    </Layout>
  );
};

export default UserLayout;
