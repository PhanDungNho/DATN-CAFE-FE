import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Layout, Menu, Select, Slider, Spin } from "antd";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, getProductsUser } from "../../redux/actions/productAction";
import { UnorderedListOutlined, StarFilled, HeartFilled } from '@ant-design/icons';
import ProductService from "../../services/productService";  // Import toàn bộ class ProductService
import Header from "./Header";
import Footer from "./Footer";

const { Content } = Layout;
const { Option } = Select;

function Shop() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productReducer.products);
  const isLoading = useSelector((state) => state.commonReducer.isLoading);
  const error = useSelector((state) => state.commonReducer.error);


  // Lấy danh sách danh mục từ sản phẩm
  const uniqueCategories = Array.from(new Set(products.map(product => product.category.name)));
  const categories = ["All", ...uniqueCategories];
  const menuItems = categories.map((category) => ({ key: category, label: category }));

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [priceRange, setPriceRange] = useState([0, 0]); // Khởi tạo với [0, 0]
  const [sortOrder, setSortOrder] = useState(null);
  const [maxPrice, setMaxPrice] = useState(100); // Giá trị mặc định nếu không có sản phẩm

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Tính toán giá trị tối đa khi sản phẩm được tải
  useEffect(() => {
    if (products.length > 0) {
      const allPrices = products.flatMap(p => p.productVariants.map(v => v.price));
      if (allPrices.length > 0) {
        const calculatedMaxPrice = Math.max(...allPrices);
        setMaxPrice(calculatedMaxPrice);
        setPriceRange([0, calculatedMaxPrice]); // Thiết lập giá trị mặc định cho priceRange
      }
    }
  }, [products]);

  // Điều chỉnh filter danh mục dựa trên product.category.name
  const filteredProducts = products
    .filter((product) => {
      if (!product.productVariants || product.productVariants.length === 0) return false; // Loại bỏ sản phẩm không có biến thể
      return selectedCategory === "All" || product.category.name === selectedCategory;
    })
    .filter((product) => {
      // Lấy giá thấp nhất và cao nhất từ các biến thể để áp dụng filter giá
      const prices = product.productVariants.map(variant => variant.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice >= priceRange[0] && maxPrice <= priceRange[1];
    });

  const sortedProducts = sortOrder
    ? [...filteredProducts].sort((a, b) => {
      const priceA = Math.min(...a.productVariants.map(v => v.price)) || 0;
      const priceB = Math.min(...b.productVariants.map(v => v.price)) || 0;
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    })
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

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return ProductService.getProductImageUrl(product.images[0].url);
    }
    return "default-image-url";
  };


  return (

    <Layout>
      <Header />
      <style>
        {`
    :where(.css-dev-only-do-not-override-11lehqq).ant-pagination .ant-pagination-item-active a {
    color: #ff8616;
}
    :where(.css-dev-only-do-not-override-11lehqq).ant-slider .ant-slider-handle::after {
    content: "";
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 10px;
    height: 10px;
    background-color: #ffffff;
    box-shadow: 0 0 0 2px #696969	;
    outline: 0px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: inset-inline-start 0.2s, inset-block-start 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, outline 0.2s;
}
    :where(.css-dev-only-do-not-override-11lehqq).ant-pagination .ant-pagination-item-active {
    font-weight: 600;
    background-color: #ffffff;
    border-color: #696969	 !important;
}
    :where(.css-dev-only-do-not-override-11lehqq).ant-pagination .ant-pagination-item-active a:hover {
    color: black;
}
    :where(.css-dev-only-do-not-override-11lehqq).ant-select-outlined:not(.ant-select-customize-input) .ant-select-selector {
    border: 1px solid #d9d9d9;
    background: #ffffff;
    border-color: #696969	 !important;
}
    :where(.css-dev-only-do-not-override-11lehqq).ant-slider:hover .ant-slider-handle::after {
     box-shadow: 0 0 0 2px #696969	;
}
    
  `}
      </style>
      <Content>
        <div className="hero-area hero-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 offset-lg-1 text-center">
                <div className="hero-text">
                  <div className="hero-text-tablecell">
                    <h1>WELCOME TO fsfd</h1>
                    <p className="subtitle">Coffee &amp; Tea</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className="product-section" style={{ padding: "50px 0" }}>
          <div className="container">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={4}>
                <div
                  style={{
                    padding: "20px",
                    marginTop: "0px",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                    background: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <h5 style={{ fontSize: "15px", color: "#333", fontWeight: "560" }}>
                    <UnorderedListOutlined /> Loại sản phẩm
                  </h5>
                  <Menu
                    mode="inline"
                    selectedKeys={[selectedCategory]}
                    onClick={(e) => handleCategoryChange(e.key)}
                    items={menuItems.map((item) => ({
                      ...item,
                      style: {
                        backgroundColor: selectedCategory === item.key ? "#F28123" : "transparent", // Set to orange if selected
                        color: selectedCategory === item.key ? "#fff" : "#333", // Change text color based on selection
                      },
                    }))}
                    style={{
                      border: "none",
                      background: "transparent",
                    }}
                  />
                </div>
              </Col>



              <Col xs={24} md={14}>
                {isLoading ? (
                  <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                  </div>
                ) : error ? (
                  <div style={{ textAlign: "center", padding: "50px 0", color: "red" }}>
                    {error}
                  </div>
                ) : (
                  <>
                    {paginatedProducts.length > 0 ? (
                      <Row gutter={[16, 16]}>
                        {paginatedProducts.map((product) => (

                          <Col key={product.slug} xs={24} sm={12} md={12} lg={8} style={{ textAlign: "center" }}>
                            <Link to={`/single-product/${product.slug}`}>

                              <Card
                                hoverable
                                style={{
                                  border: '1px solid #ddd',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  transition: 'transform 0.2s',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  height: '350px',
                                }}
                                cover={
                                  <img
                                    src={getProductImage(product)} // Ensure this function returns a valid image URL
                                    alt={product.name}
                                    style={{
                                      borderTopLeftRadius: '8px',
                                      borderTopRightRadius: '8px',
                                      height: '200px',
                                      width: '100%',
                                      objectFit: 'contain',
                                      maxHeight: '200px',
                                    }}
                                  />
                                }
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                              >
                                <Card.Meta
                                  title={
                                    <span
                                      title={product.name}
                                      style={{
                                        fontSize: '1.25rem',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        display: 'block',
                                        height: '40px',
                                        color: '#f28123',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      {product.name}
                                    </span>
                                  }
                                  description={
                                    <>
                                      <div style={{ height: '40px' }}>
                                        <span style={{ fontSize: '1rem', color: '#898' }}>
                                          {Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(
                                            Math.min(...product.productVariants.map(v => v.price))
                                          )} VNĐ
                                        </span>
                                      </div>
                                      {/* Icon ngôi sao và trái tim bên dưới giá */}
                                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <StarFilled style={{ color: '#fadb14', marginRight: '8px' }} />
                                          <StarFilled style={{ color: '#fadb14', marginRight: '8px' }} />
                                          <StarFilled style={{ color: '#fadb14', marginRight: '8px' }} />
                                          <StarFilled style={{ color: '#fadb14', marginRight: '8px' }} />
                                          <StarFilled style={{ color: '#fadb14' }} />
                                        </div>
                                        <HeartFilled style={{ color: '#ff4d4f' }} />
                                      </div>
                                    </>
                                  }
                                />
                              </Card>
                            </Link>

                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div style={{ textAlign: "center", padding: "50px 0", color: "#888" }}>
                        Không tìm thấy sản phẩm nào thỏa mãn.
                      </div>
                    )}


                    <Row justify="end" style={{ marginTop: 20 }}>
                      <Select
                        defaultValue={pageSize}
                        style={{ width: 120 }}
                        onChange={(value) => handlePageSizeChange(value)}
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
                        showSizeChanger={false}
                      />
                    </Row>
                  </>
                )}
              </Col>

              <Col xs={24} md={6}>
                <div style={{ padding: "20px", marginTop: "0px", border: "1px solid #e8e8e8", borderRadius: "4px", background: "#fff" }}>
                  <h4 style={{ fontSize: "15px", color: "#333", fontWeight: "560" }}>Lọc theo giá</h4>
                  <Slider
                    range
                    min={0}
                    max={maxPrice}
                    value={priceRange}
                    onChange={handlePriceChange}
                    tooltip={{
                      formatter: (value) => `${value.toLocaleString('vi-VN')} VNĐ`,
                    }}
                    handleStyle={[
                      { borderColor: "#f28123" },
                      { borderColor: "#f28123" },
                    ]}
                    trackStyle={[{ backgroundColor: "#f28123" }]}
                    railStyle={{ backgroundColor: "#ddd" }}
                    style={{ width: "100%" }}
                  />
                  <p>
                    Giá: {priceRange[0].toLocaleString('vi-VN')} VNĐ - {priceRange[1].toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>

                <div style={{ padding: "20px", marginTop: "20px", border: "1px solid #e8e8e8", borderRadius: "4px", background: "#fff" }}>
                  <h4 style={{ fontSize: "15px", color: "#333", fontWeight: "560" }}>Sắp xếp theo giá</h4>
                  <Select style={{ width: "100%" }} onChange={handleSortChange} allowClear placeholder="Hiển thị">
                    <Option value="asc">Giá: Từ thấp đến cao</Option>
                    <Option value="desc">Giá: Từ cao đến thấp </Option>
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
