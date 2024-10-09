// Cart.jsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Breadcrumb,
  Table,
  InputNumber,
  Button,
  Row,
  Col,
  Image,
  Typography,
  Divider,
  message,
  Card,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import Header from "./Header";
import Footer from "./Footer";

const { Content } = Layout;
const { Title } = Typography;

const Cart = () => {
  // Dữ liệu mẫu cho giỏ hàng với các khóa (key) duy nhất
  const [cartItems, setCartItems] = useState([
    {
      key: "1",
      image: "assets/img/products/product-img-1.jpg",
      name: "Cafe sữa",
      price: 15000,
      quantity: 1,
      total: 15000,
    },
    {
      key: "2",
      image: "assets/img/products/product-img-2.jpg",
      name: "Cafe đen",
      price: 10000,
      quantity: 1,
      total: 10000,
    },
    {
      key: "3",
      image: "assets/img/products/product-img-3.jpg",
      name: "Lipton sữa",
      price: 20000,
      quantity: 1,
      total: 20000,
    },
    {
      key: "4",
      image: "assets/img/products/product-img-4.jpg",
      name: "Cafe đặc biệt",
      price: 25000,
      quantity: 1,
      total: 25000,
    },
    // Thêm các sản phẩm khác với key duy nhất
  ]);

  // State for selected row keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // State for total calculations
  const [totalCart, setTotalCart] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const shippingFee = 15000;

  // Effect to recalculate totals whenever selectedRowKeys or cartItems change
  useEffect(() => {
    const selectedItems = cartItems.filter((item) =>
      selectedRowKeys.includes(item.key)
    );
    const newTotalCart = selectedItems.reduce((acc, item) => acc + item.total, 0);
    const newGrandTotal = newTotalCart > 0 ? newTotalCart + shippingFee : 0;
    setTotalCart(newTotalCart);
    setGrandTotal(newGrandTotal);
  }, [selectedRowKeys, cartItems]);

  // Hàm xử lý khi thay đổi số lượng
  const handleQuantityChange = (value, key) => {
    const newCart = cartItems.map((item) => {
      if (item.key === key) {
        const newTotal = value * item.price;
        return { ...item, quantity: value, total: newTotal };
      }
      return item;
    });
    setCartItems(newCart);
  };

  // Hàm xử lý xóa sản phẩm
  const handleRemove = (key) => {
    const newCart = cartItems.filter((item) => item.key !== key);
    setCartItems(newCart);
    message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    // Also remove from selected if it was selected
    setSelectedRowKeys((prevKeys) => prevKeys.filter((k) => k !== key));
  };

  // Hàm xử lý khi chọn các sản phẩm
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  // Cột cho bảng giỏ hàng
  const columns = [
    {
      title: "",
      dataIndex: "remove",
      key: "remove",
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record.key)}
          danger
        />
      ),
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: "image",
      key: "image",
      render: (text) => <Image width={50} src={text} alt="product" />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(value, record.key)}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => `${total.toLocaleString()} VNĐ`,
    },
  ];

  // Hàm xử lý thanh toán
  const handleCheckout = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn sản phẩm để thanh toán.");
      return;
    }
    // Implement your checkout logic here
    message.success("Đã thực hiện thanh toán thành công!");
    // Optionally, remove purchased items from cart
    const remainingItems = cartItems.filter(
      (item) => !selectedRowKeys.includes(item.key)
    );
    setCartItems(remainingItems);
    setSelectedRowKeys([]);
  };

  // Hàm xử lý mua thêm
  const handleBuyMore = () => {
    // Implement navigation to the product listing page
    // For example, using react-router:
    // history.push('/products');
    message.info("Chuyển hướng đến trang sản phẩm...");
  };

  return (
    <Layout>
      <Header />
      {/* Hero Area */}
      <div className="hero-area hero-bg-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1 text-center">
              <div className="hero-text">
                <div className="hero-text-tablecell">
                  <h1>WELCOME TO WALACOFFEE</h1>
                  <p className="subtitle">Coffee &amp; Tea</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb Section */}
      <Content
        style={{
          padding: "50px",
          marginTop: "20px",
          background: "#f9f9f9",
          minHeight: "calc(100vh - 64px - 100px)", // Adjust minHeight based on Header and Footer heights
        }}
      >
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item href="/">
            <ShopOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <ShoppingCartOutlined /> Giỏ hàng
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={cartItems}
                pagination={{ pageSize: 5 }} // Sử dụng phân trang để giới hạn số lượng sản phẩm trên mỗi trang
                bordered={false}
                locale={{ emptyText: "Giỏ hàng của bạn trống" }}
                scroll={{ y: 400 }} // Tùy chọn: Thêm cuộn dọc nếu cần
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <div style={{ padding: "20px" }}>
                <Title level={4} style={{ fontSize: "16px", color: "#333" }}>
                  Tổng tiền giỏ hàng:{" "}
                  <span>{totalCart.toLocaleString()} VNĐ</span>
                </Title>
                <Title level={4} style={{ fontSize: "16px", color: "#333" }}>
                  Phí giao hàng:{" "}
                  <span>
                    {totalCart > 0
                      ? shippingFee.toLocaleString()
                      : "0 VNĐ"}
                  </span>
                </Title>
                <Divider />
                <Title level={3}>
                  Tổng tiền: {grandTotal.toLocaleString()} VNĐ
                </Title>
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    type="default"
                    style={{ width: "48%" }}
                    onClick={handleBuyMore}
                  >
                    Mua thêm
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: "48%" }}
                    onClick={handleCheckout}
                    disabled={selectedRowKeys.length === 0}
                  >
                    Thanh toán
                  </Button>
                </div>
                {selectedRowKeys.length > 0 && (
                  <div style={{ marginTop: "10px", color: "#888" }}>
                    Bạn đã chọn {selectedRowKeys.length} sản phẩm
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Cart;
