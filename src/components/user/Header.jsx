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
import {
  Badge,
  Button,
  Drawer,
  Image,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  deleteCartDetail,
  getCartDetailsByUsername,
  setSelectedItems,
} from "../../redux/actions/cartDetailAction";
import { ImBin } from "react-icons/im";
import { FaShoppingCart } from "react-icons/fa";
import withRouter from "../../helpers/withRouter";
import ProductService from "../../services/productService";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
  const stickerRef = useRef(null); // useRef to reference the sticker element
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce 300ms
  const navigate = useNavigate(); // Sử dụng hook để điều hướng trang
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

  const handleKeywordClick = async (keyword) => {
    try {
      // Gọi API tìm kiếm sản phẩm theo từ khóa
      const response = await axios.get(`http://localhost:8081/api/v1/products/search`, {
        params: { name: keyword },
      });

      if (response.data.length > 0) {
        // Nếu tìm thấy sản phẩm, điều hướng đến trang chi tiết của sản phẩm đầu tiên
        const product = response.data[0]; // Lấy sản phẩm đầu tiên trong danh sách
        navigate(`/single-product/${product.id}`);
      } else {
        // Nếu không tìm thấy sản phẩm, hiển thị thông báo hoặc xử lý lỗi
        console.warn("Không tìm thấy sản phẩm phù hợp!");
      }
    } catch (error) {
      console.error("Error searching for product:", error);
    }
  };
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
  const cartDetails = useSelector(
    (state) => state.cartDetailReducer.cartDetails
  );

  const totalItemsCount =
    cartDetails?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalCart, setTotalCart] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

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
                {topping.topping.name} ({topping.topping.price}) x{" "}
                {topping.quantity}
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
      title: "Remove",
      key: "remove",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="custom-delete-button"
              variant="filled"
              style={{ border: "none" }}
            >
              <ImBin />
            </Button>
          </Popconfirm>
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

  useEffect(() => {
    if (cartDetails && cartDetails.length > 0) {
      const dataWithKeys = cartDetails.map((item) => ({
        ...item,
        key: item.id,
      }));
      setData(dataWithKeys);
    } else {
      setData([]);
    }
    setIsLoading(false);
  }, [cartDetails]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    window.location.href = "/login";
  };

  const handleDelete = (id) => {
    dispatch(deleteCartDetail(id))
      .then(() => {
        dispatch(getCartDetailsByUsername(username));
      })
      .catch((error) => {
        console.error("Error deleting item from cart:", error);
      });
  };
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200); // Đợi để tránh mất kết quả khi nhấp vào
  };


  const handleCheckout = () => {
    const selectedItems = data.filter((item) =>
      selectedRowKeys.includes(item.key)
    );

    const newTotalCart = selectedItems.reduce((acc, item) => {
      const itemTotal = item.quantity * item.productVariant.price;

      const toppingTotal = item.cartDetailToppings.reduce(
        (toppingAcc, topping) =>
          toppingAcc + topping.quantity * topping.topping.price,
        0
      );

      return acc + itemTotal + toppingTotal;
    }, 0);

    const newGrandTotal = newTotalCart > 0 ? newTotalCart : 0;
    setTotalCart(newTotalCart);
    setGrandTotal(newGrandTotal);

    // Chuyển đổi selectedItems thành object
    const selectedItemsObject = selectedItems.reduce((acc, item) => {
      acc[item.id] = { ...item }; // Hoặc chỉ lấy các thuộc tính cần thiết
      return acc;
    }, {});

    // Dispatch action để lưu selectedItems vào Redux
    dispatch(setSelectedItems(selectedItemsObject));

    console.log("selectedItems", selectedItemsObject);
    console.log("newGrandTotal", newGrandTotal);
    console.log("newTotalCart", newTotalCart);

    // Chuyển hướng đến trang giỏ hàng
    navigate("/cart");
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
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
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  width: 180px;
  z-index: 1000;
  padding: 8px 0;
  text-align: left;
  display: block; /* Đảm bảo mỗi item là block */

  text-align: left; /* Canh trái nội dung */
  padding: 5px 10px; /* Khoảng cách padding */

}
.search-input{
width: 180px;
}

.search-item {
  padding: 8px 12px; /* Thêm khoảng cách để dễ nhìn hơn */
  align-items: center;
  cursor: pointer;
  font-size: 12px;
  color: #333;
  transition: background-color 0.2s ease, color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  display: block; /* Đảm bảo mỗi item là block */
  min-height: 40px; /* Chiều cao tối thiểu (có thể chỉnh) */
  line-height: 40px; /* Canh giữa theo chiều dọc */
  white-space: nowrap; /* Ngăn xuống dòng giữa các từ trong cùng 1 tên sản phẩm */
  text-align: left; /* Canh trái nội dung */
  padding: 5px 10px; /* Khoảng cách padding */
  border-bottom: 1px solid #ddd; /* Dòng phân cách (tuỳ chọn) */
  width: 100%;

}

