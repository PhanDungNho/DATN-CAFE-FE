import { Avatar, Button, Col, Layout, Menu, Row, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {
  MdAddCircleOutline,
  MdCategory,
  MdFormatListBulleted,
  MdInsertChartOutlined,
  MdLogout,
  MdManageAccounts,
  MdOutlineHome,
  MdOutlineShoppingBag,
  MdPrecisionManufacturing,
  MdRequestPage,
  MdSupervisorAccount,
} from "react-icons/md";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [marginLeft, setMarginLeft] = useState(200);
  const siteLayoutStyle = { marginLeft: marginLeft };

  const navigate = useNavigate();

  // const msg = useSelector((state) => state.commonReducer.message);
  // const err = useSelector((state) => state.commonReducer.error);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (msg) {
  //     dispatch(setMessage(""));
  //     message.success(msg);
  //   }

  //   if (err) {
  //     dispatch(setError(""));
  //     message.error(err);
  //   }
  // }, [msg, err]);

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
        }}
      >
        <div
          className="logo"
          style={{
            color: "#fff",
          }}
        >
          <h2>{collapsed ? "CS" : "CoffeeShop"}</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
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
              icon: <MdPrecisionManufacturing />,
              label: "Others",
              onClick: () => navigate("/admin/orders"),
            },
            {
              key: "4",
              icon: <MdPrecisionManufacturing />,
              label: "Products",
              children: [
                {
                  key: "4a",
                  icon: <MdFormatListBulleted />,
                  label: "Upload images",
                  onClick: () => navigate("/products/upload"),
                },
                {
                  key: "4b",
                  icon: <MdFormatListBulleted />,
                  label: "Add Product",
                  onClick: () => navigate("/products/add"),
                },
                {
                  key: "4c",
                  icon: <MdFormatListBulleted />,
                  label: "List Products",
                  onClick: () => navigate("/admin/products/list"),
                },
              ],
            },
            {
              key: "7",
              icon: <MdManageAccounts />,
              label: "Profiles",
            },
            {
              key: "8",
              icon: <MdSupervisorAccount />,
              label: "Accounts",
            },
            {
              key: "9",
              icon: <MdLogout />,
              label: "Logout",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout" style={siteLayoutStyle}>
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: colorBgContainer,
            right: 16,
            left: marginLeft + 16,
            top: 0,
            position: "fixed",
            height: 70,
          }}
        >
          <Row>
            <Col md={18}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {
                  const sts = !collapsed;
                  setCollapsed(sts);
                  setMarginLeft(sts ? 80 : 200);
                }}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col md={6}>
              <div>
                <Avatar size="default" icon={<UserOutlined />}></Avatar> Phan
                Dũng Nhớ
              </div>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "80px 24px 16px 24px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="content-panel">
            <Routes>
              <Route path="/" element={"Xin chào"}></Route>
            </Routes>
            <Outlet></Outlet>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardPage;
