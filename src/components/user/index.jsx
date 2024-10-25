import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Button, Card, Typography } from "antd";
import { ShoppingCartOutlined, SyncOutlined, PhoneOutlined, RocketOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductService from "../../services/productService";
import { useNavigate } from "react-router-dom";




const { Content } = Layout;
const { Title, Paragraph } = Typography;

function Index() {
  const [startIndex, setStartIndex] = useState(0);
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
  const [error, setError] = useState(null); // State để lưu thông tin lỗi nếu có
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Kiểm tra lại URL, đảm bảo đúng cổng và route của API
        const response = await axios.get('http://localhost:8081/api/v1/products');

        // Cập nhật state với dữ liệu sản phẩm, lấy giá từ product_variants
        const updatedProducts = response.data.map(product => {
          const variant = product.product_variants && product.product_variants.length > 0
            ? product.product_variants[0]
            : null; // Nếu không có variant, gán là null

          return {
            ...product,
            price: variant ? variant.price : 'N/A', // Gán giá từ variant nếu có
          };
        });


        setProducts(updatedProducts); // Cập nhật state với dữ liệu đã xử lý
        setLoading(false); // Tắt trạng thái loading sau khi lấy dữ liệu xong
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.'); // Cập nhật state lỗi
        setLoading(false); // Tắt trạng thái loading khi có lỗi
      }
    };

    fetchProducts();
  }, []);


  // Nếu đang tải dữ liệu, hiển thị loading
  if (loading) {
    return <div>Đang tải sản phẩm...</div>;
  }

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return <div>{error}</div>;
  }

  // Nếu không có sản phẩm nào được trả về từ API
  if (products.length === 0) {
    return <div>Không có sản phẩm nào để hiển thị.</div>;
  }

  const visibleProducts = [
    products[startIndex],
    products[(startIndex + 1) % products.length],
    products[(startIndex + 2) % products.length],
  ];

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % products.length); // Cycle to the next product
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length); // Cycle to the previous product
  };



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
          <img src="assets/img/index/banner4.png" alt=""
            style={{
              width: '1600px',
              height: '670px'
            }}
          />
        </div>
        <div className="container">
          <Row justify="center" style={{ marginTop: '50px' }}>
            <Col span={16} style={{ textAlign: 'center' }}>
              <Title level={2} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600', color: '#333', paddingTop: '10px' }}>
                <span className="orange-text">Sản phẩm</span> nổi bật
              </Title>
              <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#555', lineHeight: '1.6' }}>
                Mỗi ly trà là một cuộc hành trình qua thời gian và không gian, gợi nhớ về truyền thống và sự thanh khiết của thiên nhiên.
              </Paragraph>
            </Col>
          </Row>
          <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
            <Col>
              <Button
                icon={<LeftOutlined />}
                onClick={handlePrev}
                disabled={startIndex === 0}
                style={{
                  marginRight: '10px',
                  backgroundColor: '#ff8c00',
                  color: '#fff',
                  borderRadius: '50%', // Make the button round
                  width: '50px', // Set the width and height
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: 'none',
                  transition: 'all 0.3s ease',

                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff8c00';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </Col>

            <Row gutter={[16, 16]} justify="center">
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product) => (
                  product && (
                    <Col key={product.id} style={{ margin: "0 10px" }}>
                      <Link to={`/single-product/${product.id}`}>

                        <Card
                          cover={<img
                            alt={product.name}

                            src={ProductService.getProductImageUrl(product.images[0].fileName)}

                            style={{ height: 200, objectFit: 'cover', borderRadius: '8px' }}
                            onError={(e) => {
                              console.log(`Không thể tải ảnh: ${product.image}`);
                              e.target.src = 'assets/css/img/index/bacxiu1.jpg'; // Đường dẫn ảnh mặc định khi không tải được
                            }}
                          />}
                          style={{
                            width: '200px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                          }}
                          bodyStyle={{ padding: '16px', textAlign: 'center' }}
                          className="product-card"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Title level={4} style={{
                            marginBottom: '10px',
                            fontSize: '18px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {product.name}
                          </Title>
                        </Card>
                      </Link>
                    </Col>
                  )
                ))
              ) : (
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Paragraph>Không có sản phẩm nào để hiển thị.</Paragraph>
                </Col>
              )}
            </Row>
            <Col>
              <Button
                icon={<RightOutlined />}
                onClick={handleNext}
                disabled={startIndex + 3 >= products.length}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#ff8c00',
                  color: '#fff',
                  borderRadius: '50%', // Make the button round
                  width: '50px', // Set the width and height
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff8c00';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: '50px' }}>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Title level={2} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600', color: '#333', paddingTop: '10px' }}>
                <span className="orange-text">Sản phẩm</span> top bán chạy
              </Title>
              <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#555', lineHeight: '1.6' }}>
                Mỗi ly trà là một cuộc hành trình qua thời gian và không gian, gợi nhớ về truyền thống và sự thanh khiết của thiên nhiên.
              </Paragraph>
            </Col>
          </Row>

          <Row gutter={[24, 24]} justify="center" align="middle" style={{ marginBottom: '20px' }}>
            {visibleProducts.length > 0 ? (
              visibleProducts.slice(0, 4).map((product) => (
                product && (
                  <Col key={product.id} span={6} style={{ margin: "0 10px" }}>
                    <Link to={`/single-product/${product.id}`}>
                      <Card
                        cover={<img
                          alt={product.name}
                          src={ProductService.getProductImageUrl(product.images[0].fileName)}
                          style={{ height: 200, objectFit: 'cover', borderRadius: '8px' }}
                          onError={(e) => {
                            console.log(`Không thể tải ảnh: ${product.image}`);
                            e.target.src = 'assets/css/img/index/bacxiu1.jpg'; // Đường dẫn ảnh mặc định khi không tải được
                          }}
                        />}
                        style={{
                          width: '200px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                        }}
                        bodyStyle={{ padding: '16px', textAlign: 'center' }}
                        className="product-card"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Title level={4} style={{
                          marginBottom: '10px',
                          fontSize: '18px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {product.name}
                        </Title>
                      </Card>
                    </Link>
                  </Col>
                )
              ))
            ) : (
              <Col span={24} style={{ textAlign: 'center' }}>
                <Paragraph>Không có sản phẩm nào để hiển thị.</Paragraph>
              </Col>
            )}

          </Row>
          <div>
            <img src="assets/img/index/banner2.png" alt=""
              style={{
                width: '1600px',
                height: '500px'
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
                  textAlign: 'center',
                  padding: '30px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: '2px solid #f0f0f0', // Viền nhạt
                }}
                hoverable
              >
                <Row align="middle" justify="center">
                  <Col span={4} style={{ borderRadius: '100%', background: '#f0f0f0', padding: '8px' }}>
                    <RocketOutlined style={{ fontSize: '40px', color: '#ff8c00', marginBottom: '20px' }} />
                  </Col>
                  <Col span={20}>
                    <Title level={3} style={{ fontWeight: '600' }}>
                      Free Shipping
                    </Title>
                    <Paragraph style={{}}>Free Ship đơn trên 150.000 </Paragraph>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: '2px solid #f0f0f0', // Viền nhạt
                }}
                hoverable
              >
                <Row align="middle" justify="center">
                  <Col span={4} style={{ borderRadius: '100%', background: '#f0f0f0', padding: '8px' }}>
                    <PhoneOutlined style={{ fontSize: '40px', color: '#ff8c00', marginBottom: '20px' }} />
                  </Col>
                  <Col span={20}>
                    <Title level={3} style={{ fontWeight: '600' }}>
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
                  textAlign: 'center',
                  padding: '30px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: '2px solid #f0f0f0', // Viền nhạt
                }}
                hoverable
              >
                <Row align="middle" justify="center">
                  <Col span={4} style={{ borderRadius: '100%', background: '#f0f0f0', padding: '8px' }}>
                    <SyncOutlined style={{ fontSize: '40px', color: '#ff8c00', marginBottom: '20px' }} />
                  </Col>
                  <Col span={20}>
                    <Title level={3} style={{ fontWeight: '600' }}>
                      Refund
                    </Title>
                    <Paragraph style={{}}>Get refund within 3 days!</Paragraph>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Index;
