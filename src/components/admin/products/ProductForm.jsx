import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, Form, Input, Row, Select, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import UploadImage from "./UploadImage";
import { MdOutlineCategory } from "react-icons/md";
import ProductService from "../../../services/productService";

export class ProductForm extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      images: props.product.images || [],
    };
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props.router.params;
    const { id: prevId } = prevProps.router.params;

    if (prevId && !id) {
      this.formRef.current.resetFields();
      this.setState({
        product: {
          id: "",
          name: "",
          active: true,
          category: {},
          description: "",
          images: [],
          url: "",
        },
        updatedProductImages: {},
      });
    }
  }

  handleSubmit = (values) => {
    this.props.onSubmitForm(values);
  };

  renderCategoryOptions = () => {
    return this.props.categories.map((item) => (
      <Select.Option value={item.id} key={item.id}>
        {item.name}
      </Select.Option>
    ));
  };

  resetForm = () => {
    this.formRef.current.resetFields();
    this.setState({
      images: [],
    });
    this.props.clearProductState();

    const { navigate } = this.props.router;
    navigate("/admin/products/add");
  };

  componentWillUnmount = () => {
    this.props.clearProductState();
    console.log("Component will unmount");
  };

  render() {
    const { product = {}, onDeleteProductImage } = this.props;

    return (
      <Form
        ref={this.formRef}
        className="form"
        size="middle"
        layout="vertical"
        onFinish={this.handleSubmit}
        initialValues={{
          id: product.id || "",
          name: product.name || "",
          categoryid: product.category ? product.category.id : undefined,
          active: product.active !== undefined ? product.active : true,
          description: product.description || "",
          images: this.props.product.images || [],
        }}
      >
        <Row gutter={24}>
          <Col md={12}>
            <Form.Item label="Product Id" name="id">
              <Input readOnly />
            </Form.Item>

            <Form.Item
              label="Product Name"
              name="name"
              rules={[
                {
                  required: true,
                  min: 2,
                  message: "Please enter a valid product name!",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="categoryid"
              rules={[{ required: true, message: "Please select a category!" }]}
              hasFeedback
            >
              <Select
                placeholder="Select Category"
                suffixIcon={<MdOutlineCategory />}
              >
                {this.renderCategoryOptions()}
              </Select>
            </Form.Item>
          </Col>

          <Col md={12}>
            <Form.Item
              label="Active"
              name="active"
              rules={[
                { required: true, message: "Please select the active status" },
              ]}
            >
              <Select>
                <Select.Option value={true}>Visible</Select.Option>
                <Select.Option value={false}>In-Visible</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea
                rows={4}
                style={{ minHeight: "120px" }}
                placeholder="Enter description"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Col>
            <UploadImage
              onUpdateFileList={this.props.onUpdateFileList}
              onDeleteProductImage={onDeleteProductImage}
              fileList={this.state.images.map((image) => ({
                uid: image.id || image.url,
                name: image.filename || image.url.split("/").pop(),
                status: "done",
                url: ProductService.getProductImageUrl(image.url),
                originFileObj: null,
              }))}
            ></UploadImage>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Row justify="end" style={{ paddingTop: 135 }}>
              <Col>
                {!product.id ? (
                  <Button type="primary" htmlType="submit">
                    Thêm sản phẩm
                  </Button>
                ) : (
                  <>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ marginRight: 10 }}
                    >
                      Cập nhật
                    </Button>
                    <Button type="default" onClick={this.resetForm}>
                      Reset
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}

ProductForm.propTypes = {
  product: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
  onUpdateFileList: PropTypes.func.isRequired,
  onDeleteProductImage: PropTypes.func.isRequired,
};

export default ProductForm;
