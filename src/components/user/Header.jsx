import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isLoading, setIsLoading] = useState(true);
  const stickerRef = useRef(null); // useRef to reference the sticker element

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const handleScroll = () => {
      if (!stickerRef.current) return; // Safeguard if the ref is not attached
      const stickerPosition = stickerRef.current.offsetTop; // Get the top offset of the sticker

      const scrollTop = window.scrollY;

      if (scrollTop > stickerPosition) {
        stickerRef.current.classList.add("is-sticky");
      } else {
        stickerRef.current.classList.remove("is-sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer); // Clear the timeout
      window.removeEventListener("scroll", handleScroll); // Remove scroll listener
    };
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

      <div className="top-header-area" id="sticker" ref={stickerRef}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12 text-center">
              <div className="main-menu-wrap">
                <div className="site-logo">
                  <a href="/">
                    <img src="/assets/img/logo.png" alt="Logo" />
                  </a>
                </div>

                <nav className="main-menu">
                  <ul>
                    <li className="current-list-item">
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="/admin/login">Page</a>
                      <ul className="sub-menu">
                        <li>
                          <a href="/404">404 page</a>
                        </li>
                        <li>
                          <a href="/cart">Cart</a>
                        </li>
                        <li>
                          <a href="/checkout">Check Out</a>
                        </li>
                        <li>
                          <a href="/shop">Shop</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="/single-product">Product</a>
                    </li>
                    <li>
                      <a href="/shop">Shop</a>
                      <ul className="sub-menu">
                        <li>
                          <a href="/checkout">Check Out</a>
                        </li>
                        <li>
                          <a href="/single-product">Single Product</a>
                        </li>
                        <li>
                          <a href="/cart">Cart</a>
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