.search-item:hover {
  background-color: #d6c5b6; /* Đổi màu nền khi hover */
  color: #fff; /* Đổi màu chữ thành trắng (tuỳ chọn) */
}

.popular-keywords-container {
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%; /* Đảm bảo container co giãn theo bố cục */
  max-width: 400px; /* Đặt giới hạn chiều rộng tối đa */
  margin: 0 auto; /* Canh giữa nếu cần */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.popular-keywords-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  text-align: left;
}

.popular-keywords {
  display: flex;
  flex-wrap: wrap; /* Cho phép xuống dòng khi từ khóa quá dài */
  gap: 8px; /* Khoảng cách giữa các từ khóa */
}

.keyword {
  background-color: #F28123; /* Màu nền xanh lá */
  color: #fff; /* Màu chữ trắng */
  padding: 6px 12px; /* Khoảng cách trong từ khóa */
  font-size: 14px; /* Kích thước chữ vừa đủ */
  border-radius: 20px; /* Làm tròn từ khóa */
  white-space: nowrap; /* Tránh xuống dòng trong mỗi từ khóa */
  cursor: pointer; /* Thêm hiệu ứng chuột */
  transition: all 0.3s ease; /* Hiệu ứng hover */
}

.keyword:hover {
  background-color: #F28125; /* Màu nền khi hover */
  transform: scale(1.05); /* Tăng kích thước nhẹ khi hover */
}

@media screen and (max-width: 480px) {
  .popular-keywords-container {
    max-width: 90%; /* Đảm bảo giao diện đẹp trên mobile */
  }

  .keyword {
    font-size: 12px; /* Kích thước chữ nhỏ hơn trên màn hình nhỏ */
    padding: 4px 10px;
  }
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
                  <Link to="/">
                    <img src="/assets/img/logo2.png" alt="" />
                  </Link>
                </div>
                {/* logo */}
                {/* menu start */}
                <nav className="main-menu">
                  <ul>
                    <li className="current-list-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/about">About</Link>
                    </li>
                    <li>
                      <Link to="#">Pages</Link>
                    </li>
                    <li>
                      <Link to="/shop">Products</Link>
                    </li>
                    <li>
                      <li>
                        <input
                          type="text"
                          placeholder="Find products by name..."
                          value={searchQuery}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          onFocus={() => setShowDropdown(true)}
                          onBlur={handleBlur} // Đóng dropdown khi mất focus
                          className="search-input"
                        />
                        {showDropdown && (
                          <div className="search-dropdown">
                            {products.length > 0 ? (
                              products.map((product) => (
                                <Link
                                  key={product.id}
                                  to={`/single-product/${product.id}`}
                                  className="search-item"
                                  onClick={() => setShowDropdown(false)}
                                >
                                  <h4 style={{ fontSize: '16.3px' }}>{product.name}</h4>
                                </Link>
                              ))
                            ) : (
                              <div className="search-item">Product not found!</div>
                            )}
                            {/* Hiển thị từ khóa phổ biến */}

                          </div>
                        )}
                      </li>
                      <li>
                        <a className="mobile-hide search-bar-icon" href="#">
                          <i className="fas fa-search" />
                        </a>
                      </li>
                      <li>
                        <a className="shopping-cart" onClick={showDrawer}>
                          <Badge
                            size="small"
                            count={totalItemsCount}
                            offset={[10, -3]}
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
                              <Link to="/login">
                                <LoginOutlined style={{ marginRight: "8px" }} />{" "}
                                Login
                              </Link>
                              <Link to="/register">
                                <UserAddOutlined
                                  style={{ marginRight: "8px" }}
                                />{" "}
                                Register
                              </Link>
                              <Link to="/forgotpassword">
                                <KeyOutlined style={{ marginRight: "8px" }} />{" "}
                                Forgot Password
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link to="/manager/*">
                                <IdcardOutlined
                                  style={{ marginRight: "8px" }}
                                />{" "}
                                Account
                              </Link>
                              <Link to="/manager/*">
                                <ShoppingOutlined
                                  style={{ marginRight: "8px" }}
                                />{" "}
                                Order
                              </Link>
                              {/* Hiện admin nếu user có vai trò admin */}
                              {isLoggedIn &&
                                JSON.parse(
                                  localStorage.getItem("user")
                                )?.roles.includes("ROLE_ADMIN") && (
                                  <Link to="/admin">
                                    <TeamOutlined
                                      style={{ marginRight: "8px" }}
                                    />{" "}
                                    Admin
                                  </Link>
                                )}
                              <Link to="/" onClick={handleLogout}>
                                <LogoutOutlined
                                  style={{ marginRight: "8px" }}
                                />{" "}
                                Log out
                              </Link>
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
                <Drawer title="Shopping cart" onClose={onClose} open={open} className="drawerTable">
                  <Table
                    rowSelection={rowSelection}
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
                      onClick={handleCheckout}
                      disabled={selectedRowKeys.length === 0}
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
  selectedItems: state.cartDetailReducer.selectedItems,
});

const mapDispatchToProps = {
  getCartDetailsByUsername,
  deleteCartDetail,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
