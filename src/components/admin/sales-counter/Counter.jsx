import React, { useState, useEffect, Component } from "react";
import { connect } from "react-redux";
import withRouter from "../../../helpers/withRouter";
import { Layout, Row, Col, Skeleton, Tabs } from "antd";
import ContentHeader from "../common/ContentHeader";
import CounterForm from "./CounterForm";
import { getAccounts } from "../../../redux/actions/accountAction";
import TabPane from "antd/es/tabs/TabPane";

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
        console.error("Lỗi khi tải dữ liệu:", error);
        // Xử lý lỗi, ví dụ: Hiển thị thông báo lỗi cho người dùng
      });
  }

  render() {
    const { navigate } = this.props.router;
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="List Categories"
            className="site-page-header"
          />
          <Skeleton active />
        </>
      );
    }

    return (
      <Layout>
        <ContentHeader
          navigate={navigate}
          title="List Category"
          className="site-page-header"
        />
        <Content style={{ padding: "20px" }}>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Sản phẩm" key="1">
          <CounterForm />  
          </TabPane>
          <TabPane tab="Tab 2" key="2">
           
          </TabPane>
         
        </Tabs>

        
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Phần mềm quản lý quán cà phê ©2024
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Counter));
