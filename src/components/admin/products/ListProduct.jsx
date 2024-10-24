import React, { Component } from "react";
import { connect } from "react-redux";
import ProductList from "./ProductList";
import {
  clearProductState,
  findProductNameContainsIgnoreCase,
  getProduct,
  getProducts,
  updateProductActive,
} from "../../../redux/actions/productAction";
import withRouter from "../../../helpers/withRouter";
import ContentHeader from "../common/ContentHeader";
import { Col, Form, Input, Row, Skeleton } from "antd";

export class ListProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: { id: "", name: "", active: true, description: "", images: [] },
      open: false,
      query: "",
    };

    this.timeout = null;
  }

  componentDidMount = () => {
    this.props.getProducts();
    console.log("did mount products");
  };

  componentWillUnmount() {
    this.props.clearProductState();
    console.log("Component will unmount");
  }

  editProduct = (product) => {
    console.log("Xin chào dũng nhớ nha: ", product);

    const { navigate } = this.props.router;

    navigate("/admin/products/update/" + product.id);
  };

  handleSearch = (value) => {
    const query = value.target.value;
    this.setState({ query });

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (query) {
        this.props.findProductNameContainsIgnoreCase(query);
      } else {
        this.props.getProducts();
      }
    }, 1500);
  };

  render() {
    const { products, getProducts, router, isLoading } = this.props;
    const { query } = this.state;
    const { navigate } = this.props.router;

    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="List Products"
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
          title="List Products"
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

        <ProductList
          editProduct={this.editProduct}
          products={products}
          getProducts={getProducts}
          router={router}
          updateProductActive={this.props.updateProductActive}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  product: state.productReducer.product,
  products: state.productReducer.products,
  isLoading: state.commonReducer.isLoading,
});

const mapDispatchToProps = {
  getProducts,
  getProduct,
  updateProductActive,
  clearProductState,
  findProductNameContainsIgnoreCase,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListProduct));
