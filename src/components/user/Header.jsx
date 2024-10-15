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
          {/* logo */}
          <div className="site-logo">
            <a href="/">
              <img src="/assets/img/logo2.png" alt="" />
            </a>
          </div>
          {/* logo */}
          {/* menu start */}
          <nav className="main-menu">
            <ul>
              <li className="current-list-item">
                <a href="/">Trang chủ</a>
              </li>
              <li>
                <a href="/about">Về chúng tôi</a>
              </li>
              <li>
                <a href="#">Pages</a>
                {/* <ul className="sub-menu">
                  <li>
                    <a href="about.html">About</a>
                  </li>
                  <li>
                    <a href="cart.html">Cart</a>
                  </li>
                  <li>
                    <a href="checkout.html">Check Out</a>
                  </li>
                  <li>
                    <a href="contact.html">Contact</a>
                  </li>
                  <li>
                    <a href="news.html">News</a>
                  </li>
                  <li>
                    <a href="shop.html">Shop</a>
                  </li>
                </ul> */}
              </li>
              <li>
                <a href="/shop">Sản phẩm</a>
              </li>
              <li>
                <div className="header-icons">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="search-input"
                    style={{ display: "inline-block", marginRight: 10 }}
                  />
                  <a className="mobile-hide search-bar-icon" href="#">
                    <i className="fas fa-search" />
                  </a>
                  <a className="shopping-cart" href="/cart">
                    <i className="fas fa-shopping-cart" />
                  </a>
                  <a className="user-icon" href="#" style={{ marginLeft: 0 }}>
                    <i className="far fa-user" />
                  </a>
                  <div className="sub-menu user-dropdown">
                    <a href="/login">Đăng nhập</a>
                    <a href="/register">Đăng ký</a>
                    <a href="/forgotpassword">Quên mật khẩu</a>
                    <a href="/manager/*">Tài khoản</a>
                    <a href="/manager/*">Đơn hàng</a>
                    <a href="/logout">Đăng xuất</a>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
          <a className="mobile-show search-bar-icon" href="#">
            <i className="fas fa-search" />
          </a>
          <div className="mobile-menu" />
          {/* menu end */}
        </div>
      </div>
    </div>
  </div>
</div>
    </>
  );
}

export default Header;
