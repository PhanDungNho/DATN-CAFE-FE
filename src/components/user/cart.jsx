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
  Space,
  Popconfirm,
  Radio,
} from "antd";
import { ShoppingCartOutlined, ShopOutlined } from "@ant-design/icons";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import ProductService from "../../services/productService";
import {
  deleteCartDetail,
  getCartDetailsByUsername,
  removeCartDetail,
} from "../../redux/actions/cartDetailAction";
import { ImBin } from "react-icons/im";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import OrderService from "../../services/orderService";
import AccountService from "../../services/accountService";
import ToppingService from "../../services/toppingService";
import PaymentService from "../../services/PaymentService";

const { Content } = Layout;
const { Title } = Typography;

const Cart = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  // const [orders, setOrders] = useLocalStorage("orders", [
  //   { cart: [], customerName: "Đơn 1", customerId: "", paymentMethod: "CASH" },
  // ]);

  const productService = new ProductService();
  const accountService = new AccountService();
  const toppingService = new ToppingService();
  const orderService = new OrderService();
  const paymentService = new PaymentService();

  const cartDetails = useSelector(
    (state) => state.cartDetailReducer.cartDetails
  );

  const [data, setData] = useState(cartDetails);

  // State for selected row keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // State for total calculations
  const [totalCart, setTotalCart] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Effect to recalculate totals whenever selectedRowKeys or cartItems change
  useEffect(() => {
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
    setSelectedItems(selectedItems);

    console.log("selectedItems", selectedItems);
    console.log("newGrandTotal", newGrandTotal);
    console.log("newTotalCart", newTotalCart);
  }, [selectedRowKeys, data]);

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

  const handleRemove = (id) => {
    // Xóa item khỏi selectedItems
    const updatedSelectedItems = selectedItems.filter((item) => item.id !== id);
    setSelectedItems(updatedSelectedItems);

    // Cập nhật selectedRowKeys để bỏ chọn mục bị xóa
    const updatedSelectedRowKeys = selectedRowKeys.filter((key) => key !== id);
    setSelectedRowKeys(updatedSelectedRowKeys);

    // Nếu cần, có thể cập nhật lại total cart và grand total
    const newTotalCart = updatedSelectedItems.reduce((acc, item) => {
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

    console.log("Item removed:", id);
    console.log("Updated selectedItems:", updatedSelectedItems);
    console.log("Updated total cart:", newTotalCart);
    console.log("Updated grand total:", newGrandTotal);
  };

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

  // Hàm xử lý xóa sản phẩm
  // const handleRemove = (key) => {
  //   const newCart = data.filter((item) => item.key !== key);
  //   data(newCart);
  //   message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
  //   // Also remove from selected if it was selected
  //   setSelectedRowKeys((prevKeys) => prevKeys.filter((k) => k !== key));
  // };

  // Hàm xử lý khi chọn các sản phẩm
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
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

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
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

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Product",
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
      width: "28%",
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
      width: "18%",
      key: "price",
      render: (price) => <span>{price.toLocaleString()} VND</span>,
    },
    {
      title: "Remove",
      width: "18%",
      key: "Remove",
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
    {
      title: "Remove",
      width: "18%",
      key: "Remove",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="custom-delete-button"
            variant="filled"
            style={{ border: "none" }}
            onClick={() => handleRemove(record.id)}
          >
            <ImBin />
          </Button>
        </Space>
      ),
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

  const handleFinish = async (values) => {
    // Lấy phương thức thanh toán từ orders cho tab hiện tại
    // const currentPaymentMethod = orders[index].paymentMethod;
    const currentPaymentMethod = paymentMethod;

    console.log("Payment selectedItems", selectedItems);

    const cartItems = selectedItems.map((item) => ({
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

    const order = {
      cashierId: JSON.parse(localStorage.getItem("user")).username,
      totalAmount: grandTotal,
      phone: selectedItems.customerPhone || "", // || phoneNumberInput
      orderStatus: currentPaymentMethod === "ONLINE" ? 0 : 1,
      paymentMethod: currentPaymentMethod,
      paymentStatus: currentPaymentMethod === "CASH" ? 1 : 0,
      active: false,
      shippingFee: 0,
      orderType: 0,
      fullAddress: null,
      customerId: selectedItems.customerId || "test1",
      orderDetails: cartItems,
    };

    // console.log("Order", order);

    try {
      // Gọi insertOrder từ OrderService để gửi đơn hàng
      console.log("Order not yet:", order);
      const orderResponse = await orderService.insertOrder(order);
      console.log("Order response:", orderResponse.data);
      order.id = orderResponse.data.id;
      console.log("Order created:", orderResponse);

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
  const handleOnlinePayment = async (order, totalAmount) => {
    try {
      const response = await paymentService.createPayment(
        totalAmount, // Số tiền thanh toán
        `Thanh toán cho đơn hàng ID: ${order.id}`
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
              handleSuccess(order); // Đóng form bán hàng
              // removeCustomer(index.toString());
            } else {
              message.error("Thanh toán thất bại hoặc bị hủy.");
            }
            console.log("first");
            console.log(order.id);
            console.log(order);
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
    const selectedItemsIds = selectedItems.map((item) => item.id);

    try {
      for (const id of selectedItemsIds) {
        await dispatch(removeCartDetail(id)); // Xóa từng mục một
      }

      const username = JSON.parse(localStorage.getItem("user"));
      dispatch(getCartDetailsByUsername(username.username));

      setSelectedItems([]);
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error removing items after payment:", error);
    }
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
          minHeight: "calc(100vh - 64px - 100px)", // Adjust minHeight based on Header and Footer heights
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
          <Col xs={24} lg={24}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                bordered={false}
                scroll={{ y: 400 }}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xs={24} lg={24} style={{ marginTop: 50 }}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <Title
                level={4}
                style={{
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                <CiLocationOn
                  style={{ color: "red", fontSize: 20, marginBottom: 5 }}
                />{" "}
                Address
              </Title>
              <div
                style={{
                  paddingLeft: 20,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold", marginRight: 20 }}>
                  Phan Dũng Nhớ (+84) 387023626
                </span>
                <span style={{ marginRight: 20 }}>
                  Khóm 6, Phường 1, Ngã Năm, Sóc Trăng
                </span>
                <span>
                  <Button
                    color="default"
                    size={"small"}
                    type="link"
                    onClick={() => navigate("/manager/address")}
                  >
                    Change Address
                  </Button>
                </span>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={24}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <div>
                {/*
                <Title level={4} style={{ fontSize: "16px", color: "#333" }}>
                  Tổng tiền giỏ hàng:{" "}
                  <span>{totalCart.toLocaleString()} VNĐ</span>
                </Title>
                <Title level={4} style={{ fontSize: "16px", color: "#333" }}>
                  Phí giao hàng:{" "}
                  <span>
                    {totalCart > 0 ? shippingFee.toLocaleString() : "0 VNĐ"}
                  </span>
                </Title>
               */}
                <Title level={4} style={{ fontSize: "16px", color: "#333" }}>
                  Order Summary
                </Title>
                <Table
                  columns={columnsSelectedItems}
                  dataSource={selectedItems}
                  pagination={false}
                  scroll={{ y: 400 }}
                />
                {selectedRowKeys.length > 0 && (
                  <div style={{ marginTop: "10px", color: "#888" }}>
                    You have selected {selectedRowKeys.length} products
                  </div>
                )}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={24}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <Title
                level={4}
                style={{
                  marginBottom: 10,
                  color: "#333",
                }}
              >
                <Row style={{ fontSize: 16 }}>
                  Payment Method:
                  <Row style={{ marginLeft: 10 }}>
                    <Radio.Group
                      options={options}
                      onChange={onChangePaymentMethod}
                      value={paymentMethod}
                      optionType="button"
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
                  disabled={selectedRowKeys.length === 0}
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
