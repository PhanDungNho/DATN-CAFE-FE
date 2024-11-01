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
} from "@ant-design/icons";
import axios from "axios";
import ProductService from "../../services/productService";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import { Badge, Button, Drawer, Image, Space, Table, Tag } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import { getCartDetailsByUsername } from "../../redux/actions/cartDetailAction";
import { ImBin } from "react-icons/im";
import { FaShoppingCart } from "react-icons/fa";
import withRouter from "../../helpers/withRouter";

// Custom hook để debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
function Header() {
  const [isLoading, setIsLoading] = useState(true);
  const stickerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce 300ms
  const navigate = useNavigate(); // Sử dụng hook để điều hướng trang

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const cartDetails = useSelector(
    (state) => state.cartDetailReducer.cartDetails
  );

  const totalItemsCount =
    cartDetails?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Gọi hàm tìm kiếm API khi debouncedSearchQuery thay đổi
  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setProducts([]); // Xóa kết quả tìm kiếm khi ô tìm kiếm trống
      setShowDropdown(false);
      return;
    }
    const handleSearch = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/products/search`, {
          params: { name: debouncedSearchQuery }
        });
        setProducts(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery]);

  // Hàm xử lý khi thay đổi nội dung tìm kiếm
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  // Hàm xử lý khi nhấn Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim() !== '') {
        navigate(`/shop?search=${searchQuery}`);
      } else {
        navigate('/shop');
      }
      setShowDropdown(false);
    }
  };

  const colors = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];

  useEffect(() => {
    setData(cartDetails || []);
    setIsLoading(false);
  }, [cartDetails]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Product",
      dataIndex: "productVariant",
      key: "productVariant",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={ProductService.getProductImageUrl(record.images[0].fileName)}
            style={{ width: 40, height: 40, marginRight: 10, borderRadius: 5 }}
          />
          <div>
            <div>{record.productVariant.product.name}</div>
            <div>{record.productVariant.size.name}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Topping",
      dataIndex: "cartDetailToppings",
      key: "toppings",
      render: (toppings) =>
        toppings && toppings.length > 0
          ? toppings.map((topping) => (
            <div key={topping.topping.id}>
              <Tag color={colors[Math.floor(Math.random() * colors.length)]}>
                {topping.topping.name} ({topping.topping.price}) x {topping.quantity}
              </Tag>
            </div>
          ))
          : "",
    },
    {
      title: "Price",
      dataIndex: ["productVariant", "price"],
      key: "price",
    },
    {
      title: "Subtotal",
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.username) {
      setIsLoggedIn(true);
      setUsername(user.username);

      dispatch(getCartDetailsByUsername(user.username));
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
  }, [dispatch, getCartDetailsByUsername]);

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

      <style>
        {`
    .search-dropdown {
      position: absolute;
      background-color: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      max-height: 200px;
      overflow-y: auto;
      width: 60%;
      z-index: 100;
      padding: 8px 0;
      margin-top: 6px;
    }

    .search-item {
      display: flex;
      align-items: center;
      padding: 4px 12px;
      cursor: pointer;
      font-size: 15px;
      color: #333;
      transition: background-color 0.2s ease, color 0.2s ease;
      border-bottom: 1px solid #f0f0f0;
      line-height: 1.2; /* Điều chỉnh line-height */
      
    }

    .search-item:last-child {
      border-bottom: none;
      padding: 0px 6px; /* Giảm padding */
      margin: 0; /* Giảm hoặc loại bỏ margin */
      font-size: 10px;
    }

    .search-item img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      margin-right: 12px;
    }

    .search-item h3 {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      color: #333;
      text-align: left;
      flex-grow: 1;
    }

    .search-item:hover {
      background-color: #f5f5f5;
      color: #0073e6;
    }
    .search-item:hover img {
      transform: scale(1.1); /* Zoom effect on hover */
      transition: transform 0.2s;
    }

    .search-item:hover h3 {
      color: #FFC107; /* Change text color on hover */
    }
  `}
      </style>

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
                    </li>
                    <li>
                      <a href="/shop">Products</a>
                    </li>
                    <li>
                      <input
                        type="text"
                        placeholder="Tìm sản phẩm theo tên..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                        onFocus={() => setShowDropdown(true)}
                        className="search-input"
                        style={{ display: "inline-block", marginLeft: 150 }}
                      />
                      {showDropdown && products.length > 0 && (
                        <div className="search-dropdown" style={{ marginLeft: 150 }}>
                          {products.map((product) => (
                            <Link
                              key={product.id}
                              to={`/single-product/${product.id}`}
                              className="search-item"
                              onClick={() => setShowDropdown(false)}
                            >
                              <h3 style={{ marginBottom: 5 }}>{product.name}</h3>
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                    <li>
                      <a className="shopping-cart" href="/cart">
                        <i className="fas fa-shopping-cart" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="shopping-cart"
                        onClick={showDrawer}
                      >
                        <Badge
                          size="small"
                          count={totalItemsCount}
                          offset={[15]}
                        >
                          <i
                            className="fas fa-shopping-cart"
                            style={{ color: "#ffff" }}
                          />
                        </Badge>
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
                  </ul>
                </nav>
                <a className="mobile-show search-bar-icon" href="#">
                  <i className="fas fa-search" />
                </a>
                <div className="mobile-menu" />
                {/* menu end */}
                <Drawer title="Shopping cart" onClose={onClose} open={open}>
                  <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 5 }}
                  />
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

const mapStateToProps = (state) => ({
  cartDetail: state.cartDetailReducer.cartDetail,
  cartDetails: state.cartDetailReducer.cartDetails,
});

const mapDispatchToProps = {
  getCartDetailsByUsername,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
