import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Input,
  Button,
  Card,
  message,
  Form,
  Table,
  Tabs,
  InputNumber,
  Select,
  // Checkbox,
} from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ProductService from "../../../services/productService";
import AccountService from "../../../services/accountService";
import ToppingService from "../../../services/toppingService";
import OrderService from "../../../services/orderService";

const { Content, Footer } = Layout;
const { Search } = Input;
const { Option } = Select;

const CounterForm = () => {
  const [data, setData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [orders, setOrders] = useState([
    { cart: [], customerName: "Đơn 1", customerId: "" }, // Đơn hàng đầu tiên
  ]);
  const [activeTab, setActiveTab] = useState("0");
  const [selectedVariants, setSelectedVariants] = useState({}); // Trạng thái lưu các biến thể được chọn riêng cho từng sản phẩm
  const [accounts, setAccounts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [selectedToppings, setSelectedToppings] = useState({}); // State lưu topping đã chọn cho mỗi sản phẩm

  const productService = new ProductService();
  const accountService = new AccountService();
  const toppingService = new ToppingService();
  const orderService = new OrderService();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        setData(response.data);

        // Thiết lập giá trị mặc định cho selectedVariants
        const initialSelectedVariants = {};
        response.data.forEach((product) => {
          if (product.productVariants.length > 0) {
            initialSelectedVariants[product.id] = product.productVariants[0].id; // Chọn size đầu tiên
          }
        });
        setSelectedVariants(initialSelectedVariants); // Cập nhật state

        // Tải dữ liệu giỏ hàng từ Local Storage
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
          try {
            const parsedOrders = JSON.parse(storedOrders);
            setOrders(parsedOrders);
          } catch (error) {
            console.error("Lỗi khi lấy dữ liệu từ localStorage:", error);
            // Xử lý lỗi, ví dụ: Hiển thị thông báo lỗi cho người dùng
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        message.error("Không thể lấy sản phẩm.");
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await accountService.getAccounts();
        setAccounts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy tài khoản:", error);
        message.error("Không thể lấy tài khoản.");
      }
    };
    const fetchToppings = async () => {
      try {
        const response = await toppingService.getToppings();
        setToppings(response.data); // response.data là array các đối tượng topping
        console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy topping:", error);
        message.error("Không thể lấy topping.");
      }
    };

    fetchProducts();
    fetchToppings();
    fetchAccounts();
  }, []);

  const handleToppingChange = (productId, toppingId, value) => {
    setSelectedToppings((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [toppingId]: value,
      },
    }));
  };

  const handleAddToCart = (variantId, productId) => {
    const selectedVariant = data
      .flatMap((product) =>
        product.productVariants.map((variant) => ({
          ...variant,
          productName: product.name,
        }))
      )
      .find((variant) => variant.id === variantId);

    if (selectedVariant) {
      const newOrders = [...orders];
      const currentCart = newOrders[activeTab].cart;

      // Tìm topping đã chọn cho sản phẩm
      const toppingsWithQuantity = Object.entries(
        selectedToppings[productId] || {}
      )
        .filter(([toppingId, quantity]) => quantity > 0)
        .map(([toppingId, quantity]) => {
          // Tìm topping dựa trên id trong toppings
          const foundTopping = toppings.find(
            (t) => t.id === parseInt(toppingId)
          );
          return foundTopping
            ? {
                id: foundTopping.id,
                name: foundTopping.name,
                price: foundTopping.price,
                quantity: quantity,
              }
            : null;
        })
        .filter((topping) => topping !== null);

      // Tạo sản phẩm mới với topping đã chọn
      const toppingPrice = toppingsWithQuantity.reduce(
        (total, topping) => total + topping.price * topping.quantity,
        0
      );

      const newItem = {
        ...selectedVariant,
        quantity: 1, // Khởi tạo số lượng 1
        toppings: toppingsWithQuantity,
        toppingPrice: toppingPrice, // Tính toán giá topping
        amount: selectedVariant.price + toppingPrice, // Tính toán tổng giá
      };

      // Thêm sản phẩm mới vào giỏ hàng
      currentCart.push(newItem);

      // Cập nhật orders và localStorage
      setOrders(newOrders);
      localStorage.setItem("orders", JSON.stringify(newOrders));

      message.success(
        `${selectedVariant.productName} (Size ${selectedVariant.size.name}) đã được thêm vào giỏ hàng!`
      );
    } else {
      message.error("Không tìm thấy sản phẩm này.");
    }
  };

  const handleSearch = (value) => {
    console.log("Tìm kiếm:", value);
  };
  const handlePhoneNumberChange = (e, index) => {
    const enteredPhone = e.target.value;
    setPhoneNumberInput(enteredPhone);

    const foundAccount = accounts.find(
      (account) => account.phone === enteredPhone
    );

    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      if (foundAccount) {
        message.success("Đã nhập đúng số điện thoại!");
        updatedOrders[index].customerName = foundAccount.fullname;
        updatedOrders[index].customerPhone = enteredPhone;
        updatedOrders[index].customerId = foundAccount.username;
      } else {
        updatedOrders[index].customerName = ""; // Reset tên khách hàng nếu không tìm thấy
        updatedOrders[index].customerPhone = ""; // Reset số điện thoại nếu không tìm thấy
      }
      return updatedOrders;
    });
  };

  const handleFinish = async (values, index) => {
    const cartItems = orders[index].cart.map((item) => ({
      productvariant: { id: item.id },
      quantity: item.quantity,
      momentprice: item.price,
      note: item.note,
      totalPrice:
        item.price * item.quantity +
        item.toppings.reduce(
          (total, topping) => total + topping.price * topping.quantity,
          0
        ),
      orderdetailtoppings: item.toppings.map((topping) => ({
        topping: {
          id: topping.id,
          name: topping.name,
          price: topping.price,
        },
        quantity: topping.quantity,
        momentprice: topping.price,
      })),
    }));

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    const order = {
      cashierid: JSON.parse(localStorage.getItem("user")).username,
      totalamount: totalAmount,
      phone: orders[index].customerPhone || phoneNumberInput, // Sử dụng customerPhone của đơn hàng hoặc phoneNumberInput
      status: "PAID",
      paymentmethod: paymentMethod,
      active: true,
      shippingfee: 0,
      ordertype: 0,
      fulladdresstext: null,
      customerid: orders[index].customerId || "test1",
      orderdetails: cartItems,
    };

    try {
      // Gọi insertOrder từ OrderService để gửi đơn hàng
      await orderService.insertOrder(order);

      message.success(
        `Thanh toán thành công cho ${orders[index].customerName}!`
      );

      // Có thể thêm logic khác sau khi thanh toán thành công như reset giỏ hàng, v.v.
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      message.error(
        "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."
      );
    }
  };

  const addNewOrder = () => {
    let newCustomerIndex = 1;
    let newCustomerName = `Đơn ${newCustomerIndex}`;

    while (
      orders.some((customer) => customer.customerName === newCustomerName)
    ) {
      newCustomerIndex++;
      newCustomerName = `Đơn ${newCustomerIndex}`;
    }

    setOrders([...orders, { cart: [], customerName: newCustomerName }]);
    setActiveTab(`${orders.length}`);
  };

  const removeCustomer = (targetKey) => {
    const newOrders = orders.filter(
      (_, index) => index.toString() !== targetKey
    );
    setOrders(newOrders);

    // Cập nhật Local Storage
    localStorage.setItem("orders", JSON.stringify(newOrders));

    const targetIndex = parseInt(targetKey);
    const activeIndex = parseInt(activeTab);

    // Kiểm tra nếu còn tab nào sau khi xóa
    if (newOrders.length > 0) {
      if (targetIndex === activeIndex) {
        // Nếu tab hiện tại là tab bị xóa
        if (newOrders.length > 0) {
          setActiveTab("0"); // Đặt về tab đầu tiên
        } else {
          setActiveTab(null); // Nếu không còn tab nào
        }
      } else if (targetIndex < activeIndex) {
        // Nếu tab bị xóa nằm trước tab đang hoạt động
        setActiveTab((prev) => (prev - 1).toString());
      } else {
        // Nếu tab bị xóa nằm sau tab đang hoạt động, giữ nguyên activeTab
        setActiveTab(activeTab);
      }
    } else {
      setActiveTab(null); // Nếu không còn tab nào, đặt activeTab là null
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => `${record.productName} - ${record.size.name}`,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString()}`,
    },
    {
      title: "S.L",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record, index) => (
        <InputNumber
          min={1}
          value={text}
          onChange={(value) => {
            const newOrders = [...orders];
            const itemIndex = newOrders[activeTab].cart.findIndex(
              (item) => item.id === record.id
            );
            if (itemIndex > -1) {
              newOrders[activeTab].cart[itemIndex].quantity = value;
              setOrders(newOrders);
              localStorage.setItem("orders", JSON.stringify(newOrders)); // Cập nhật localStorage khi thay đổi số lượng
            }
          }}
        />
      ),
    },
    {
      title: "Toppings",
      dataIndex: "toppings",
      key: "toppings",
      render: (toppings) =>
        toppings
          .filter((topping) => topping !== null)
          .map((topping) => (
            <p key={topping.id}>
              {topping.name} ({topping.price.toLocaleString()}) x{" "}
              {topping.quantity}
            </p>
          )),
    },
    // {
    //   title: "Thành tiền",
    //   dataIndex: "amount",
    //   key: "amount",
    //   render: (text) => `${text.toLocaleString()}`,
    // },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text, record, index) => (
        <div>
          <Input
            placeholder="Ghi chú"
            value={text}
            onChange={(e) => {
              const newOrders = [...orders];
              const itemIndex = newOrders[activeTab].cart.findIndex(
                (item) => item.id === record.id
              );
              if (itemIndex > -1) {
                newOrders[activeTab].cart[itemIndex].note = e.target.value;
                setOrders(newOrders);
                localStorage.setItem("orders", JSON.stringify(newOrders)); // Cập nhật localStorage khi thay đổi ghi chú
              }
            }}
          />
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record, index) => (
        <Button
          type="link"
          onClick={() => handleRemoveItem(index)}
          style={{ color: "red" }}
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  const handleSelectVariant = (productId, variantId) => {
    setSelectedVariants((prevState) => ({
      ...prevState,
      [productId]: variantId,
    }));
  };
  const handleRemoveItem = (index) => {
    const newOrders = [...orders];
    newOrders[activeTab].cart.splice(index, 1); // Xóa mục khỏi giỏ hàng
    setOrders(newOrders);
    localStorage.setItem("orders", JSON.stringify(newOrders));
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
  };

  return (
    <Layout>
      <Content style={{ padding: "20px" }}>
        <style>
          {`
            .ant-table-cell {
              padding: 16px 8px !important;
            }
              .ant-card-body {
                  padding: 12px !important;
              }
               :where(.css-dev-only-do-not-override-14qglws).ant-input-number-outlined {
                  width:4rem !important;}
              :where(.css-dev-only-do-not-override-14qglws).ant-layout, :where(.css-dev-only-do-not-override-14qglws).ant-layout * {
             vertical-align:top;
               
                  }
             :where(.css-dev-only-do-not-override-14qglws).ant-table-wrapper .ant-table-thead >tr>th, :where(.css-dev-only-do-not-override-14qglws).ant-table-wrapper .ant-table-thead >tr>td {
          
                
    align-content: center;
             }
    :where(.css-dev-only-do-not-override-14qglws).ant-col-18 {
    flex: 0 0 56% !important;
    }
          `}
        </style>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Sản phẩm" key="1">
                <Search
                  placeholder="Tìm kiếm sản phẩm"
                  enterButton="Tìm kiếm"
                  size="large"
                  onSearch={handleSearch}
                  style={{ marginBottom: "20px" }}
                />
                <Row gutter={[16, 16]}>
                  {data
                    .filter((product) => product.productVariants.length > 0)
                    .map((product) => (
                      <Col xs={24} sm={12} md={12} lg={8} key={product.id}>
                        <Card
                          hoverable
                          cover={
                            <img
                              alt={product.name}
                              src={
                                "https://www.highlandscoffee.com.vn/vnt_upload/product/06_2023/HLC_New_logo_5.1_Products__TSV.jpg"
                              }
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          }
                        >
                          <Card.Meta title={product.name} />

                          <Row gutter={[8, 8]} style={{ marginTop: "10px" }}>
                            <Col span={24}>
                              <Select
                                id="sizeSelect"
                                style={{ width: "100%" }}
                                value={selectedVariants[product.id]} // Đặt giá trị là biến thể đã chọn
                                onChange={(value) =>
                                  handleSelectVariant(product.id, value)
                                }
                              >
                                {product.productVariants.map((variant) => (
                                  <Option value={variant.id} key={variant.id}>
                                    Size {variant.size.name}
                                  </Option>
                                ))}
                              </Select>
                            </Col>

                            <Col span={24}>
                              <p>
                                {selectedVariants[product.id]
                                  ? `${product.productVariants
                                      .find(
                                        (variant) =>
                                          variant.id ===
                                          selectedVariants[product.id]
                                      )
                                      .price.toLocaleString()}`
                                  : "Chọn kích thước để xem giá"}
                              </p>
                            </Col>

                            <Col span={24}>
                              {toppings.map((topping) => (
                                <Row
                                  key={topping.id}
                                  style={{
                                    alignItems: "center",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <Col span={18}>
                                    <span>{topping.name}</span>
                                  </Col>
                                  <Col span={6}>
                                    <InputNumber
                                      min={0}
                                      value={
                                        selectedToppings[product.id]?.[
                                          topping.id
                                        ] || 0
                                      }
                                      onChange={(value) =>
                                        handleToppingChange(
                                          product.id,
                                          topping.id,
                                          value
                                        )
                                      }
                                    />
                                  </Col>
                                </Row>
                              ))}
                            </Col>
                            <Col span={24}>
                              <Button
                                type="primary"
                                onClick={() =>
                                  handleAddToCart(
                                    selectedVariants[product.id],
                                    product.id
                                  )
                                }
                                disabled={!selectedVariants[product.id]} // Vô hiệu hóa nếu chưa chọn kích thước
                              >
                                Thêm
                              </Button>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    ))}
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Hàng chờ" key="2">
                <p>Không có đơn hàng trong hàng chờ.</p>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Hóa đơn trong ngày" key="3">
                <p>Chưa có hóa đơn nào trong ngày.</p>
              </Tabs.TabPane>
            </Tabs>
          </Col>

          <Col xs={24} md={12}>
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              type="editable-card"
              onEdit={(targetKey, action) => {
                if (action === "add") {
                  addNewOrder();
                } else {
                  removeCustomer(targetKey);
                }
              }}
            >
              {orders.map((customer, index) => (
                <Tabs.TabPane
                  tab={customer.customerName}
                  key={index}
                  closable={orders.length > 1}
                >
                  <Card title={`Giỏ hàng của ${customer.customerName}`}>
                    {customer.cart.length === 0 ? (
                      <p>Giỏ hàng đang trống</p>
                    ) : (
                      <Table
                        columns={columns}
                        dataSource={orders[activeTab]?.cart}
                        pagination={false}
                        rowKey="id"
                        summary={() => (
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={2}>
                              Tổng
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}></Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                              {orders[activeTab]?.cart
                                .reduce((total, item) => total + item.amount, 0)
                                .toLocaleString()}
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        )}
                      />
                    )}
                  </Card>

                  <Form
                    onFinish={(values) => handleFinish(values, index)}
                    style={{ marginTop: "20px" }}
                  >
                    <Form.Item name="phoneNumber">
                      <Input
                        placeholder="Số điện thoại khách hàng"
                        value={phoneNumberInput}
                        onChange={(e) => handlePhoneNumberChange(e, index)} // Truyền index ở đây
                      />
                    </Form.Item>

                    {orders[index] && (
                      <div>
                        <p style={{ color: "green" }}>
                          Tên khách hàng: {orders[index].customerName}
                        </p>
                        <p style={{ color: "green" }}>
                          Số điện thoại: {orders[index].customerPhone}{" "}
                          {/* Hiển thị số điện thoại */}
                        </p>
                      </div>
                    )}
                    <Form.Item
                      name="paymentMethod"
                      label="Hình thức thanh toán"
                    >
                      <Select
                        defaultValue="CASH" // Giá trị mặc định
                        onChange={(value) => setPaymentMethod(value)}
                      >
                        <Option value="CASH">Tiền mặt</Option>
                        <Option value="MOMO">Ví Momo</Option>
                      </Select>
                    </Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      disabled={
                        orders[index].customerPhone &&
                        !orders[index].customerName
                      } // Kiểm tra tên khách hàng của đơn hàng hiện tại
                    >
                      Thanh toán
                    </Button>
                  </Form>
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Phần mềm quản lý quán cà phê ©2024
      </Footer>
    </Layout>
  );
};

export default CounterForm;
