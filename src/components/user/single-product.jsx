import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // Để lấy tham số URL
 
import { getProduct, getProductBySlug } from "../../redux/actions/productAction";
 
import {
  getCartDetailsByUsername,
  insertCartDetail,
} from "../../redux/actions/cartDetailAction";

import { Row, Col, Image, Button, Card, Input } from "antd";
import {
  ShoppingCartOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Header from "./Header";
import Footer from "./Footer";
import ProductService from "../../services/productService";
import withRouter from "../../helpers/withRouter";
const { Meta } = Card;

function Product() {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null); // Mặc định không có size nào
  const [selectedToppings, setSelectedToppings] = useState({});
  const [note, setNote] = useState(""); // Để lưu ghi chú
  const [price, setPrice] = useState(50000);
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);

  const cartDetails = useSelector(
    (state) => state.cartDetailReducer.cartDetails
  );
  
  const { id } = useParams();
 
  const dispatch = useDispatch();
  const product = useSelector((state) => state.productReducer.product);

  useEffect(() => {
 
    dispatch(getProductBySlug(id));  
 
  }, [dispatch, id]);

  const thumbnails = product?.images?.map((image) => image.filename) || [];
  const sizes =
    product?.productVariant?.map((variant) => ({
      size: variant.size.name,
      price: variant.price,
    })) || [];
  const toppings =
    product?.productTopping?.map((topping) => ({
      id: topping.topping.id,
      name: topping.topping.name,
      price: topping.topping.price,
    })) || [];

  // Thiết lập size đầu tiên nếu chưa được chọn
  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0].size);
      setPrice(sizes[0].price);
    }
  }, [sizes]);

  const handleSizeClick = (size, price) => {
    setSelectedSize(size);
    setPrice(price);
  };

  const handleToppingChange = (toppingId, toppingName, value) => {
    setSelectedToppings((prev) => ({
      ...prev,
      [toppingId]: { id: toppingId, name: toppingName, quantity: value },
    }));
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
  const thumbnailsPerPage = 4;
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

  const handleAddToCart = () => {
    const username = JSON.parse(localStorage.getItem("user"));

    // console.log(username);

    if (!username) {
      console.error("User is not logged in");
      return;
    }

    // Tìm productVariantId tương ứng với selectedSize
    const selectedVariant = product.productVariant.find(
      (variant) => variant.size.name === selectedSize
    );
    const productVariantId = selectedVariant ? selectedVariant.id : null;

    const selectedSizeObject = sizes.find((size) => size.size === selectedSize);
    const sizeId = selectedVariant ? selectedVariant.sizeId : null;

    const cartDetailToppings = Object.values(selectedToppings)
      .filter((topping) => topping.quantity > 0)
      .map((topping) => ({
        topping: { id: topping.id },
        quantity: topping.quantity,
      }));

    console.log("Toppings: ", cartDetailToppings);

    const toppingPrice = cartDetailToppings.reduce((total, item) => {
      const toppingInfo = toppings.find((t) => t.id === item.topping.id);
      return total + toppingInfo.price * item.quantity;
    }, 0);

    const amount = price + toppingPrice;

    const cartItem = {
      username: username.username,
      productVariantId,
      active: true,
      size: selectedSizeObject,
      productId: product.id,
      sizeId: sizeId,
      price: selectedSizeObject?.price,
      productName: product.name,
      quantity: 1,
      cartDetailToppings: cartDetailToppings,
      toppingPrice,
      amount,
      note,
    };

    console.log(cartItem);

    dispatch(insertCartDetail(cartItem))
      .then(() => {
        // Sau khi thêm thành công, gọi lại danh sách giỏ hàng
        dispatch(getCartDetailsByUsername(username.username));
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      });
  };

  return (
    <>
      <Header />
      <style>
        {`
   
    // :where(.css-dev-only-do-not-override-11lehqq).ant-btn-primary {
    // color: #fff;
    // background: #f28123;
    // box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
}
  `}
      </style>
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
      <div className="product mt-150 mb-150">
        <div className="container">
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  borderRadius: "8px",
                  overflow: "hidden", 
                  width: "500px",
                  height: "500px", 
                  display: "flex",
                  
                }}
              >
                <Image
                  src={ProductService.getProductImageUrl(
                    thumbnails[mainImageIndex]
                  )}
                  alt="Product"
                  style={{
                    borderRadius: "8px",
                    width: "500px",
                    maxHeight: "450px",
                    objectFit: "cover",
                    
                  }}
                />
                
              </div>

              <Button
                  icon={<LeftOutlined />}
                  shape="circle"
                  onClick={handlePreviousImage}
                  style={{
                    position: "absolute",
                    top: "40.5%",
                    left: "-40px",
                    transform: "translateY(-50%)",
                    backgroundColor: "#666666",
                    border: "none",
                    color: "white",
                    
                  }}
                />
                <Button
                  icon={<RightOutlined />}
                  shape="circle"
                  onClick={handleNextImage}
                  style={{
                    position: "absolute",
                    top: "40%",
                    right: "0px",
                    transform: "translateY(-50%)",
                    backgroundColor: "#666666",
                    border: "none",
                    color: "white",
                  }}
                />

              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  icon={<LeftOutlined />}
                  shape="circle"
                  onClick={handlePreviousThumbnails}
                  disabled={currentThumbnailIndex === 0}
                />
                <div style={{ display: "flex", margin: "10px 10px" }}>
                  {thumbnails
                    .slice(
                      currentThumbnailIndex,
                      currentThumbnailIndex + thumbnailsPerPage
                    )
                    .map((imgSrc, index) => (
                      <div
                        key={index}
                        style={{ flex: "0 0 auto", marginRight: "8px" }}
                      >
                        <Image
                          src={ProductService.getProductImageUrl(imgSrc)}
                          alt={`Product thumbnail ${index + 1}`}
                          style={{
                            borderRadius: "8px",
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                            border: "1px solid rgba(0, 0, 0, 0.1)",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={() =>
                            handleThumbnailClick(currentThumbnailIndex + index)
                          }
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
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
                <h3 style={{ color: "#f28123" }}>{product?.name}</h3>
                <h5 style={{     textAlign: "justify"}}>{product?.description}</h5>
                <p
                  className="product-pricing"
                  style={{
                    letterSpacing: "0.15px",
                    fontSize: "20px",
                    lineHeight: "32px",
                    fontWeight: "500",
                  }}
                >
                  <strong>{price.toLocaleString()} VNĐ</strong>
                </p>
                <div className="product-size">
                  <p
                    style={{
                      color: "#f28123",
                      letterSpacing: "0.15px",
                      fontSize: "20px",
                      lineHeight: "32px",
                      fontWeight: "500",
                    }}
                  >
                    <span>Choose size:</span>
                  </p>
                  <div className="size-options">
                    {sizes.map((item) => (
                      <Button
                      key={item.size}
                      onClick={() => handleSizeClick(item.size, item.price)}
                      style={{
                        marginRight: "10px",
                        backgroundColor: selectedSize === item.size ? "#f28123" : "White",
                        color: selectedSize === item.size ? "#fff" : "inherit",
                        border: "0.1px solid #f28123",
                      }}
                    >
                      {item.size}
                    </Button>
                    
                    ))}
                  </div>
                </div>
                <div className="product-toppings" style={{ marginTop: "20px" }}>
                  <p>Choose topping: </p>
                  <div>
                    {toppings.map((topping) => (
                      <div key={topping.name}>
                        <label>
                          <input
                            type="number"
                            min="0"
                            defaultValue={0}
                            onChange={(e) =>
                              handleToppingChange(
                                topping.id,
                                topping.name,
                                Number(e.target.value)
                              )
                            }
                            style={{ width: "50px" }}
                          />
                           {topping.name} ({topping.price.toLocaleString()} VNĐ)
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Input
                    placeholder="Ghi chú của bạn"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                    }}
                  />
                </div>

                <div className="product-form" style={{ marginTop: "20px" }}>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    style={{
                      backgroundColor: "#f28123",
                      border: "none",
                    }}
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </>
  );
}

const mapStateToProps = (state) => ({
  cartDetail: state.cartDetailReducer.cartDetail,
  cartDetails: state.cartDetailReducer.cartDetails,
});

const mapDispatchToProps = {
  insertCartDetail,
  getCartDetailsByUsername,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Product));
