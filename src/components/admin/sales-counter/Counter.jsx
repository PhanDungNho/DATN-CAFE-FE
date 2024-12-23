import React, { useState, useEffect, Component } from "react";
import { connect } from "react-redux";
import withRouter from "../../../helpers/withRouter";
import { Layout, Row, Col, Skeleton, Tabs } from "antd";
import ContentHeader from "../common/ContentHeader";
import CounterForm from "./CounterForm";
import { getAccounts } from "../../../redux/actions/accountAction";
import TabPane from "antd/es/tabs/TabPane";

import ListInvoices from "../orders/ListInvoices";
import { getInvoices } from "../../../redux/actions/invoiceAction";
const { Content, Footer } = Layout;

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, // Thêm trạng thái isLoading để hiển thị Skeleton
    };
  }

  componentDidMount() {
    // Load dữ liệu khi component mount
    this.props
      .getAccounts()
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        // Xử lý lỗi, ví dụ: Hiển thị thông báo lỗi cho người dùng
      });
  }
  handleTabChange = (key) => {
    this.setState({ activeTab: key });
    if (key === "2") {
      // Là tab "Đơn hàng"
      this.props.getInvoices(); // Gọi lại hàm getInvoices
    }
  };

  render() {
    const { navigate } = this.props.router;

    const { activeTab } = this.state;

    return (
      <Layout>
        <ContentHeader
          navigate={navigate}
          title="Orders"
          className="site-page-header"
        />
        <Content style={{ padding: "20px" }}>
          <Tabs
            defaultActiveKey="1"
            activeKey={activeTab}
            onChange={this.handleTabChange}
          >
            <TabPane tab="Sales counter" key="1">
              <CounterForm />
            </TabPane>
            <TabPane tab="Order" key="2">
              <ListInvoices />
            </TabPane>
          </Tabs>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Coffee shop management software ©2024
        </Footer>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  getAccounts: state.accountReducer.getAccounts,
});

const mapDispatchToProps = {
  getAccounts,
  getInvoices,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Counter));
