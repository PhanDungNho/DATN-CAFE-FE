// Cart.jsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Breadcrumb,
  Table,
  Button,
  Row,
  Col,
  Image,
  Typography,
  Divider,
  message,
  Card,
  Tag,
  Radio,
  Modal,
} from "antd";
import { ShoppingCartOutlined, ShopOutlined } from "@ant-design/icons";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import ProductService from "../../services/productService";
import {
  clearSelectedItems,
  deleteCartDetail,
  getCartDetailsByUsername,
  removeCartDetail,
} from "../../redux/actions/cartDetailAction";
import { deleteOrderById } from "../../redux/actions/invoiceAction";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import PaymentService from "../../services/PaymentService";
import OrderService from "../../services/orderService";
import {
  getAddressByUsername,
  setIsDefaultCart,
} from "../../redux/actions/addressAction";
import { GoPlus } from "react-icons/go";

const { Content } = Layout;
const { Title } = Typography;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const orderService = new OrderService();
  const paymentService = new PaymentService();

  const cartDetails = useSelector(
    (state) => state.cartDetailReducer.cartDetails
  );

  const selectedItems = useSelector(
    (state) => state.cartDetailReducer.selectedItems
  );

  const selectedItemsArray = Object.values(selectedItems);

  const [data, setData] = useState(selectedItemsArray);
  const [address, setAddress] = useState([]);
  const addresses = useSelector((state) => state.addressReducer.addresses);

  // State for selected row keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const total = calculateTotalAmount(selectedItems);
    setGrandTotal(total);
  }, [selectedItems]);

  useEffect(() => {
    if (cartDetails && cartDetails.length > 0) {
      const dataWithKeys = cartDetails.map((item, index) => ({
        ...item,
        key: item.id || index,
      }));
      setData(dataWithKeys);
    } else {
      setData([]);
    }
  }, [cartDetails]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      dispatch(getAddressByUsername(user.username));
    }
  }, [dispatch]);

  useEffect(() => {
    if (addresses) {
      setAddress(addresses);
    }
  }, [addresses]);

  // Hàm xử lý khi thay đổi số lượng
  const handleQuantityChange = (value, key) => {
    const newCart = data.map((item) => {
      if (item.key === key) {
        const newTotal = value * item.price;
        return { ...item, quantity: value, total: newTotal };
      }
      return item;
    });
    setData(newCart);
  };

  const calculateTotalPrice = (item) => {
    const productPrice = item.productVariant.price;

    const toppingsPrice = item.cartDetailToppings.reduce((total, topping) => {
      return total + topping.topping.price * topping.quantity;
    }, 0);

    return productPrice + toppingsPrice;
  };

  const onChangePaymentMethod = ({ target: { value } }) => {
    console.log("Payment method: ", value);
    setPaymentMethod(value);
  };

  const options = [
    {
      label: "COD",
      value: "CASH",
    },
    {
      label: "MOMO",
      value: "ONLINE",
    },
  ];

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

  const columnsSelectedItems = [
    {
      title: "STT",
      key: "stt",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "ProductVariant",
      dataIndex: "productVariant",
      width: "38%",
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
      width: "28%",
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
      width: "18%",
      render: (price) => {
        return <span>{price.toLocaleString()} VND</span>;
      },
    },
    {
      title: "Total Price",
      key: "totalPrice",
      width: "18%",
      render: (_, record) => {
        const totalPrice = calculateTotalPrice(record);
        return <span>{totalPrice.toLocaleString()} VND</span>;
      },
    },
  ];

  const handleDelete = (id) => {
    const username = JSON.parse(localStorage.getItem("user"));
    dispatch(deleteCartDetail(id))
      .then(() => {
        dispatch(getCartDetailsByUsername(username.username));
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      });
  };

  // Hàm xử lý thanh toán
  const handleCheckout = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn sản phẩm để thanh toán.");
      return;
    }

    message.success("Đã thực hiện thanh toán thành công!");
    const remainingItems = data.filter(
      (item) => !selectedRowKeys.includes(item.key)
    );

    setData(remainingItems);
    console.log("RemainingItems: 1 ", remainingItems);
    console.log("RemainingItems: 2 ", data);
    setSelectedRowKeys([]);
  };

  // Hàm xử lý mua thêm
  const handleBuyMore = () => {
    // Implement navigation to the product listing page
    // For example, using react-router:
    // history.push('/products');
    message.info("Chuyển hướng đến trang sản phẩm...");
  };

  const calculateTotalAmount = (cartItems) => {
    return selectedItemsArray.reduce((total, item) => {
      // Tính tổng giá sản phẩm với số lượng
      let itemTotal = item.productVariant.price * item.quantity;

      // Tính tổng giá của các topping nếu có
      if (item.cartDetailToppings && item.cartDetailToppings.length > 0) {
        const toppingsTotal = item.cartDetailToppings.reduce((sum, topping) => {
          return sum + topping.topping.price * topping.quantity;
        }, 0);

        // Cộng giá topping vào tổng giá của sản phẩm
        itemTotal += toppingsTotal;
      }

      // Cộng giá của sản phẩm (bao gồm topping) vào tổng giá trị đơn hàng
      return total + itemTotal;
    }, 0);
  };

  const handleFinish = async (values) => {
    // Lấy phương thức thanh toán từ orders cho tab hiện tại
    const currentPaymentMethod = paymentMethod;

    console.log("Payment selectedItems", selectedItemsArray);

    const cartItems = selectedItemsArray.map((item) => ({
      productVariant: { id: item.productVariant.id },
      quantity: item.quantity,
      momentPrice: item.productVariant.price,
      note: item.note,
      totalPrice: calculateTotalPrice(item),
      orderDetailToppings: item.cartDetailToppings.map((topping) => ({
        topping: {
          id: topping.topping.id,
          name: topping.topping.name,
          price: topping.topping.price,
        },
        quantity: topping.quantity,
        momentPrice: topping.topping.price,
      })),
    }));

    console.log("CartItems", cartItems);

    const fullAddress = addresses
      .filter((address) => address.isDefault)
      .map((address) => ({
        fullName: address.account.fullName,
        phone: address.account.phone,
        street: address.street,
        cityCode: address.cityCode,
        districtCode: address.districtCode,
        wardCode: address.wardCode,
        fullAddress: address.fullAddress,
      }));

    console.log("Full address is default: ", fullAddress);

    const stringFullAddress = `${fullAddress[0].fullName}, ${fullAddress[0].phone}, ${fullAddress[0].fullAddress}, ${fullAddress[0].street}, ${fullAddress[0].districtCode}, ${fullAddress[0].wardCode}, ${fullAddress[0].cityCode}`;
    console.log("String full address: ", stringFullAddress);

    const order = {
      cashierId: JSON.parse(localStorage.getItem("user")).username,
      totalAmount: grandTotal,
      phone: selectedItemsArray.customerPhone || "", // || phoneNumberInput
      orderStatus: currentPaymentMethod === "ONLINE" ? 0 : 1,
      paymentMethod: currentPaymentMethod,
      paymentStatus: currentPaymentMethod === "CASH" ? 1 : 0,
      active: false,
      shippingFee: 0,
      orderType: 0,
      fullAddress: stringFullAddress,
      customerId: selectedItemsArray.customerId || "test1",
      orderDetails: cartItems,
    };

    try {
      // Gọi insertOrder từ OrderService để gửi đơn hàng
      console.log("Order not yet:", order);
      const orderResponse = await orderService.insertOrder(order);
      console.log("Order response:", orderResponse.data);
      order.id = orderResponse.data.id;
      console.log("Order created:", order);
      // Chỉ thực hiện thanh toán nếu phương thức là ONLINE
      if (currentPaymentMethod === "ONLINE") {
        await handleOnlinePayment(order, grandTotal);
      } else {
        handleSuccess(order);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý đơn hàng:", error);
      message.error("Đã xảy ra lỗi khi xử lý đơn hàng. Vui lòng thử lại.");
    }
  };

  // // Hàm xử lý thanh toán online
  const handleOnlinePayment = async (order, totalAmount, index) => {
    try {
      const response = await paymentService.createPayment(
        totalAmount, // Số tiền thanh toán
        `Thanh toán cho đơn hàng ID: ${order.id}`,
        "d"
      );

      if (response && response.data && response.data.payUrl) {
        // Lưu thông tin giao dịch
        await paymentService.insertTransaction({
          order: { id: order.id },
          payUrl: response.data.payUrl,
        });

        console.log("Payment URL created:", response);
        const paymentWindow = window.open(
          response.data.payUrl,
          "_blank",
          "width=800,height=600"
        );

        const checkPaymentStatus = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkPaymentStatus);

            // Kiểm tra trạng thái thanh toán từ localStorage
            const paymentStatus = localStorage.getItem(
              `payment_status_${order.id}`
            );

            if (paymentStatus === "success") {
              handleSuccess(order, index); // Đóng form bán hàng
            } else {
              dispatch(deleteOrderById(order.id));
              message.error("Thanh toán thất bại hoặc bị hủy.");
            }
            console.log("first");
            console.log(order.id);
            console.log(order);
            console.log(index);
          }
        }, 1000); // Kiểm tra mỗi giây
      } else {
        throw new Error("Không thể tạo URL thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      message.error("Đã xảy ra lỗi khi tạo thanh toán. Vui lòng thử lại.");
    }
  };

  // // Hàm xử lý thành công
  const handleSuccess = async () => {
    message.success("Thanh toán thành công!");
    const selectedItemsIds = selectedItemsArray.map((item) => item.id);

    try {
      for (const id of selectedItemsIds) {
        await dispatch(removeCartDetail(id));
      }

      const username = JSON.parse(localStorage.getItem("user"));
      dispatch(getCartDetailsByUsername(username.username));

      dispatch(clearSelectedItems());
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error removing items after payment:", error);
    }
  };

  useEffect(() => {
    const defaultAddress = addresses.find((address) => address.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.id);
    }
  }, [addresses]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onAddressChange = (e) => {
    setSelectedAddress(e.target.value);
    console.log("Onchange address: ", e.target.value);
  };

  const handleOk = () => {
    dispatch(setIsDefaultCart(selectedAddress));
    console.log("Address saved:", selectedAddress);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    const defaultAddress = addresses.find((address) => address.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.id);
    }
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <Header />
      {/* Hero Area */}
      <div className="hero-area hero-bg-1">
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
      {/* Breadcrumb Section */}
      <Content
        style={{
          padding: "50px",
          marginTop: "20px",
          background: "#f9f9f9",
          minHeight: "calc(100vh - 64px - 100px)",
        }}
      >
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item href="/">
            <ShopOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <ShoppingCartOutlined /> Giỏ hàng
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <div>
                <Title level={4} style={{ fontSize: "16px", color: "#333" }}>
                  Order Summary
                </Title>
                <Table
                  columns={columnsSelectedItems}
                  dataSource={selectedItemsArray}
                  pagination={false}
                  scroll={{ y: 400 }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
                marginBottom: "16px",
                borderRadius: "8px",
              }}
            >
              <Title
                level={4}
                style={{
                  fontSize: "16px",
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CiLocationOn
                  style={{ color: "red", fontSize: 20, marginRight: 8 }}
                />{" "}
                Address
              </Title>
              <div
                style={{
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                }}
              >
                {addresses
                  .filter((address) => address.isDefault)
                  .map((address) => (
                    <div
                      key={address.id}
                      style={{
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Row>
                        <span style={{ fontWeight: "bold", marginRight: 20 }}>
                          {address.account.fullName} (+84){" "}
                          {address.account.phone}
                        </span>
                      </Row>
                      <Row>
                        <span style={{ marginRight: 20 }}>
                          {address.fullAddress}, District {address.districtCode}
                          , City {address.cityCode}
                        </span>
                        <span>
                          <Button
                            color="default"
                            size={"small"}
                            type="link"
                            onClick={showModal}
                            style={{
                              padding: 0,
                              color: "#1890ff",
                              textDecoration: "underline",
                            }}
                          >
                            Change Address
                          </Button>
                          <Modal
                            title="Address"
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                          >
                            <Radio.Group
                              onChange={onAddressChange}
                              value={selectedAddress}
                            >
                              {addresses.map((address) => (
                                <div
                                  key={address.id}
                                  style={{
                                    padding: "10px",
                                    marginBottom: "10px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "5px",
                                    backgroundColor: "#f9f9f9",
                                    transition: "background-color 0.3s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#e6f7ff";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#f9f9f9";
                                  }}
                                >
                                  <Radio value={address.id}>
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        marginRight: "20px",
                                      }}
                                    >
                                      {address.account.fullName} (+84){" "}
                                      {address.account.phone}
                                    </span>
                                    <span
                                      style={{
                                        color: "#555",
                                        marginRight: "20px",
                                      }}
                                    >
                                      {address.fullAddress}, District{" "}
                                      {address.districtCode}, City{" "}
                                      {address.cityCode}
                                    </span>
                                  </Radio>
                                </div>
                              ))}
                            </Radio.Group>
                            <Divider />
                            <Button
                              onClick={() => navigate("/manager/address")}
                              type="dashed"
                              style={{ marginBottom: 16 }}
                            >
                              <GoPlus /> New address
                            </Button>
                          </Modal>
                        </span>{" "}
                      </Row>
                    </div>
                  ))}
              </div>
            </Card>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
                borderRadius: "8px",
              }}
            >
              <Title level={4} style={{ marginBottom: 10, color: "#333" }}>
                <Row style={{ fontSize: 16 }}>
                  Payment Method:
                  <Row style={{ marginLeft: 10 }}>
                    <Radio.Group
                      options={options}
                      onChange={onChangePaymentMethod}
                      value={paymentMethod}
                      optionType="button"
                      buttonStyle="solid"
                      style={{ marginLeft: 10 }}
                      className="custom-radio-group-paymentMethod"
                    />
                  </Row>{" "}
                </Row>
              </Title>
              <Divider />
              <Title level={4}>
                Tổng tiền: {grandTotal.toLocaleString()} VNĐ
              </Title>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "right",
                }}
              >
                <Button
                  type="default"
                  style={{ marginRight: 10 }}
                  onClick={handleBuyMore}
                >
                  Mua thêm
                </Button>
                <Button
                  type="primary"
                  onClick={(value) => handleFinish(value)}
                  disabled={selectedItemsArray.length === 0}
                >
                  Thanh toán
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Cart;
