import React, { Component } from "react";
import { connect } from "react-redux";
import ContentHeader from "../common/ContentHeader";
import { DatePicker, Col, Form, Input, Row, Skeleton, Space } from "antd";
import withRouter from "../../../helpers/withRouter";
import { getInvoices } from "../../../redux/actions/invoiceAction";
import InvoicesList from "./InvoicesList";

class ListInvoices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoices: {
        id: "",
        cashier: "",
        createdtime: "",
        totalamount: "",
        status: "",
        ordertype: "",
        paymentmethod: "",
      },
      open: false,
      query: "",
    };
  }

  componentDidMount = () => {
    this.props.getInvoices();
    console.log("did mount invoices");
  };

  render() {
    const { invoices, isLoading } = this.props;
    const { navigate } = this.props.router;
    const { open, query } = this.state;
    const { RangePicker } = DatePicker;

    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="List Categories"
            className="site-page-header"
          ></ContentHeader>
          <Skeleton active />
        </>
      );
    }
    return (
      <>
        <ContentHeader
          navigate={navigate}
          title="List Orders"
          className="site-page-header"
        ></ContentHeader>

        <Row style={{ marginBottom: 10 }}>
          <Col md={9}>
            <Form layout="inline" name="searchForm" initialValues={{ query }}>
              <Form.Item name="query">
                <Input
                  placeholder="Search"
                  value={query}
                  onChange={this.handleSearch}
                  allowClear
                />
              </Form.Item>
            </Form>
          </Col>
          <Col md={15} style={{ display: "flex", justifyContent: "end" }}>
            <Space direction="vertical" size={12}>
              <RangePicker />
            </Space>
          </Col>
        </Row>

        <InvoicesList invoices={invoices} isLoading={isLoading} />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  invoices: state.invoiceReducer.invoices,
  isLoading: state.commonReducer.isLoading,
});

const mapDispatchToProps = {
  getInvoices,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListInvoices));
