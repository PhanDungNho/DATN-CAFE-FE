import React, { Component } from "react";
import { connect } from "react-redux";
import ContentHeader from "../common/ContentHeader";
import { DatePicker, Col, Form, Input, Row, Skeleton, Space } from "antd";
import withRouter from "../../../helpers/withRouter";
import {
  getInvoices,
  getInvoicesByDate,
  updateOrder,
  updateOrderActive,
} from "../../../redux/actions/invoiceAction";
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
      query: "",
      dateRange: [],
    };
    this.timeout = null;
  }

  componentDidMount = () => {
    this.props.getInvoices();
    console.log("did mount invoices");
  };

  handleDateRangeChange = (dates, dateStrings) => {
    if (dates) {
      const [startDate, endDate] = dateStrings;
      this.setState({ dateRange: dates });
      this.props.getInvoicesByDate(startDate, endDate);
    } else {
      this.setState({ dateRange: [] });
      this.props.getInvoices();
    }
  };

  render() {
    const { invoices, invoice, isLoading } = this.props;
    const { navigate } = this.props.router;
    const { query, dateRange } = this.state;
    const { RangePicker } = DatePicker;

    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="List Orders"
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
              <RangePicker
                value={dateRange}
                onChange={this.handleDateRangeChange}
              />
            </Space>
          </Col>
        </Row>

        <InvoicesList
          updateOrderActive={this.props.updateOrderActive}
          invoices={invoices}
          isLoading={isLoading}
          updateOrder={this.props.updateOrder}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  invoices: state.invoiceReducer.invoices,
  invoice: state.invoiceReducer.invoice,
  isLoading: state.commonReducer.isLoading,
});

const mapDispatchToProps = {
  getInvoices,
  getInvoicesByDate,
  updateOrderActive,
  updateOrder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListInvoices));
