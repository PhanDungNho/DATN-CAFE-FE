import "./DashboardPage.css";
import { Avatar, Button, Layout, Menu, message, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import {
  ProductOutlined,
  ReconciliationOutlined,
  PlusOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import {
  MdCategory,
  MdFormatListBulleted,
  MdLogout,
  MdManageAccounts,
  MdOutlineHome,
  MdSecurity,
  MdShoppingCart,
  MdSupervisorAccount,
} from "react-icons/md";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./DashboardPage.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { setError, setMessage } from "../../../redux/actions/commonAction";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/authActions";
import { FaCoffee, FaCookieBite } from "react-icons/fa";
import AccountService from "../../../services/accountService";

function DashboardPage() {
  const LoginedUser = JSON.parse(localStorage.getItem("user"));

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [marginLeft, setMarginLeft] = useState(200);
  const siteLayoutStyle = { marginLeft: marginLeft };

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const msg = useSelector((state) => state.commonReducer.message);
  const err = useSelector((state) => state.commonReducer.error);

  const handleLogout = () => {
    // Gọi action logout
    dispatch(logout());

    // Điều hướng về trang đăng nhập bằng window.location.href
    window.location.href = "/login";
  };

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

  const selectedKey = () => {
    if (location.pathname.startsWith("/admin/categories/list")) {
      return "2";
    }
    if (location.pathname === "/admin/orders") {
      return "3";
    }

    if (location.pathname.startsWith("/admin/products/update")) {
      return "4a";
    }
    if (location.pathname === "/admin/products/add") {
      return "4a";
    }
    if (location.pathname === "/admin/products/list") {
      return "4b";
    }

    if (location.pathname === "/admin/sizes/list") {
      return "6";
    }
    if (location.pathname === "/admin/toppings/list") {
      return "7";
    }

    if (location.pathname.startsWith("/admin/accounts/list")) {
      return "8";
    }
    if (location.pathname === "/admin/authorities/list") {
      return "9";
    }
    if (location.pathname === "/admin/invoices") {
      return "10";
    }
    if (location.pathname === "/admin/productvariants/add") {
      return "12a";
    }
    if (location.pathname === "/admin/productvariants/update") {
      return "12a";
    }
    if (location.pathname === "/admin/productvariants/list") {
      return "12b";
    }

    return "1"; // Mặc định là Home
  };
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "#ffffff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div
          className="logo"
          style={{
            margin: "16px",
            textAlign: "center",
          }}
        >
          <img
            src={collapsed ? "/assets/img/logo1.png" : "/assets/img/logo2.png"}
            alt="Logo"
            style={{
              width: collapsed ? "90px" : "200px",
              height: "60px",
              transition: "width 0.2s",
            }}
          />
        </div>
        <Menu
          theme="light" // Thay đổi theme thành light
          mode="inline"
          selectedKeys={[selectedKey()]}
          style={{
            backgroundColor: "#ffffff", // Nền menu light
            color: "#FF6600", // Màu chữ chủ đạo
          }}
          items={[
            {
              key: "1",
              icon: <MdOutlineHome />,
              label: "Home",
              onClick: () => navigate("/admin"),
            },
            {
              key: "2",
              icon: <MdCategory />,
              label: "Categories",
              onClick: () => navigate("/admin/categories/list"),
            },
            {
              key: "3",
              icon: <MdShoppingCart />,
              label: "Orders",
              onClick: () => navigate("/admin/orders"),
            },
            {
              key: "4",
              icon: <ProductOutlined />,
              label: "Products",
              children: [
                {
                  key: "4a",
                  icon: <PlusOutlined />,
                  label: "Add Product",
                  onClick: () => navigate("/admin/products/add"),
                },
                {
                  key: "4b",
                  icon: <MdFormatListBulleted />,
                  label: "List Products",
                  onClick: () => navigate("/admin/products/list"),
                },
              ],
            },
            {
              key: "12",
              icon: <ProductOutlined />,
              label: "Product Variant",
              children: [
                {
                  key: "12a",
                  icon: <PlusOutlined />,
                  label: "Add Product Variant",
                  onClick: () => navigate("/admin/productvariants/add"),
                },
                {
                  key: "12b",
                  icon: <MdFormatListBulleted />,
                  label: "List Product Variant",
                  onClick: () => navigate("/admin/productvariants/list"),
                },
              ],
            },
            {
              key: "6",
              icon: <FaCoffee />,
              label: "Sizes",
              onClick: () => navigate("/admin/sizes/list"),
            },
            {
              key: "7",
              icon: <FaCookieBite />,
              label: "Toppings",
              onClick: () => navigate("/admin/toppings/list"),
            },
            {
              key: "8",
              icon: <MdSupervisorAccount />,
              label: "Accounts",
              onClick: () => navigate("/admin/accounts/list"),
            },
            {
              key: "9",
              icon: <MdSecurity />,
              label: "Authorities",
              onClick: () => navigate("/admin/authorities/list"),
            },
            {
              key: "10",
              icon: <ReconciliationOutlined />,
              label: "Invoices",
              onClick: () => navigate("/admin/invoices"),
            },
            {
              key: "13",
              icon: <ReconciliationOutlined />,
              label: "Statistics",
              onClick: () => navigate("/admin/statistics/list"),
            },
            
            
            {
              key: "11",
              icon: <MdLogout />,
              label: "Logout",
              onClick: handleLogout,
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout" style={siteLayoutStyle}>
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: "#ffffff",
            right: 0,
            left: marginLeft,
            top: 0,
            position: "fixed",
            height: 70,
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              const sts = !collapsed;
              setCollapsed(sts);
              setMarginLeft(sts ? 80 : 200);
            }}
            className="no-outline"
            style={{
              fontSize: "16px",
              width: 30,
              height: 30,
            }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="default"
              src={AccountService.getAccountLogoUrl(LoginedUser.image)}
              icon={!LoginedUser?.image && <UserOutlined />}
            />
            <span style={{ marginLeft: 8, color: "#000000" }}>
              {LoginedUser.username}
            </span>
          </div>
        </Header>
        <Content
          style={{
            margin: "70px 0 0 0",
            minHeight: 280,
            background: "#FFFFFF",
          }}
        >
          <div className="content-panel">
            <Routes>
              <Route path="/" element={"Xin chào"}></Route>
              {/* Thêm các Route khác ở đây nếu cần */}
            </Routes>
            <Outlet></Outlet>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardPage;