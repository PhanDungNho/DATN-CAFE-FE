import React, { useState } from "react";
import { Col, Card, Row, Select, InputNumber, Button, Collapse } from "antd";
import ProductService from "../../../services/productService";

const { Option } = Select;
const { Panel } = Collapse;
const ProductItem = ({
  products,
  selectedVariants,
  handleSelectVariant,
  handleToppingChange,
  handleAddToCart,
  selectedToppings,
}) => {
  // State để lưu trữ danh mục đã chọn và trạng thái mở/đóng toppings
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedToppings, setExpandedToppings] = useState({}); // Lưu trạng thái mở/đóng cho từng sản phẩm

  // Lấy danh sách các category duy nhất từ sản phẩm
  const categories = [
    ...new Set(products.map((product) => product.category.name)),
  ];

  // Lọc sản phẩm theo danh mục đã chọn
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category.name === selectedCategory)
    : products;

  // Hàm để toggle trạng thái mở/đóng của topping
  const toggleToppings = (productId) => {
    setExpandedToppings((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div>
      {/* Nút để chọn danh mục */}
      <div style={{ marginBottom: "16px" }}>
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{ marginRight: "8px" }}
          >
            {category}
          </Button>
        ))}
        <Button onClick={() => setSelectedCategory(null)}>All</Button>
      </div>

      <Row gutter={[16, 16]}>
        <style>
          {`
            .ant-table-cell {
              padding: 16px 8px !important;
            }
            .ant-card-body {
              padding: 12px !important;
            }
            :where(.css-dev-only-do-not-override-14qglws).ant-input-number-outlined {
              width: 4rem !important;
            }
            :where(.css-dev-only-do-not-override-14qglws).ant-layout, 
            :where(.css-dev-only-do-not-override-14qglws).ant-layout * {
              vertical-align: top;
            }
            :where(.css-dev-only-do-not-override-14qglws).ant-table-wrapper 
            .ant-table-thead > tr > th, 
            :where(.css-dev-only-do-not-override-14qglws).ant-table-wrapper 
            .ant-table-thead > tr > td {
              align-content: center;
            }
           :where(.css-dev-only-do-not-override-11lehqq).ant-input-number {
           width: 3.2rem !important;
          `}
        </style>
        {filteredProducts
          .filter((product) => product.productVariants.length > 0)
          .map((product) => (
            <Col xs={24} sm={12} md={12} lg={8} key={product.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={ProductService.getProductImageUrl(
                      product.images[0].fileName
                    )}
                    style={{ objectFit: "cover" }}
                  />
                }
              >
                <Card.Meta title={product.name} />
                <Row gutter={[8, 8]} style={{ marginTop: "10px" }}>
                  <Col span={24}>
                    <Select
                      id="sizeSelect"
                      style={{ width: "100%" }}
                      value={selectedVariants[product.id]}
                      onChange={(value) =>
                        handleSelectVariant(product.id, value)
                      }
                    >
                      {product.productVariants.map((variant) => (
                        <Option value={variant.id} key={variant.id}>
                          Size {variant.size.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>

                  <Col span={24}>
                    <p>
                      {selectedVariants[product.id]
                        ? `${product.productVariants
                            .find(
                              (variant) =>
                                variant.id === selectedVariants[product.id]
                            )
                            .price.toLocaleString()}`
                        : "Select size to see price"}
                    </p>
                  </Col>

                  <Col span={24}>
                    <Collapse style={{backgroundColor:"white",}} bordered={false}>
                      <style>
                        {`
:where(.css-dev-only-do-not-override-11lehqq).ant-collapse>.ant-collapse-item >.ant-collapse-header {
                  padding: 8px 0px;
                // background-color:red
}
                  :where(.css-dev-only-do-not-override-11lehqq).ant-collapse .ant-collapse-content>.ant-collapse-content-box {
                  padding: 0      
                  }
                  .ant-row css-dev-only-do-not-override-11lehqq {
                  padding: 0}
`}
                      </style>
                      <Panel
                      header="Choose toppings"
                      key="1"
                      style={{
                        fontWeight: "bold",
                        opacity: product.productToppings.length === 0 ? 0 : 1,
                        pointerEvents: product.productToppings.length === 0 ? "none" : "auto", // Ngăn tương tác nếu không có topping
                      }}
                    >
                    
                        {product.productToppings.map((topping) => (
                          <Row
                            key={topping.topping.id}
                            style={{
                              alignItems: "center",
                           fontWeight:"normal",
                              
                              // marginBottom: "8px",
                             padding: "2px 11px",
                            }}
                          >
                            <Col span={18}>
                              <span>{topping.topping.name}</span>
                            </Col>
                            <Col span={6}>
                              <InputNumber
                                min={0}
                                value={
                                  selectedToppings[product.id]?.[
                                    topping.topping.id
                                  ] || 0
                                }
                                onChange={(value) =>
                                  handleToppingChange(
                                    product.id,
                                    topping.topping.id,
                                    value
                                  )
                                }
                              />
                            </Col>
                          </Row>
                        ))}
                      </Panel>
                    </Collapse>
                  </Col>

                  {/* Hiển thị topping chỉ khi expanded */}
                  {expandedToppings[product.id] && (
                    <Col span={24}>
                      {product.productToppings.map((topping) => (
                        <Row
                          key={topping.topping.id}
                          style={{
                            alignItems: "center",
                            marginBottom: "8px",
                            padding: "2px 11px",
                          }}
                        >
                          <Col span={18}>
                            <span>{topping.topping.name}</span>
                          </Col>
                          <Col span={6}>
                            <InputNumber
                              min={0}
                              value={
                                selectedToppings[product.id]?.[
                                  topping.topping.id
                                ] || 0
                              }
                              onChange={(value) =>
                                handleToppingChange(
                                  product.id,
                                  topping.topping.id,
                                  value
                                )
                              }
                            />
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  )}

                  <Col span={24}>
                    <Button
                      type="primary"
                      onClick={() =>
                        handleAddToCart(
                          selectedVariants[product.id],
                          product.id
                        )
                      }
                      disabled={!selectedVariants[product.id]}
                    >
                      Add
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default ProductItem;
