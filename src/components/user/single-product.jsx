import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function product() {
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

      <div className="classNameproduct mt-150 mb-150">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="classNameproduct-img">
                <img src="assets/img/products/product-img-5.jpg" alt="" />
              </div>
            </div>
            <div className="col-md-7">
              <div className="classNameproduct-content">
                <h3>Green apples have polyphenols</h3>
                <p className="classNameproduct-pricing">
                  <span>Per Kg</span> $50
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Dicta sint dignissimos, rem commodi cum voluptatem quae
                  reprehenderit repudiandae ea tempora incidunt ipsa, quisquam
                  animi perferendis eos eum modi! Tempora, earum.
                </p>
                <div className="classNameproduct-form">
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

      <div className="more-products mb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="section-title">
                <h3>
                  <span className="orange-text">Related</span> Products
                </h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Aliquid, fuga quas itaque eveniet beatae optio.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 text-center">
              <div className="classNameproduct-item">
                <div className="product-image">
                  <a href="classNameproduct.html">
                    <img src="assets/img/products/product-img-1.jpg" alt="" />
                  </a>
                </div>
                <h3>Strawberry</h3>
                <p className="product-price">
                  <span>Per Kg</span> 85${" "}
                </p>
                <a href="cart.html" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 text-center">
              <div className="classNameproduct-item">
                <div className="product-image">
                  <a href="classNameproduct.html">
                    <img src="assets/img/products/product-img-2.jpg" alt="" />
                  </a>
                </div>
                <h3>Berry</h3>
                <p className="product-price">
                  <span>Per Kg</span> 70${" "}
                </p>
                <a href="cart.html" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 offset-lg-0 offset-md-3 text-center">
              <div className="classNameproduct-item">
                <div className="product-image">
                  <a href="classNameproduct.html">
                    <img src="assets/img/products/product-img-3.jpg" alt="" />
                  </a>
                </div>
                <h3>Lemon</h3>
                <p className="product-price">
                  <span>Per Kg</span> 35${" "}
                </p>
                <a href="/cart" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default product;
