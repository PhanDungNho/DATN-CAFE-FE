import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import withRouter from "../../../helpers/withRouter";
import {
  findProductVariantByNameContainsIgnoreCase,
  getProductVariant,
  getProductVariants,
  updateProductVariantActive,
} from "../../../redux/actions/productVariantAction";
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
      query: "",
    };

    this.timeout = null;
  }

  componentDidMount = () => {
    this.props.getProductVariants();
    console.log("did mount products");
  };

  editProductVariant = (productVariant) => {
    console.log(productVariant);
    const { navigate } = this.props.router;

    navigate("/admin/productvariants/update/" + productVariant.id);
  };

  handleSearch = (value) => {
    const query = value.target.value;
    this.setState({ query });

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (query) {
        this.props.findProductVariantByNameContainsIgnoreCase(query);
      } else {
        this.props.getProductVariants();
      }
    }, 1500);
  };

  render() {
    const { productVariant, productVariants, router, isLoading } = this.props;
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
                  onChange={this.handleSearch}
                  allowClear
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <ProductVariantList
          editProductVariant={this.editProductVariant}
          productVariants={productVariants}
          productVariant={productVariant}
          router={router}
          updateProductVariantActive={this.props.updateProductVariantActive}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  productVariant: state.productVariantReducer.productVariant,
  productVariants: state.productVariantReducer.productVariants,
  isLoading: state.commonReducer.isLoading,
});

const mapDispatchToProps = {
  getProductVariants,
  getProductVariant,
  findProductVariantByNameContainsIgnoreCase,
  updateProductVariantActive,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListProductVariant));
