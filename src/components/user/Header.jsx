import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  LoginOutlined,
  UserAddOutlined,
  KeyOutlined,
  IdcardOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  TeamOutlined
} from "@ant-design/icons";
function Header() {
  const [isLoading, setIsLoading] = useState(true);
  const stickerRef = useRef(null); // useRef to reference the sticker element
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Giả sử thông tin người dùng được lưu trong localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.username) {
      setIsLoggedIn(true);  // Đã đăng nhập
      setUsername(user.username); // Lưu username
    }

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
  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa thông tin đăng nhập
    setIsLoggedIn(false); // Đặt lại trạng thái đăng nhập
    setUsername(""); // Xóa tên người dùng
    window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
  };
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
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="/about">About</a>
                    </li>
                    <li>
                      <a href="">Pages</a>
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
                      <a href="/shop">Products</a>
                    </li>
                    <li>
                      <li>
                        <input
                          type="text"
                          placeholder="Search..."
                          className="search-input"
                          style={{ display: "inline-block", marginRight: 10 }}
                        />
                      </li>
                      <li>
                        <a className="mobile-hide search-bar-icon" href="#">
                          <i className="fas fa-search" />
                        </a>
                      </li>
                      <li>
                        <a className="shopping-cart" href="/cart">
                          <i className="fas fa-shopping-cart" />
                        </a>
                      </li>
                      <div className="header-icons">
                        {/* Icon user */}
                        <a className="user-icon" href="#" style={{ marginLeft: 0 }}>
                          <UserOutlined style={{ fontSize: "20px" }} />
                          {isLoggedIn ? <span>{username}</span> : <span>Account</span>}
                        </a>

                        {/* Dropdown menu cho user */}
                        <div className="sub-menu user-dropdown">
                          {!isLoggedIn ? (
                            <>
                              <a href="/login">
                                <LoginOutlined style={{ marginRight: "8px" }} /> Đăng nhập
                              </a>
                              <a href="/register">
                                <UserAddOutlined style={{ marginRight: "8px" }} /> Đăng ký
                              </a>
                              <a href="/forgotpassword">
                                <KeyOutlined style={{ marginRight: "8px" }} /> Quên mật khẩu
                              </a>
                            </>
                          ) : (
                            <>
                              <a href="/manager/*">
                                <IdcardOutlined style={{ marginRight: "8px" }} /> Tài khoản
                              </a>
                              <a href="/manager/*">
                                <ShoppingOutlined style={{ marginRight: "8px" }} /> Đơn hàng
                              </a>
                              {/* Hiện admin nếu user có vai trò admin */}
                              {isLoggedIn && JSON.parse(localStorage.getItem("user"))?.roles.includes("ROLE_ADMIN") && (
                                <a href="/admin">
                                  <TeamOutlined style={{ marginRight: "8px" }} /> Admin
                                </a>
                              )}
                              <a href="/" onClick={handleLogout}>
                                <LogoutOutlined style={{ marginRight: "8px" }} /> Đăng xuất
                              </a>
                            </>
                          )}

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
