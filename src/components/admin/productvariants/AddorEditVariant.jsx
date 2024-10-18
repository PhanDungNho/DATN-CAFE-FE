import React, { Component } from "react";
import { connect } from "react-redux";
import withRouter from "../../../helpers/withRouter";
import { findProductNameContainsIgnoreCase } from "../../../redux/actions/productAction";
import {
  getProductVariant,
  insertProductVariant,
} from "../../../redux/actions/productVariantAction";
import ProductService from "../../../services/productService";
import SizeService from "../../../services/sizeService";
import { message, Skeleton } from "antd";
import ContentHeader from "../common/ContentHeader";
import ProductVariantForm from "./ProductVariantForm";

export class AddorEditVariant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productVariant: {
        id: "",
        price: 0,
        active: true,
        product: {},
        size: {},
      },
      sizes: [],
      products: [],
    };

    this.formRef = React.createRef();
  }

  componentDidMount = () => {
    const { id } = this.props.router.params;
    if (id) {
      this.props.getProductVariant(id);
    }
    this.loadData();
  };

  loadData = async () => {
    try {
      const sizeService = new SizeService();
      const sizeListResp = await sizeService.getSizes();

      const productService = new ProductService();
      const productListResp = await productService.getProducts();

      this.setState({
        sizes: sizeListResp.data,
        products: productListResp.data,
      });
    } catch (error) {
      console.log(error);
      message.error("Error: " + error.message);
    }
  };

  onSubmitForm = (values) => {
    const { navigate } = this.props.router;
    const { id } = this.props.router.params;

    if (!id) {
      this.props.insertProductVariant(values);
      console.log("Insert product variant: ", values);
    } else {
      // this.props.updateProductVariant(id, values, navigate);
      console.log("Update product variant: ")
    }
  };

  render() {
    const { isLoading, router } = this.props;
    const { navigate } = this.props.router;
    const { sizes, products, productVariant } = this.state;

    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title={"Add Product Variants"}
            className="site-page-header"
          />
          <Skeleton active />
        </>
      );
    }

    return (
      <>
        <ContentHeader
          navigate={navigate}
          title={"Add Product Variants"}
          className="site-page-header"
        />

        <ProductVariantForm
          ref={this.formRef}
          products={products}
          sizes={sizes}
          router={router}
          productVariant={productVariant}
          onSubmitForm={this.onSubmitForm}
          findProductByNameContainsIgnoreCase={
            this.props.findProductNameContainsIgnoreCase
          }
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  productVariant: state.productVariantReducer.productVariant,
  isLoading: state.commonReducer.isLoading,
});

const mapDispatchToProps = {
  getProductVariant,
  insertProductVariant,
  findProductNameContainsIgnoreCase,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddorEditVariant));
