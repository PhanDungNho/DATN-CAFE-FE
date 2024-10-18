import React, { Component } from "react";
import { connect } from "react-redux";
import withRouter from "../../../helpers/withRouter";
import { getProductVariants } from "../../../redux/actions/productVariantAction";
import ContentHeader from "../common/ContentHeader";
import { Col, Form, Input, Row, Skeleton } from "antd";
import ProductVariantList from "./ProductVariantList";

export class ListProductVariant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productVariants: {
        id: "",
        price: "",
        active: true,
      },
    };

    this.timeout = null;
  }

  componentDidMount = () => {
    this.props.getProductVariants();
    console.log("did mount products");
  };

  render() {
    const { productVariants, router, isLoading } = this.props;
    const { query } = this.state;
    const { navigate } = this.props.router;

    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="List Product Variants"
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
          title="List Product Variants"
          className="site-page-header"
        ></ContentHeader>

        <Row style={{ marginBottom: 10 }}>
          <Col md={24}>
            <Form layout="inline" name="searchForm" initialValues={{ query }}>
              <Form.Item name="query">
                <Input
                  placeholder="Search"
                  value={query}
                  allowClear
                  onChange={(e) => this.setState({ query: e.target.value })}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <ProductVariantList
          //   editProduct={this.editProduct}
          productVariants={productVariants}
          router={router}
          updateProductActive={this.props.updateProductActive}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  productVariants: state.productVariantReducer.productVariants,
  isLoading: state.commonReducer.isLoading,
});

const mapDispatchToProps = {
  getProductVariants,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListProductVariant));
