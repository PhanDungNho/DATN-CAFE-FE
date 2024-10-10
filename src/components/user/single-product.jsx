import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Product() {
  // Tạo state để lưu trữ size đã chọn
  const [selectedSize, setSelectedSize] = useState("M");

  // Mảng chứa giá cho từng size
  const sizes = [
    { size: "S", price: 40 },
    { size: "M", price: 50 },
    { size: "L", price: 60 },
  ];

  // Hàm để thay đổi kích thước
  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  return (
    <>
      <Header />
      <div className="breadcrumb-section breadcrumb-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="breadcrumb-text">
                <p>See more Details</p>
                <h1>Single Product</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product mt-150 mb-150">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="product-img">
                <img
                  src="assets/img/products/product-img-5.jpg"
                  alt=""
                  className="zoom-img"
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="product-content">
                <h3>Green apples have polyphenols</h3>
                <p className="product-pricing">
                  <span>Per Kg: </span> $50
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Dicta sint dignissimos, rem commodi cum voluptatem quae
                  reprehenderit repudiandae ea tempora incidunt ipsa, quisquam
                  animi perferendis eos eum modi! Tempora, earum.
                </p>

                {/* Size selection */}
                <div className="product-size">
                  <p>
                    <strong>Size:</strong>
                  </p>
                  <div className="size-options">
                    {sizes.map((item) => (
                      <div
                        key={item.size}
                        className={`size-option ${selectedSize === item.size ? "selected" : ""}`}
                        onClick={() => handleSizeClick(item.size)}
                        style={{
                          display: "inline-block",
                          padding: "10px",
                          border: "1px solid #ccc",
                          marginRight: "10px",
                          cursor: "pointer",
                          backgroundColor: selectedSize === item.size ? "orange" : "white",
                          color: selectedSize === item.size ? "white" : "black",
                          textAlign: "center",
                        }}
                      >
                        <div>{item.size}</div>
                        {/* Đường kẻ ngang giữa kích thước và giá */}
                        <div
                          style={{
                            borderTop: "1px solid #ccc", // Đường kẻ ngang
                            marginTop: "5px", // Khoảng cách trên và dưới đường kẻ
                            paddingTop: "5px",
                          }}
                        >
                          {item.price} đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="product-form">
                  <form action="/">
                    <input type="number" placeholder="0" />
                  </form>
                  <a href="/cart" className="cart-btn">
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </a>
                  <p>
                    <strong>Categories: </strong>Fruits, Organic
                  </p>
                </div>
                <h4>Share:</h4>
                <ul className="product-share">
                  <li>
                    <a href="">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fab fa-google-plus-g"></i>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fab fa-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="more-products mb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="section-title">
                <h3>
                  <span className="orange-text">Featured</span> Products
                </h3>
                <p>
                  Check out our handpicked featured products that are popular among our customers.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 text-center">
              <div className="product-item">
                <div className="new-label">HOT</div>
                <div className="product-image">
                  <a href="product.html">
                    <img src="assets/img/products/product-img-6.jpg" alt="Banana" />
                  </a>
                </div>
                <h3>Banana</h3>
                <p className="product-price">
                  <span>Per Kg</span> $40
                </p>
                <a href="cart.html" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </a>
              </div>
            </div>
            {/* More product items */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Product;
