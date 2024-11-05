import React from "react";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const { Content, Sider } = Layout;

const items2 = [
  {
    key: "account",
    icon: React.createElement(UserOutlined),
    label: "Tài khoản của tôi",
    children: [
      { label: "Địa chỉ", key: "address" },
      { label: "Thông tin cá nhân", key: "info" },
    ],
  },
  {
    key: "orders",
    icon: React.createElement(LaptopOutlined),
    label: "Đơn hàng",
    // children: [
    //   { label: "Tất cả", key: "orders" },
    //   { label: "Chờ xác nhận", key: "orders/pending" },
    //   { label: "Vận chuyển", key: "orders/shipping" },
    //   { label: "Hoàn thành", key: "orders/completed" },
    //   { label: "Đã hủy", key: "orders/canceled" },
    // ],
  },
];

function ManagerUser() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (menuItem) => {
    // Điều hướng tới các route có /manager
    navigate(`/manager/${menuItem.key}`);
  };

  return (
    <>
      <Header />
      <div className="breadcrumb-section breadcrumb-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="breadcrumb-text">
                <p>Fresh and Organic</p>
                <h1>Manager User</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Layout
        className="container-fluid"
        style={{ minHeight: "100vh", margin: "25px auto" }}
      >
        <Layout>
          <Sider
            width={200}
            style={{
              background: colorBgContainer,
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[location.pathname.split("/")[2]]}
              defaultOpenKeys={["account"]}
              style={{ height: "100%", borderRight: 0 }}
              items={items2}
              onClick={handleMenuClick}
            />
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <Footer />
    </>
  );
}

export default ManagerUser;
