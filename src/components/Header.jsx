import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Thay đổi thời gian tùy thuộc vào thời gian tải của bạn

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="loader">
          <div className="loader-inner">
            <div className="circle"></div>
          </div>
        </div>
      )}

      <div className="top-header-area" id="sticker">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12 text-center">
              <div className="main-menu-wrap">
                <div className="site-logo">
                  <Link to="/">
                    <img src="assets/img/logo.png" alt="Logo" />
                  </Link>
                </div>

                <nav className="main-menu">
                  <ul>
                    <li className="current-list-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/">Page</Link>
                      <ul className="sub-menu">
                        <li>
                          <Link to="./404">404 page</Link>
                        </li>
                        <li>
                          <Link to="./cart">Cart</Link>
                        </li>
                        <li>
                          <Link to="./checkout">Check Out</Link>
                        </li>
                        <li>
                          <Link to="./shop">Shop</Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="./single-product">Product</Link>
                    </li>
                    <li>
                      <Link to="./shop">Shop</Link>
                      <ul className="sub-menu">
                        <li>
                          <Link to="./checkout">Check Out</Link>
                        </li>
                        <li>
                          <Link to="./single-product">Single Product</Link>
                        </li>
                        <li>
                          <Link to="./cart">Cart</Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div className="header-icons">
                        <Link className="shopping-cart" to="./cart">
                          <i className="fas fa-shopping-cart"></i>
                        </Link>
                        <a className="mobile-hide search-bar-icon" href="#">
                          <i className="fas fa-search"></i>
                        </a>
                      </div>
                    </li>
                  </ul>
                </nav>
                <a className="mobile-show search-bar-icon" href="#">
                  <i className="fas fa-search"></i>
                </a>
                <div className="mobile-menu"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
