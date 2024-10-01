import React, { useState } from 'react';
import { Layout, Row, Col, Input, Button, Card, message, Form, InputNumber, Tabs } from 'antd';
import { ShoppingCartOutlined, PlusOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const products = [
  { key: '1', name: 'Cà phê đen', price: 30000, imageUrl: 'https://example.com/coffee-black.jpg' },
  { key: '2', name: 'Cà phê sữa', price: 35000, imageUrl: 'https://example.com/coffee-milk.jpg' },
  { key: '3', name: 'Bạc sỉu', price: 40000, imageUrl: 'https://example.com/bacsiu.jpg' },
  { key: '4', name: 'Trà đào cam sả', price: 45000, imageUrl: 'https://example.com/peach-tea.jpg' },
];

const SaleInterface = () => {
  const [customers, setCustomers] = useState([{ cart: [], customerName: 'Khách hàng 1' }]);
  const [activeTab, setActiveTab] = useState('0'); // Tab đầu tiên là khách hàng 1

  const handleAddToCart = (product, index) => {
    const newCustomers = [...customers];
    newCustomers[index].cart = [...newCustomers[index].cart, product];
    setCustomers(newCustomers);
    message.success(`${product.name} đã được thêm vào giỏ hàng của ${newCustomers[index].customerName}!`);
  };

  const handleSearch = (value) => {
    console.log('Tìm kiếm:', value);
  };

  const handleFinish = (values, index) => {
    console.log('Thông tin thanh toán cho', customers[index].customerName, ':', values);
    message.success(`Thanh toán thành công cho ${customers[index].customerName}!`);
  };

  const addNewCustomer = () => {
    setCustomers([...customers, { cart: [], customerName: `Khách hàng ${customers.length + 1}` }]);
    setActiveTab(`${customers.length}`); // Chuyển đến tab mới
  };

  return (
    <Layout>
      <Header style={{ color: 'white', fontSize: '20px' }}>Giao diện bán hàng</Header>
      <Content style={{ padding: '20px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={<Button icon={<PlusOutlined />} onClick={addNewCustomer}>Thêm khách hàng</Button>}
        >
          {customers.map((customer, index) => (
            <Tabs.TabPane tab={customer.customerName} key={index.toString()}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                  <Search
                    placeholder="Tìm kiếm sản phẩm"
                    enterButton="Tìm kiếm"
                    size="large"
                    onSearch={handleSearch}
                    style={{ marginBottom: '20px' }}
                  />
                  <Row gutter={[16, 16]}>
                    {products.map((product) => (
                      <Col xs={24} sm={12} md={12} lg={8} key={product.key}>
                        <Card
                          hoverable
                          cover={<img alt={product.name} src={product.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />}
                          actions={[
                            <Button type="primary" onClick={() => handleAddToCart(product, index)}>Thêm vào giỏ</Button>,
                          ]}
                        >
                          <Card.Meta title={product.name} description={`${product.price.toLocaleString()} đ`} />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col xs={24} md={8}>
                  <Card title={`Giỏ hàng của ${customer.customerName}`} extra={<ShoppingCartOutlined />}>
                    {customer.cart.length === 0 ? (
                      <p>Giỏ hàng trống</p>
                    ) : (
                      customer.cart.map((item, itemIndex) => (
                        <p key={itemIndex}>
                          {item.name} - {item.price.toLocaleString()} đ
                        </p>
                      ))
                    )}
                    <Button type="primary" block style={{ marginTop: '10px', marginBottom: '20px' }}>
                      Thanh toán
                    </Button>

                    {/* Form thanh toán */}
                    <Form layout="vertical" onFinish={(values) => handleFinish(values, index)}>
                      <Form.Item
                        label="Tên khách hàng"
                        name="customerName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                      >
                        <Input placeholder="Tên khách hàng" />
                      </Form.Item>
                      <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                      >
                        <Input placeholder="Số điện thoại" />
                      </Form.Item>
                      <Form.Item
                        label="Số tiền thanh toán"
                        name="paymentAmount"
                        rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="Số tiền thanh toán"
                          formatter={(value) => `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" block>
                        Xác nhận thanh toán
                      </Button>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Giao diện bán hàng ©2024</Footer>
    </Layout>
  );
};

export default SaleInterface;
