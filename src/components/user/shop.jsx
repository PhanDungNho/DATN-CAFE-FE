import React, { useState } from "react";
import { Row, Col, Card, Button, Pagination, Breadcrumb, Layout, Menu, Select, Slider } from "antd";
import { ShoppingCartOutlined, ShopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom"; // Import Link để sử dụng điều hướng
import Header from "./Header";
import Footer from "./Footer";

const { Content } = Layout;
const { Option } = Select;

function Shop() {
  const products = [
    { id: 1, category: "Strawberry", name: "Strawberry", price: 85, img: "assets/img/products/product-img-1.jpg" },
    { id: 2, category: "Berry", name: "Berry", price: 70, img: "assets/img/products/product-img-2.jpg" },
    { id: 3, category: "Lemon", name: "Lemon", price: 35, img: "assets/img/products/product-img-3.jpg" },
    { id: 4, category: "Avocado", name: "Avocado", price: 50, img: "assets/img/products/product-img-4.jpg" },
    { id: 5, category: "Green Apple", name: "Green Apple", price: 45, img: "assets/img/products/product-img-5.jpg" },
    { id: 6, category: "Cafe đen đá không đường", name: "Cafe", price: 80, img: "assets/img/products/product-img-6.jpg" },
  ];

  const categories = ["All", "Cafe đen đá không đường", "Berry", "Lemon", "Avocado", "Green Apple"];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortOrder, setSortOrder] = useState(null);

  const filteredProducts = products
    .filter((product) => (selectedCategory === "All" ? true : product.category === selectedCategory))
    .filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

  const sortedProducts = sortOrder
    ? [...filteredProducts].sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price))
    : filteredProducts;

  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <Header />
      <Content>
        <div className="hero-area hero-bg">
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

        <Breadcrumb style={{ marginBottom: "0px", textAlign: "left", fontSize: "18px", marginLeft: "200px" }}>
          <Breadcrumb.Item href="/">
            <ShopOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <ShoppingCartOutlined /> Sản Phẩm
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="product-section" style={{ padding: "50px 0" }}>
          <div className="container">
            <Row gutter={[16, 16]}>
              {/* Danh mục sản phẩm (bên trái) */}
              <Col xs={24} md={4}>
                <div style={{ padding: "20px", marginTop: "0px", border: "1px solid #e8e8e8", borderRadius: "4px", background: "#fff" }}>
                  <h4>Categories</h4>
                  <Menu
                    mode="inline"
                    selectedKeys={[selectedCategory]}
                    onClick={(e) => handleCategoryChange(e.key)}
                  >
                    {categories.map((category) => (
                      <Menu.Item key={category}>{category}</Menu.Item>
                    ))}
                  </Menu>
                </div>
              </Col>

              {/* Hiển thị sản phẩm (giữa) */}
              <Col xs={24} md={14}>
                <Row gutter={[16, 16]}>
                  {paginatedProducts.map((product) => (
                    <Col key={product.id} xs={24} sm={12} md={12} lg={8} style={{ textAlign: "center" }}>
                      <Link to={`/single-product`}>
                        <Card
                          hoverable
                          style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s',
                          }}
                          cover={<img alt={product.name} src={product.img} style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                          <Card.Meta
                            title={<span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{product.name}</span>}
                            description={
                              <div>
                                <span style={{ fontSize: '1.2rem', color: '#888' }}>Per Kg - </span>
                                <span style={{ fontSize: '1.5rem', color: '#ff4d4f' }}>${product.price}</span>
                              </div>
                            }
                          />
                          <Button 
                            type="primary" 
                            icon={<ShoppingCartOutlined />} 
                            style={{
                              width: '100%',
                              marginTop: '10px',
                              backgroundColor: '#F28123', 
                              borderColor: '#ff4d4f'
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>

                <Row justify="end" style={{ marginTop: 20 }}>
                  <Select
                    defaultValue={pageSize}
                    style={{ width: 120 }}
                    onChange={(value) => handlePageSizeChange(currentPage, value)}
                  >
                    <Option value={6}>6 / page</Option>
                    <Option value={12}>12 / page</Option>
                  </Select>
                </Row>

                <Row justify="center" style={{ marginTop: 50 }}>
                  <Pagination
                    current={currentPage}
                    total={filteredProducts.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                  />
                </Row>
              </Col>

              {/* Bộ lọc và sắp xếp (bên phải) */}
              <Col xs={24} md={6}>
                {/* Lọc theo giá */}
                <div style={{ padding: "20px", marginTop: "0px", border: "1px solid #e8e8e8", borderRadius: "4px", background: "#fff" }}>
                  <h4>Filter by Price</h4>
                  <Slider
                    range
                    min={0}
                    max={100}
                    value={priceRange}
                    onChange={handlePriceChange}
                    tipFormatter={(value) => `$${value}`} // Hiển thị giá trên tooltip
                    handleStyle={[{ borderColor: "#f28123" }, { borderColor: "#f28123" }]} // Đổi màu tay cầm
                    trackStyle={[{ backgroundColor: "#f28123" }]} // Đổi màu track
                    railStyle={{ backgroundColor: "#ddd" }} // Đổi màu đường ray
                    style={{ width: "100%" }}  
                  />
                  <p>
                    Price: ${priceRange[0]} - ${priceRange[1]}
                  </p>
                </div>

                {/* Sắp xếp theo giá */}
                <div style={{ padding: "20px", marginTop: "20px", border: "1px solid #e8e8e8", borderRadius: "4px", background: "#fff" }}>
                  <h4>Sort by Price</h4>
                  <Select style={{ width: "100%" }} onChange={handleSortChange}>
                    <Option value="asc">Price: Low to High</Option>
                    <Option value="desc">Price: High to Low</Option>
                  </Select>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Shop;
