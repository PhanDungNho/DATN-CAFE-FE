import React from "react";
import { Col, Card, Row, Select, InputNumber, Button } from "antd";

const { Option } = Select;

const ProductItem = ({
  data,
  toppings,
  selectedVariants,
  handleSelectVariant,
  handleToppingChange,
  handleAddToCart,
  selectedToppings,
  setSelectedToppings,
}) => {
  return (
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

      {data
        .filter((product) => product.productVariants.length > 0)
        .map((product) => (
          <Col xs={24} sm={12} md={12} lg={8} key={product.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.name}
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSVaNcfHJpRnP89X8FTgG98XWXgvQcYld9xQ&s"
                  }
                  style={{    objectFit: "cover" }}
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
                    onChange={(value) => handleSelectVariant(product.id, value)}
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
                      : "Chọn kích thước để xem giá"}
                  </p>
                </Col>

                <Col span={24}>
                  {toppings.map((topping) => (
                    <Row
                      key={topping.id}
                      style={{
                        alignItems: "center",
                        marginBottom: "8px",
                        padding: "2px 11px",
                      }}
                    >
                      <Col span={18}>
                        <span>{topping.name}</span>
                      </Col>
                      <Col span={6}>
                        <InputNumber
                          min={0}
                          value={
                            selectedToppings[product.id]?.[topping.id] || 0
                          }
                          onChange={(value) =>
                            handleToppingChange(product.id, topping.id, value)
                          }
                        />
                      </Col>
                    </Row>
                  ))}
                </Col>

                <Col span={24}>
                  <Button
                    type="primary"
                    onClick={() =>
                      handleAddToCart(selectedVariants[product.id], product.id)
                    }
                    disabled={!selectedVariants[product.id]}
                  >
                    Thêm
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
    </Row>
  );
};

export default ProductItem;