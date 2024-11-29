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
  Form,
  Select,
  Input,
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
  updateAddress,
  insertAddress,
} from "../../redux/actions/addressAction";
import { GoPlus } from "react-icons/go";
import {
  calculateShippingFee,
  fetchDistricts,
  fetchProvinces,
  fetchWards,
} from "../../services/constant";
import { getAccount } from "../../redux/actions/accountAction";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export const mapAddressToDto = (address) => ({
  id: address.id,
  active: address.active !== undefined ? address.active : true,
  cityCode: address.cityCode,
  districtCode: address.districtCode,
  fullAddress: address.fullAddress,
  isDefault: address.isDefault,
  street: address.street,
  wardCode: address.wardCode,
  account: address.account ? address.account.username : null,
});

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [wards, setWards] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const orderService = new OrderService();
  const paymentService = new PaymentService();
  const username = JSON.parse(localStorage.getItem("user"))?.username;

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
  const accountData = useSelector((state) => state.accountReducer.account);

  // State for selected row keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);
  const [shippingfee, setShippingfee] = useState(0);

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
      dispatch(getAccount(user.username));
    }
  }, [dispatch]);

  useEffect(() => {
    if (addresses) {
      setAddress(addresses);
    }
  }, [addresses]);

  // useEffect(() => {
  //   if (accountData) {
  //     setAccount(accountData);
  //   }
  // }, [accountData]);

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
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: "18%",
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
      message.warning("Please select product to pay.");
      return;
    }

    message.success("Payment has been made successfully!");
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
    message.info("Redirect to product page...");
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
        fullAddress: address.fullAddress,
      }));

    console.log("Full address is default: ", fullAddress);

    const stringFullAddress = `${fullAddress[0].fullAddress}`;
    console.log("Username", username);
    console.log("String full address: ", stringFullAddress);
    const order = {
      cashierId: "",
      totalAmount: grandTotal,
      phone: selectedItemsArray.customerPhone || "", // || phoneNumberInput
      orderStatus: currentPaymentMethod === "ONLINE" ? 0 : 1,
      paymentMethod: currentPaymentMethod,
      paymentStatus: currentPaymentMethod === "CASH" ? 1 : 0,
      active: false,
      shippingFee: shippingfee,
      orderType: 1,
      fullAddress: stringFullAddress,
      customerId: username || "test1",
      orderDetails: cartItems,
    };

    try {
      // Gọi insertOrder từ OrderService để gửi đơn hàng
      console.log("Order not yet:", order);
      const orderResponse = await orderService.insertOrder(order);
      console.log("Order response:", orderResponse.data);
      order.id = orderResponse.data.id;
      console.log("Order created:", order);

      console.log(order.id);
      // Chỉ thực hiện thanh toán nếu phương thức là ONLINE
      if (currentPaymentMethod === "ONLINE") {
        await handleOnlinePayment(order, grandTotal + shippingfee);
      } else {
        handleSuccess(order);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý đơn hàng:", error);
      message.error("An error occurred while processing the order. Please try again.");
    }
  };

  // // Hàm xử lý thanh toán online
  const handleOnlinePayment = async (order, totalAmount, index) => {
    try {
      const response = await paymentService.createPayment(
        totalAmount, // Số tiền thanh toán
        `Payment for order ID: ${order.id}`,
        "wala"
      );

      console.log("MOMO", response);

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
              message.error("Payment failed or canceled.");
            }
            console.log("first");
            console.log(order.id);
            console.log(order);
            console.log(index);
          }
        }, 1000); // Kiểm tra mỗi giây
      } else {
        throw new Error("Unable to generate payment URL.");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      message.error("An error occurred while creating the payment. Please try again.");
    }
  };

  // // Hàm xử lý thành công
  const handleSuccess = async (order) => {
    // message.success("Thanh toán thành công!");
    const selectedItemsIds = selectedItemsArray.map((item) => item.id);

    setIsModalSuccessOpen(true);

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
    const fetchDefaultAddressAndCalculateShipping = async () => {
      const defaultAddress = addresses.find((address) => address.isDefault);
      const numberOfItems = Object.keys(selectedItems).length;
      console.log("numberOfItems", numberOfItems);
      const weightT = 500 * numberOfItems;
      console.log("weightT", weightT);

      if (numberOfItems === 0) {
        setShippingfee(0);
        return;
      }

      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
        const body = {
          service_type_id: 2,
          to_district_id: defaultAddress.districtCode,
          to_ward_code: String(defaultAddress.wardCode),
          height: 20,
          length: 15,
          weight: weightT,
          width: 15,
          insurance_value: 0,
          cod_failed_amount: 0,
          coupon: null,
        };
        const shippingFee = await calculateShippingFee(body);
        setShippingfee(shippingFee.data.total);
      }
    };

    fetchDefaultAddressAndCalculateShipping();
  }, [addresses, selectedItems]);

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
    const selectedAddressId = e.target.value;
    setSelectedAddress(selectedAddressId);

    // Tìm địa chỉ tương ứng với ID đã chọn
    const selectedAddressObject = addresses.find(
      (address) => address.id === selectedAddressId
    );

    // In ra đối tượng địa chỉ đã chọn
    console.log("Selected Address Object: ", selectedAddressObject);
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

  const handleCancelAddress = () => {
    setIsModalOpen(true);
    setIsModalAddressOpen(false);
    setCurrentAddress(null);
  };

  //API Address
  useEffect(() => {
    const loadProvinces = async () => {
      const provincesData = await fetchProvinces();

      // Lọc để chỉ lấy dữ liệu của thành phố Cần Thơ
      const canTho = provincesData.find(
        (province) => province.ProvinceName === "Cần Thơ"
      );

      if (canTho) {
        setProvinces([canTho]); // Đặt provinces chỉ gồm "Cần Thơ"
        form.setFieldsValue({ cityCode: canTho.ProvinceID });
        handleProvinceChange(canTho.ProvinceID); // Gọi hàm để tải quận/huyện của Cần Thơ
      }
    };
    loadProvinces();
  }, []);

  const handleProvinceChange = async (value) => {
    setDistricts([]);
    setWards([]);
    if (value) {
      const districtData = await fetchDistricts(value);
      setDistricts(districtData);
      form.setFieldsValue({ districtCode: undefined, wardCode: undefined });
    }
  };

  const handleDistrictChange = async (value) => {
    setWards([]);
    if (value) {
      const wardData = await fetchWards(value);
      setWards(wardData);
      form.setFieldsValue({ wardCode: undefined });
    }
  };

  const handleWardChange = (value) => {};

  const onFinish = (values) => {
    const provinceName =
      provinces.find((p) => p.ProvinceID === values.cityCode)?.ProvinceName ||
      "Unknown City";
    const districtName =
      districts.find((d) => d.DistrictID === values.districtCode)
        ?.DistrictName || "Unknown District";
    const wardName =
      wards.find((w) => w.WardCode === values.wardCode)?.WardName ||
      "Unknown Ward";

    const fullAddressText = `${values.street}, ${wardName}, ${districtName}, ${provinceName}`;

    const addressDto = mapAddressToDto({
      ...currentAddress,
      ...values,
      fullAddress: fullAddressText,
    });

    if (currentAddress) {
      dispatch(updateAddress(currentAddress.id, addressDto)).then(() => {
        handleCancelAddress();
      });
    } else {
      addressDto.account = username;
      addressDto.active = true;

      dispatch(insertAddress(addressDto)).then(() => {
        handleCancelAddress();
      });
    }
  };

  const mapAddressWithNames = (address) => {
    const provinceName =
      provinces.find((p) => p.ProvinceID === address.cityCode)?.ProvinceName ||
      "Unknown City";
    const districtName =
      districts.find((d) => d.DistrictID === address.districtCode)
        ?.DistrictName || "Unknown District";
    const wardName =
      wards.find((w) => w.WardID === address.wardCode)?.WardName ||
      "Unknown District";

    return {
      ...address,
      cityName: provinceName,
      districtName: districtName,
      wardName: wardName,
      street: address.street || "",
    };
  };

  const handleEdit = async (address) => {
    setCurrentAddress(address);
    setIsModalAddressOpen(true);
    setIsModalOpen(false);

    if (address.cityCode) {
      const districtData = await fetchDistricts(address.cityCode);
      setDistricts(districtData);

      if (address.districtCode) {
        const wardData = await fetchWards(address.districtCode);
        setWards(wardData);

        console.log("Fetched Wards:", wardData);

        const selectedWard = wardData.find(
          (ward) => String(ward.WardCode) === String(address.wardCode)
        );

        if (selectedWard) {
          form.setFieldsValue({
            ...mapAddressWithNames(address),
            wardCode: selectedWard.WardCode,
            wardName: selectedWard.WardName,
          });
        } else {
          form.setFieldsValue({
            ...mapAddressWithNames(address),
            wardCode: undefined,
            wardName: undefined,
          });
        }
      }
    } else {
      form.setFieldsValue(mapAddressWithNames(address));
    }
  };

  //Payment Successfully
  const handleOkFinish = () => {
    setIsModalSuccessOpen(false);
    navigate("/manager/orders");
  };

  const handleCancelFinish = () => {
    setIsModalSuccessOpen(false);
  };

  const handleNewAddress = () => {
    setCurrentAddress(null);
    setIsModalAddressOpen(true);
    setIsModalOpen(false);
    form.resetFields();
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
            <ShopOutlined /> Home
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <ShoppingCartOutlined /> Shopping Cart
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
                {!addresses || addresses.length === 0 ? (
                  <>
                    <Title level={5} style={{ color: "red" }}>
                      This account does not have a shipping address!
                    </Title>
                    <Button
                      onClick={handleNewAddress}
                      type="dashed"
                      icon={<GoPlus />}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      New Address
                    </Button>
                  </>
                ) : (
                  addresses
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
                            {accountData.fullName} (+84) {accountData.phone}
                          </span>
                        </Row>
                        <Row>
                          <span style={{ marginRight: 20 }}>
                            {address.fullAddress}
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

                            {/* Modal list address */}
                            <Modal
                              title="Address"
                              open={isModalOpen}
                              onOk={handleOk}
                              onCancel={handleCancel}
                            >
                              <Radio.Group
                                onChange={onAddressChange}
                                value={selectedAddress}
                                style={{
                                  width: "100%",
                                  maxHeight: "300px",
                                  overflowY: "auto",
                                }}
                              >
                                {[...addresses]
                                  .sort(
                                    (a, b) =>
                                      (b.isDefault ? 1 : 0) -
                                      (a.isDefault ? 1 : 0)
                                  )
                                  .map((address) => (
                                    <Card
                                      key={address.id}
                                      hoverable
                                      style={{
                                        marginBottom: "10px",
                                        borderRadius: "8px",
                                        boxShadow:
                                          "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                      }}
                                      bodyStyle={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "15px 20px",
                                      }}
                                    >
                                      <Radio
                                        value={address.id}
                                        style={{ flex: "1" }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontWeight: "bold",
                                              color: "#333",
                                            }}
                                          >
                                            {accountData.fullName} (+84){" "}
                                            {accountData.phone}
                                          </span>
                                          <span style={{ color: "#666" }}>
                                            {address.fullAddress}
                                          </span>
                                        </div>
                                      </Radio>
                                      <Button
                                        size="small"
                                        type="link"
                                        onClick={() => handleEdit(address)}
                                        style={{
                                          color: "#1890ff",
                                          padding: 0,
                                          marginLeft: "15px",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        Update
                                      </Button>
                                    </Card>
                                  ))}
                              </Radio.Group>
                              <Divider />
                              <Button
                                onClick={handleNewAddress}
                                type="dashed"
                                icon={<GoPlus />}
                                style={{
                                  width: "100%",
                                  borderRadius: "8px",
                                  fontWeight: "bold",
                                }}
                              >
                                New Address
                              </Button>
                            </Modal>
                          </span>
                        </Row>
                      </div>
                    ))
                )}
                {/* Modal update address */}
                <Modal
                  title={currentAddress ? "Update address" : "Add address"}
                  open={isModalAddressOpen}
                  onCancel={handleCancelAddress}
                  footer={null}
                >
                  <Form
                    form={form}
                    name="update-address"
                    layout="vertical"
                    onFinish={onFinish}
                  >
                    <Form.Item
                      label="Province/City"
                      name="cityCode"
                      rules={[
                        {
                          required: true,
                          message: "Please select province/city!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Province/City"
                        onChange={handleProvinceChange}
                      >
                        {provinces.map((province) => (
                          <Option
                            key={province.ProvinceID}
                            value={province.ProvinceID}
                          >
                            {province.ProvinceName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="District/District"
                      name="districtCode"
                      rules={[
                        {
                          required: true,
                          message: "Please select District!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select District/District"
                        onChange={handleDistrictChange}
                        value={currentAddress?.districtCode}
                        disabled={!districts.length}
                      >
                        {districts.map((district) => (
                          <Option
                            key={district.DistrictID}
                            value={district.DistrictID}
                          >
                            {district.DistrictName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Ward/Commune"
                      name="wardCode"
                      rules={[
                        {
                          required: true,
                          message: "Please select ward/commune!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Ward/Commune"
                        onChange={handleWardChange}
                        value={currentAddress?.wardCode}
                        disabled={!wards.length}
                      >
                        {wards.map((ward) => (
                          <Option key={ward.WardCode} value={ward.WardCode}>
                            {ward.WardName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Detailed address"
                      name="street"
                      rules={[
                        {
                          required: true,
                          message: "Please enter detailed address!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      {currentAddress ? "Update Address" : "Add Address"}
                    </Button>
                  </Form>
                </Modal>

                {/* Modal finish */}
                <Modal
                  open={isModalSuccessOpen}
                  closable={false}
                  centered={true}
                  bodyStyle={{
                    textAlign: "center",
                    border: "1px solid #f6ffed", // Viền xanh nhạt
                    borderRadius: "8px", // Bo góc
                    padding: "20px", // Khoảng cách nội dung
                  }}
                  footer={[
                    <button
                      key="close"
                      onClick={handleCancelFinish}
                      style={{
                        backgroundColor: "#fff",
                        color: "#595959",
                        border: "1px solid #d9d9d9",
                        padding: "6px 16px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.borderColor = "#40a9ff")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.borderColor = "#d9d9d9")
                      }
                    >
                      Close
                    </button>,
                    <button
                      key="my-orders"
                      onClick={handleOkFinish} // Hàm xử lý khi bấm vào nút My Orders
                      style={{
                        backgroundColor: "#1677ff",
                        color: "#fff",
                        border: "1px solid #1677ff",
                        padding: "6px 16px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        marginLeft: "5px",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#1677ff")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#1677ff")
                      }
                    >
                      My Orders
                    </button>,
                  ]}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      }}
                    >
                      Success!
                    </h3>
                    <p
                      style={{
                        color: "#595959", // Màu xám cho nội dung
                        fontSize: "16px",
                        margin: "0",
                      }}
                    >
                      Order has been paid successfully.
                    </p>
                  </div>
                </Modal>
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
              <Title level={5}>
                Order value: {grandTotal.toLocaleString()} VNĐ
              </Title>
              <Title level={5}>
                Shipping Fee: {shippingfee.toLocaleString()} VNĐ
              </Title>
              <Title level={4}>
                Total: {(grandTotal + shippingfee).toLocaleString()} VNĐ
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
                 Buy more
                </Button>
                <Button
                  type="primary"
                  onClick={(value) => handleFinish(value)}
                  disabled={
                    selectedItemsArray.length === 0 || addresses.length === 0
                  }
                >
                 Pay
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
