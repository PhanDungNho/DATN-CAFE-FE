import React, { useState } from "react";
import { Row, Col, Image, Button, Card } from "antd";
import { ShoppingCartOutlined, LeftOutlined, RightOutlined, LineHeightOutlined } from "@ant-design/icons";
import Header from "./Header";
import Footer from "./Footer";

const { Meta } = Card;

function Product() {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [price, setPrice] = useState(50000); // Giá khởi điểm cho size M
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0); // Để điều khiển nhóm thumbnail hiện tại

  const sizes = [
    { size: "S", price: 40000 },
    { size: "M", price: 50000 },
    { size: "L", price: 60000 },
  ];

  const thumbnails = [
    "assets/img/index/cafeden.png",
    "assets/img/index/cafesua.png",
    "assets/img/index/imgbacxiu.png",
    "assets/img/index/imgbacxiu.png",
    "assets/img/index/imgbacxiu.png",
    "assets/img/index/imgbacxiu.png",
    "assets/img/index/imgbacxiu.png",
    "assets/img/index/imgbacxiu.png",
  ];

  const featuredProducts = [
    {
      name: "Banana",
      price: 40,
      img: "assets/img/products/product-img-6.jpg",
    },
  ];

  const handleSizeClick = (size, price) => {
    setSelectedSize(size);
    setPrice(price); // Cập nhật giá khi size được chọn
  };

  const handleThumbnailClick = (index) => {
    setMainImageIndex(index);
  };

  const handleNextImage = () => {
    setMainImageIndex((prevIndex) => (prevIndex + 1) % thumbnails.length);
  };

  const handlePreviousImage = () => {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? thumbnails.length - 1 : prevIndex - 1
    );
  };

  // Điều khiển ảnh thumbnail
  const thumbnailsPerPage = 4; // Số ảnh hiển thị mỗi lần
  const maxThumbnailIndex = Math.max(0, thumbnails.length - thumbnailsPerPage);

  const handleNextThumbnails = () => {
    setCurrentThumbnailIndex((prevIndex) =>
      prevIndex < maxThumbnailIndex ? prevIndex + 1 : prevIndex
    );
  };

  const handlePreviousThumbnails = () => {
    setCurrentThumbnailIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  return (
    <>
      <Header />
      <style>{`
        :where(.css-dev-only-do-not-override-11lehqq).ant-btn-primary {
      color: #fff;
      background: #ff8416;
      box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
      }
      :where(.css-dev-only-do-not-override-11lehqq).ant-btn-primary:not(:disabled):not(.ant-btn-disabled):hover {
          color: #fff;
          background: #ff8416;
      }
          :where(.css-dev-only-do-not-override-11lehqq).ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
          color: #fff;
          border-color: black;
          background: #ff8416;
}
      `}
      </style>
      <div className="product mt-150 mb-150">
        <div className="container">
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <div style={{ position: "relative", backgroundColor: "rgba(0, 0, 0, 0.05)", borderRadius: "8px" }}>
                <Image
                  src={thumbnails[mainImageIndex]}
                  alt="Product"
                  style={{
                    borderRadius: "8px",
                    width: "100%",
                    maxHeight: "450px",
                    objectFit: "cover",
                    marginBottom: "10px",
                    marginLeft: "50px",
                  }}
                />
                {/* Nút Previous (icon) */}
                <Button
                  icon={<LeftOutlined />}
                  shape="circle"
                  onClick={handlePreviousImage}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    border: "none",
                    color: "white",
                  }}
                />
                {/* Nút Next (icon) */}
                <Button
                  icon={<RightOutlined />}
                  shape="circle"
                  onClick={handleNextImage}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    border: "none",
                    color: "white",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  icon={<LeftOutlined />}
                  shape="circle"
                  onClick={handlePreviousThumbnails}
                  disabled={currentThumbnailIndex === 0}
                />
                <div style={{ display: "flex", margin: "10px 10px" }}>
                  {thumbnails
                    .slice(currentThumbnailIndex, currentThumbnailIndex + thumbnailsPerPage)
                    .map((imgSrc, index) => (
                      <div key={index} style={{ flex: "0 0 auto", marginRight: "8px" }}>
                        <Image
                          src={imgSrc}
                          alt={`Product thumbnail ${index + 1}`}
                          style={{
                            borderRadius: "8px",
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                            border: "1px solid rgba(0, 0, 0, 0.1)", // Viền mờ nhẹ
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Tạo thêm hiệu ứng bóng đổ nhẹ
                          }}
                          onClick={() => handleThumbnailClick(currentThumbnailIndex + index)}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          preview={false}
                        />
                      </div>
                    ))}
                </div>
                <Button
                  icon={<RightOutlined />}
                  shape="circle"
                  onClick={handleNextThumbnails}
                  disabled={currentThumbnailIndex === maxThumbnailIndex}
                />
              </div>
            </Col>

            <Col md={12}>
              <div className="product-content" style={{ marginLeft: "80px" }}>
                <h3 style={{
                  color: "#f28123", letterSpacing: "0.15px",
                  fontSize: "22px",
                  lineHeight: "32px", // Corrected property name
                  fontWeight: "500"
                }}>Trà sữa chân trâu</h3>
                <p className="product-pricing"
                  style={{
                    letterSpacing: "0.15px",
                    fontSize: "20px",
                    lineHeight: "32px", // Corrected property name
                    fontWeight: "500"
                  }}
                >
                  <strong>{price.toLocaleString()} VNĐ</strong>
                </p>
                <div className="product-size">
                  <p style={{
                    color: "#f28123", letterSpacing: "0.15px",
                    fontSize: "20px",
                    lineHeight: "32px", // Corrected property name
                    fontWeight: "500"
                  }}>
                    <span>Chọn kích cỡ:</span>
                  </p>
                  <div className="size-options">
                    {sizes.map((item) => (
                      <Button
                        key={item.size}
                        type={selectedSize === item.size ? "primary" : "default"}
                        onClick={() => handleSizeClick(item.size, item.price)} // Truyền size và giá
                        style={{ marginRight: "10px" }}
                      >
                        {item.size}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="product-toppings" style={{ marginTop: "20px" }}>
                  <div style={{ marginTop: "10px", overflow: "hidden" }}>
                    <table style={{ width: "50%", borderCollapse: "collapse" }}>
                      <tbody>
                        {['Cù năng', 'Trân châu', 'Flan', 'Khoai dẻo', 'Khoai cứng', 'Thạch trân châu', 'Rau Cau'].map((topping, index) => (
                          <tr key={index}>
                            <td style={{ padding: "4px", fontSize: "14px" }}>{topping}</td>
                            <td style={{ padding: "2px", textAlign: "center" }}>
                              <input
                                type="number"
                                defaultValue={0}
                                style={{
                                  width: "60px", // Increased width to accommodate larger numbers
                                  height: "25px", // Set a height to ensure it's visible
                                  textAlign: "center",
                                  margin: "0",
                                  padding: "2px",
                                  fontSize: "14px" // Adjust font size for better readability
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="product-form" style={{ marginTop: "20px" }}>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    style={{
                      backgroundColor: "#f28123",
                      border: "none",
                      width: "200px", // Set a specific width for the button
                      padding: "10px 20px", // Optional: Adjust padding for a better look
                      textAlign: "center" // Ensure text is centered
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

        </div>
      </div >

      <div className="more-products mb-150">
        <div className="container">
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ textAlign: "center", marginBottom: "20px" }}>
              <h3>
                <span className="orange-text">Đề xuất</span> sản phẩm
              </h3>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {featuredProducts.map((product, index) => (
              <Col key={index} lg={8} md={12} sm={24}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.img} />}
                  actions={[
                    <Button type="primary" icon={<ShoppingCartOutlined />}>
                      Add to Cart
                    </Button>,
                  ]}
                >
                  <Meta title={product.name} description={`Per Kg: $${product.price}`} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Product;
