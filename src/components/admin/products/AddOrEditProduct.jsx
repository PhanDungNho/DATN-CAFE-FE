import React, { Component } from "react";
import { connect } from "react-redux";
import ContentHeader from "../common/ContentHeader";
import { message, Skeleton } from "antd";
import withRouter from "../../../helpers/withRouter";
import ProductForm from "./ProductForm";
import CategoryService from "../../../services/categoryService";
import {
  clearProductState,
  deleteProductImage,
  getProduct,
  insertProduct,
  updateProduct,
} from "../../../redux/actions/productAction";

class AddOrEditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
        id: "",
        name: "",
        active: true,
        category: {},
        description: "",
        images: [],
      },
      updatedProductImages: [],
      categories: [],
    };

    this.formRef = React.createRef();
    this.onUpdateFileList = this.onUpdateFileList.bind(this);
  }

  onSubmitForm = (values) => {
    const { navigate } = this.props.router;
    const { updatedProductImages } = this.state;

    const productData = {
      ...values,
      imageFiles: updatedProductImages.map((file) => file.originFileObj),
    };

    if (!productData.id) {
      this.props.insertProduct(productData, navigate);
      console.log("Insert product:", productData);
    } else {
      this.props.updateProduct(productData.id, productData, navigate);
      console.log("Updating product:", productData);
    }
  };

  componentDidMount = () => {
    const { id } = this.props.router.params;
    if (id) {
      this.props.getProduct(id);
    }
    this.loadData();
  };

  loadData = async () => {
    try {
      const categoryService = new CategoryService();
      const categoryListResponse = await categoryService.getCategories();
      this.setState({
        categories: categoryListResponse.data,
      });
    } catch (error) {
      console.log(error);
      message.error("Error: " + error);
    }
  };

  onUpdateFileList = (fileList) => {
    this.setState({
      updatedProductImages: fileList,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.product && prevState.product.id !== nextProps.product.id) {
      return {
        product: nextProps.product,
        updatedProductImages: nextProps.product.images || [],
      };
    }
    return null;
  }

  onDeleteProductImage = (info) => {
    this.props.deleteProductImage(info);
    console.log("Delete product: ", info);
  };

  componentWillUnmount = () => {
    this.props.clearProductState();
    console.log("Component will unmount");
  };

  render() {
    const { isLoading, router } = this.props;
    const { navigate } = this.props.router;
    const { categories, product } = this.state;

    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="Add Product"
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
          title="Add Product"
          className="site-page-header"
        />

        <ProductForm
          ref={this.formRef}
          product={product}
          categories={categories}
          router={router}
          onUpdateFileList={this.onUpdateFileList}
          onSubmitForm={this.onSubmitForm}
          onDeleteProductImage={this.onDeleteProductImage}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  product: state.productReducer.product,
  isLoading: state.commonReducer.isLoading,
});

const mapDispatchToProps = {
  insertProduct,
  updateProduct,
  getProduct,
  clearProductState,
  deleteProductImage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddOrEditProduct));
