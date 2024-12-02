import React, { Component } from "react";
import { connect } from "react-redux";
import ContentHeader from "../common/ContentHeader";
import { message, Skeleton } from "antd";
import withRouter from "../../../helpers/withRouter";
import ProductForm from "./ProductForm";
import CategoryService from "../../../services/categoryService";
import ToppingService from "../../../services/toppingService";
import SizeService from "../../../services/sizeService";
import {
  clearProductState,
  deleteProductImage,
  getProduct,
  insertProduct,
  updateProduct,
} from "../../../redux/actions/productAction";
import ProductService from "../../../services/productService";

class AddOrEditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
        id: "",
        name: "",
        active: true,
        category: {},
        productToppings: {},
        description: "",
        images: [],
      },
      updatedProductImages: [],
      categories: [],
      toppings: [],
      sizes: [],
      products: [],
    };

    this.formRef = React.createRef();
    this.onUpdateFileList = this.onUpdateFileList.bind(this);
  }

  onSubmitForm = (values) => {
    const { navigate } = this.props.router;
    const { updatedProductImages } = this.state;

    const productToppings = values.toppingId.map((id) => ({
      toppingId: id,
      productId: values.id || "",
    }));

    const productData = {
      ...values,
      imageFiles: updatedProductImages.map((file) => file.originFileObj),
      productToppings: productToppings,
    };

    if (updatedProductImages.length === 0) {
      message.error("Please upload at least one product image!");
      return;
    }

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

      const toppingService = new ToppingService();
      const toppingListResponse = await toppingService.getToppings();

      const sizeService = new SizeService();
      const sizeListResponse = await sizeService.getSizes();

      const productService = new ProductService();
      const productListResponse = await productService.getProducts();

      this.setState({
        categories: categoryListResponse.data,
        toppings: toppingListResponse.data,
        sizes: sizeListResponse.data,
        products: productListResponse.data,
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
    const { categories, product, toppings, sizes, productVariants, products } =
      this.state;
    let title = "Add Product";

    if (product.id) {
      title = "Update Product";
    }

    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title={title}
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
          title={title}
          className="site-page-header"
        />
        <ProductForm
          key={product.id + product.name}
          ref={this.formRef}
          product={product}
          categories={categories}
          toppings={toppings}
          sizes={sizes}
          productVariants={productVariants}
          products={products}
          router={router}
          onUpdateFileList={this.onUpdateFileList}
          onSubmitForm={this.onSubmitForm}
          onDeleteProductImage={this.onDeleteProductImage}
          clearProductState={this.props.clearProductState}
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
