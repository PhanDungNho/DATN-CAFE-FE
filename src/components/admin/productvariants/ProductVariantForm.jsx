import { Button, Col, Form, Input, InputNumber, message, Row, Select } from "antd";
import React, { Component } from "react";
import PropTypes from "prop-types";
import SizeService from "../../../services/sizeService";
import ProductService from "../../../services/productService";

export class ProductVariantForm extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      sizes: [],
      products: [],
      productVariant: {
        id: "",
        price: 0,
        active: true,
        size: {},
        product: {},
      },
    };
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props.router.params;
    const { id: prevId } = prevProps.router.params;

    if (prevId && !id) {
      this.resetForm();
    }
  }

  handleSubmit = (values) => {
    this.props.onSubmitForm(values);
  };

  async loadData() {
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
      console.error(error);
      message.error("Error: " + error.message);
    }
  }

  resetForm = () => {
    this.formRef.current.resetFields();
    this.props.clearProductVariantState();

    const { navigate } = this.props.router;
    navigate("/admin/productvariants/add");
  };

  componentWillUnmount = () => {
    this.props.clearProductVariantState();
    console.log("Component will unmount");
  };

  async onSearch(value) {
    const service = new ProductService();
    try {
      const response = await service.findProductByNameContainsIgnoreCase(value);

      if (response.status === 200) {
        return response.data.map((item) => (
          <Select.Option value={item.id} key={item.id}>
            {item.name}
          </Select.Option>
        ));
      }
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.loadData();
  }

  renderSizeOptions() {
    return this.state.sizes.map((item) => (
      <Select.Option value={item.id} key={item.id}>
        {item.name}
      </Select.Option>
    ));
  }

  renderProductOptions() {
    return this.state.products.map((item) => (
      <Select.Option value={item.id} key={item.id}>
        {item.name}
      </Select.Option>
    ));
  }

  render() {
    const { productVariant } = this.props;

    return (
      <Form
        ref={this.formRef}
        className="form"
        size="middle"
        layout="vertical"
        onFinish={this.handleSubmit}
        initialValues={{
          id: productVariant.id || "",
          sizeid: productVariant.size?.id,
          productid: productVariant.product?.id,
          active: productVariant.active ?? true,
          price: productVariant.price || 0,
        }}
      >
        <Row gutter={24}>
          <Col md={12}>
            <Form.Item label="Product Id" name="id">
              <Input readOnly />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true }]}
              hasFeedback
            >
              <InputNumber
                min={0}
                addonBefore={"VND"}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/$\s?|(,*)/g, "")}
                style={{ width: "100%" }}
              ></InputNumber>
            </Form.Item>

            <Form.Item
              label="Size"
              name="sizeid"
              rules={[{ required: true, message: "Please select a size!" }]}
              hasFeedback
            >
              <Select placeholder="Select Size">
                {this.renderSizeOptions()}
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
                <Select.Option value={false}>Invisible</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Product Name"
              name="productid"
              rules={[{ required: true, message: "Please select a product!" }]}
              hasFeedback
            >
              <Select
                showSearch
                optionFilterProp="children"
                onSearch={(value) => this.onSearch(value)}
                placeholder="Select product"
              >
                {this.renderProductOptions()}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Row justify="end">
              <Col>
                {!productVariant.id ? (
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

ProductVariantForm.propTypes = {
  productVariant: PropTypes.object.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
  clearProductVariantState: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
};

export default ProductVariantForm;
