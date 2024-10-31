import React, { useEffect, useRef, useState } from "react";
import {
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
  KeyOutlined,
  IdcardOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Space, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getCartDetailsByUsername } from "../../redux/actions/cartDetailAction";
import { ImBin } from "react-icons/im";
import { FaShoppingCart } from "react-icons/fa";
function Header() {
  const [isLoading, setIsLoading] = useState(true);
  const stickerRef = useRef(null); // useRef to reference the sticker element
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  // const [data, setData] = useState([]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "productVariant",
      key: "productVariant",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Topping",
      dataIndex: "toppings",
      key: "toppings",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="custom-delete-button"
            variant="filled"
            style={{ border: "none" }}
          >
            <ImBin />
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      productVariant: "Tra oi",
      size: "L",
      toppings: "Topping C",
      price: 900000.0,
    },
    {
      key: "2",
      productVariant: "Tra oi",
      size: "L",
      toppings: "Topping C",
      price: 900000.0,
    },
    {
      key: "3",
      productVariant: "Tra oi",
      size: "L",
      toppings: "Topping C",
      price: 900000.0,
    },
  ];

  useEffect(() => {
    // Giả sử thông tin người dùng được lưu trong localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.username) {
      setIsLoggedIn(true);
      setUsername(user.username);

      // Gọi action để lấy dữ liệu giỏ hàng
      dispatch(getCartDetailsByUsername(user.username))
        .then((cartDetails) => {
          // setData(cartDetails);
        })
        .catch((error) => {
          console.error("Error fetching cart details:", error);
        });
    }
 
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const handleScroll = () => {
      if (!stickerRef.current) return;
      const stickerPosition = stickerRef.current.offsetTop;

      const scrollTop = window.scrollY;

      if (scrollTop > stickerPosition) {
        stickerRef.current.classList.add("is-sticky");
      } else {
        stickerRef.current.classList.remove("is-sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    window.location.href = "/login";
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
                        <a className="shopping-cart" onClick={showDrawer}>
                          <i className="fas fa-shopping-cart" />
                        </a>
                      </li>
                      <div className="header-icons">
                        {/* Icon user */}
                        <a
                          className="user-icon"
                          href="#"
                          style={{ marginLeft: 0 }}
                        >
                          <UserOutlined style={{ fontSize: "20px" }} />
                          {isLoggedIn ? (
                            <span>{username}</span>
                          ) : (
                            <span>Account</span>
                          )}
                        </a>

                        {/* Dropdown menu cho user */}
                        <div className="sub-menu user-dropdown">
                          {!isLoggedIn ? (
                            <>
                              <a href="/login">
                                <LoginOutlined style={{ marginRight: "8px" }} />{" "}
                                Đăng nhập
                              </a>
                              <a href="/register">
                                <UserAddOutlined
                                  style={{ marginRight: "8px" }}
                                />{" "}
                                Đăng ký
                              </a>
                              <a href="/forgotpassword">
                                <KeyOutlined style={{ marginRight: "8px" }} />{" "}
                                Quên mật khẩu
                              </a>
                            </>
                          ) : (
                            <>
                              <a href="/manager/*">
                                <IdcardOutlined
                                  style={{ marginRight: "8px" }}
                                />{" "}
                                Tài khoản
                              </a>
                              <a href="/manager/*">
                                <ShoppingOutlined
                                  style={{ marginRight: "8px" }}
                                />{" "}
                                Đơn hàng
                              </a>
                              {/* Hiện admin nếu user có vai trò admin */}
                              {isLoggedIn &&
                                JSON.parse(
                                  localStorage.getItem("user")
                                )?.roles.includes("ROLE_ADMIN") && (
                                  <a href="/admin">
                                    <TeamOutlined
                                      style={{ marginRight: "8px" }}
                                    />{" "}
                                    Admin
                                  </a>
                                )}
                              <a href="/" onClick={handleLogout}>
                                <LogoutOutlined
                                  style={{ marginRight: "8px" }}
                                />{" "}
                                Đăng xuất
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
                <Drawer title="Shopping cart" onClose={onClose} open={open}>
                  <Table columns={columns} dataSource={data} />

                  {/* Đặt container cho nút */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginTop: "16px",
                    }}
                  >
                    <Button
                      icon={<FaShoppingCart />}
                      type="primary"
                      style={{
                        height: "45px",
                        backgroundColor: "#ff8c00",
                        borderColor: "#ff8c00",
                        color: "#fff",
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#000";
                        e.currentTarget.style.color = "#ff8c00";
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ff8c00";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Check out
                    </Button>
                  </div>
                </Drawer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
