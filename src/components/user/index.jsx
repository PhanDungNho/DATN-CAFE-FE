import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Button, Card, Typography, Spin } from "antd";
import {
  ShoppingCartOutlined,
  SyncOutlined,
  PhoneOutlined,
  RocketOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductService from "../../services/productService";
import { useNavigate } from "react-router-dom";
import {API} from '../../services/constant'

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function Index() {
  const [startIndex, setStartIndex] = useState(0);
  const [startIndexSecondRow, setStartIndexSecondRow] = useState(0);
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [topProducts, setTopProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
         API + "/api/v1/products"
        );

        // Xử lý sản phẩm để lấy ra top 10 sản phẩm bán chạy nhất
        const updatedProducts = response.data
          .map((product) => {
            const variant =
              product.product_variants && product.product_variants.length > 0
                ? product.product_variants[0]
                : null;
            return {
              ...product,
              price: variant ? variant.price : "N/A",
            };
          })
          // Giả sử sản phẩm có thuộc tính `sales` để biểu thị số lượng bán ra
          .sort((a, b) => b.sales - a.sales) // Sắp xếp giảm dần theo doanh số bán ra
          .slice(0, 10); // Lấy ra 10 sản phẩm bán chạy nhất

        setProducts(updatedProducts);
        setLoading(false);
        console.log("Product", updatedProducts);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setError("Có lỗi xảy ra khi lấy dữ liệu sản phẩm.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let interval;
    if (topProducts && topProducts.length > 0) {
      interval = setInterval(() => {
        setStartIndex((prev) => (prev + 1) % topProducts.length);
      }, 4500);
    }

    return () => clearInterval(interval);
  }, [topProducts]);

  const handleNextFirstRow = () =>
    setStartIndex((prev) => (prev + 1) % (topProducts.length));

  const handlePrevFirstRow = () =>
    setStartIndex((prev) => (prev - 1 + topProducts.length) % topProducts.length);

  // Tạo mảng vòng lặp vô hạn bằng cách nối mảng
  const infiniteProducts = [...topProducts, ...topProducts];
  const visibleProducts = infiniteProducts.slice(
    startIndex,
    startIndex + 4 // Hiển thị 4 sản phẩm
  );

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm bán chạy
    axios
      .get( API + "/api/v1/products/top-selling")
      .then((response) => {
        setTopProducts(response.data); // Lưu dữ liệu sản phẩm vào state
        setLoading(false);
      })
      .catch((err) => {
        setError("Có lỗi khi tải sản phẩm 123");
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <Header />
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
      {/* Features Section */}
      <Content style={{ padding: "5px 0", backgroundColor: "#ffff" }}>
        <div>
          <img
            src="assets/img/index/bannernew1.png"
            alt=""
            style={{
              width: "100%",
              height: "670px",
            }}
          />
        </div>
        <div className="container-fluid">
          <Row justify="center" style={{ marginTop: "50px" }}>
            <Col span={16} style={{ textAlign: "center" }}>
              <Title level={2} style={{ fontFamily: "Arial, sans-serif", fontWeight: "600" }}>
                <span className="orange-text">Best Selling</span> Product 
              </Title>
              <Paragraph>Every cup of tea is a journey through time and space.</Paragraph>
            </Col>
          </Row>
          <Row justify="center" align="middle" style={{ marginBottom: "20px" }}>
            <Col>
              <Button
                icon={<LeftOutlined />}
                onClick={handlePrevFirstRow}
                disabled={startIndex === 0}
                style={{
                  marginRight: "10px",
                  backgroundColor: "#ff8c00",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#000";
                  e.currentTarget.style.transform = "scale(1.2)";
                  e.currentTarget.style.boxShadow =
                    "0px 4px 12px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff8c00";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </Col>

            <Row
              gutter={[16, 16]}
              justify="center"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)", // Bố cục 3 sản phẩm
                gap: "35px", // Khoảng cách giữa các sản phẩm
              }}
            >
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product, index) => (
                  <Col key={`${product.slug}-${index}`}>
                    <Link
                      to={product.slug ? `/single-product/${product.slug}` : "#"}
                    >
                      <Card
                        cover={
                          <img
                            alt={product.name}
                            src={ProductService.getProductImageUrl(
                              product.images[0].fileName
                            )}
                            style={{
                              height: 200,
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        }
                        style={{
                          width: "200px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 15px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Title
                          level={4}
                          style={{ marginBottom: "10px", fontSize: "18px" }}
                        >
                          {product.name}
                        </Title>
                      </Card>
                    </Link>
                  </Col>
                ))
              ) : (
                <Col span={24} style={{ textAlign: "center" }}>
                  <Paragraph>Không có sản phẩm nào để hiển thị.</Paragraph>
                </Col>
              )}
            </Row>
            <Col>
              <Button
                icon={<RightOutlined />}
                onClick={handleNextFirstRow}
                disabled={startIndex + 3 >= products.length}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#ff8c00",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#000";
                  e.currentTarget.style.transform = "scale(1.2)";
                  e.currentTarget.style.boxShadow =
                    "0px 4px 12px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff8c00";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </Col>
          </Row>
          <div>
            <img
              src="assets/img/index/bannernew2.png"
              alt=""
              style={{
                width: "1800px",
                height: "500px",
              }}
            />
          </div>
        </div>
      </Content>

      {/* Deal of the Month Section */}
      <Content style={{ padding: "30px 0", backgroundColor: "#ffff" }}>
        <div className="container">
          <Row gutter={[16, 16]} justify="center">
          <Col span={8}>
              <Card
                style={{
                  textAlign: "center",
                  padding: "30px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  border: "2px solid #f0f0f0", // Viền nhạt
                }}
                hoverable
              >
                <Row align="middle" justify="center">
                  <Col
                    span={4}
              
                  >
                    <RocketOutlined
                      style={{
                        fontSize: "40px",
                        color: "#ff8c00",
                        marginBottom: "20px",
                      }}
                    />

                  </Col>
                  <Col span={20}>
                    <Title level={3} style={{ fontWeight: "600" }}>
                    Free Shipping
                    </Title>
                    <Paragraph style={{}}>Free shipping over 150,000</Paragraph>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{
                  textAlign: "center",
                  padding: "30px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  border: "2px solid #f0f0f0", // Viền nhạt
                }}
                hoverable
              >
                <Row align="middle" justify="center">
                  <Col
                    span={4}
              
                  >
                    <PhoneOutlined
                      style={{
                        fontSize: "40px",
                        color: "#ff8c00",
                        marginBottom: "20px",
                      }}
                    />
                  </Col>
                  <Col span={20}>
                    <Title level={3} style={{ fontWeight: "600" }}>
                      24/7 Support
                    </Title>
                    <Paragraph style={{}}>Get support all day</Paragraph>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{
                  textAlign: "center",
                  padding: "30px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  border: "2px solid #f0f0f0", // Viền nhạt
                }}
                hoverable
              >
                <Row align="middle" justify="center">
                  <Col
                    span={4}
              
                  >
                    <SyncOutlined
                      style={{
                        fontSize: "40px",
                        color: "#ff8c00",
                        marginBottom: "20px",
                      }}
                    />
                  </Col>
                  <Col span={20}>
                    <Title level={3} style={{ fontWeight: "600" }}>
                      Refund
                    </Title>
                    <Paragraph style={{}}> can be exchanged</Paragraph>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
        <style>
          {`
  .product-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Chia mỗi hàng thành 3 cột */
  gap: 20px; /* Khoảng cách giữa các sản phẩm */
}

.product-item {
  text-align: center;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
  `}
        </style>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Index;
