import React, { Component } from "react";
import ProductList from "./ProductList";
import { connect } from "react-redux";
import { getProducts, getProduct } from "../../../redux/actions/productAction";
import withRouter from "../../../helpers/withRouter";

class ListProduct extends Component {
  componentDidMount = () => {
    this.props.getProducts();
    console.log("did mount products");
  };

  render() {
    const { products, getProducts, getProduct, router } = this.props; // Include router here
    return (
      <>
        <ProductList
          products={products}
          getProducts={getProducts}
          getProduct={getProduct}
          onDeleteConfirm={this.onDeleteConfirm}
          onEdit={this.onEdit}
          router={router} 
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.productReducer.products,
});

const mapDispatchToProps = {
  getProducts,
  getProduct,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListProduct));
