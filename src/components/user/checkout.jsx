// Checkout.jsx
import React, { useState } from "react";
import {
  Layout,
  Breadcrumb,
  Form,
  Input,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  message,
} from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import Header from "./Header";
import Footer from "./Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const Checkout = () => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const onFinish = (values) => {
    console.log("Form Values:", values);
    message.success("Order successful!");
    // Implement your checkout logic here
  };

  return (
    <Layout>
      <Header />
      {/* Breadcrumb Section */}
      <div
        className="breadcrumb-section breadcrumb-bg"
        style={{
          background: "#f0f2f5",
          padding: "50px 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="breadcrumb-text">
                <Text type="secondary">Fresh and Organic</Text>
                <Title level={2}>Check Out Product</Title>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Section */}
      <Content
        style={{
          padding: "50px",
          background: "#f9f9f9",
          minHeight: "calc(100vh - 64px - 200px)", // Adjust based on Header and Footer
        }}
      >
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item href="/">
            <HomeOutlined /> Home page
          </Breadcrumb.Item>
          <Breadcrumb.Item  href="/cart">
            <ShoppingCartOutlined/> Shopping cart
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <CreditCardOutlined /> Pay
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[32, 32]}>
          {/* Billing Information */}
          <Col xs={24} lg={16}>
            <Card
              title="Customer information"
              bordered={false}
              style={{ background: "#fff" }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  payment: "cash",
                }}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="fullname"
                      label="Fullname"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your full name!",
                        },
                      ]}
                    >
                      <Input placeholder="Fullname" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]}
                    >
                      <Input placeholder="Email" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="address"
                      label="Address"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your address!",
                        },
                      ]}
                    >
                      <Input placeholder="Address" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Phone number"
                      rules={[
                        {
                          required: true,
                          pattern: /^[0-9]{10,11}$/,
                          message:
                            "Please enter a valid phone number (10-11 numbers)!",
                        },
                      ]}
                    >
                      <Input placeholder="Phone number" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Shipping Address Section */}
                <Card
                  title="Delivery address"
                  bordered={false}
                  style={{ background: "#fafafa", marginTop: "20px" }}
                >
                  <Text strong>Ấp kinh 9, Huyện Tân Hiệp Tỉnh, Kiên Giang</Text>
                  <br />
                </Card>

                {/* Payment Method */}
                <Card
                  title="Payment method"
                  bordered={false}
                  style={{ background: "#fafafa", marginTop: "20px" }}
                >
                  <Form.Item name="payment" label="Choose payment method">
                    <Radio.Group
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <Radio value="cash">Payment upon receipt</Radio>
                      <Radio value="vnpay">Pay with VNPay wallet</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Card>

                {/* Submit Button */}
                <Form.Item style={{ marginTop: "20px" }}>
                  <Button type="primary" htmlType="submit" block>
                  Pay                  
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col xs={24} lg={8}>
            <Card
              title="Order details"
              bordered={false}
              style={{ background: "#fff" }}
            >
              <div className="order-details">
                <Row justify="space-between" style={{ marginBottom: "10px" }}>
                  <Col span={4}>
                    <Text>Product</Text>
                  </Col>
                  <Col span={4}>
                    <Text>Quantity
                    </Text>
                  </Col>
                  <Col span={8}>
                    <Text>Price</Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "5px 0" }} />
                <Row justify="space-between" style={{ marginBottom: "10px" }}>
                  <Col span={4}>
                    <Text>Cafe đen adsdasdasdasdasds</Text>
                  </Col>
                  <Col span={1}>
                    <Text>2</Text>
                  </Col>
                  
                  <Col span={8}>
                    <Text>10.000 VNĐ</Text>
                  </Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: "10px" }}>
                <Col span={4}>
                    <Text>Cafe đen adsdasdasdasdasds</Text>
                  </Col>
                  <Col span={1}>
                    <Text>2</Text>
                  </Col>
                  
                  <Col span={8}>
                    <Text>10.000 VNĐ</Text>
                  </Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: "10px" }}>
                <Col span={4}>
                    <Text>Cafe đen adsdasdasdasdasds</Text>
                  </Col>
                  <Col span={1}>
                    <Text>2</Text>
                  </Col>
                  
                  <Col span={8}>
                    <Text>10.000 VNĐ</Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "10px 0" }} />
                <Row justify="space-between">
                  <Col span={12}>
                    <Text strong>Tổng cộng:</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>95.000 VNĐ</Text>
                  </Col>
                </Row>
                <Row justify="space-between">
                  <Col span={12}>
                    <Text strong>Phí ship:</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>15.000 VNĐ</Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "10px 0" }} />
                <Row justify="space-between">
                  <Col span={12}>
                    <Title level={4}>Tổng thành tiền:</Title>
                  </Col>
                  <Col span={12}>
                    <Title level={4}>110.000 VNĐ</Title>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Checkout;
