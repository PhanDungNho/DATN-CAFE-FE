import React, { useState, useEffect } from "react";
import {
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
  Badge,
  Tag,
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

import ProductItem from "./ProductItem";
import OrderTab from "./OrderTab";
import useLocalStorage from "../../../hooks/useLocalStorage";
import PaymentService from "../../../services/PaymentService";
import Queue from "./Queue";
import { deleteOrderById } from "../../../redux/actions/invoiceAction";
import { useDispatch } from "react-redux";
import { printBill } from "../../user/printBill";

const { TabPane } = Tabs; // Khai báo TabPane từ Tabs
const { Search } = Input;
const { Option } = Select;

const CounterForm = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("0");
  // const [ords, setOrds] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [accounts, setAccounts] = useState([]);
  // const [toppings, setToppings] = useState([]);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [orders, setOrders] = useLocalStorage("orders", [
    { cart: [], tabName: "Tab 1", customerId: "", paymentMethod: "CASH" },
  ]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedToppings, setSelectedToppings] = useState({}); // State lưu topping đã chọn cho mỗi sản phẩm

  const productService = new ProductService();
  const accountService = new AccountService();
  const toppingService = new ToppingService();
  const orderService = new OrderService();
  const paymentService = new PaymentService();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        setProducts(response.data);

        // Thiết lập giá trị mặc định cho selectedVariants
        const initialSelectedVariants = {};
        response.data.forEach((product) => {
          if (product.productVariants.length > 0) {
            initialSelectedVariants[product.id] = product.productVariants[0].id; // Chọn size đầu tiên
          }
        });
        setSelectedVariants(initialSelectedVariants);
      } catch (error) {
        console.error("Error when retrieving product:", error);
        message.error("Unable to get product.");
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await accountService.getAccounts();
        setAccounts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error while retrieving account:", error);
        message.error("Unable to get account.");
      }
    };

    // const fetchToppings = async () => {
    //   try {
    //     const response = await toppingService.getToppings();
    //     setToppings(response.data);
    //     console.log(response.data);
    //   } catch (error) {
    //     console.error("Lỗi khi lấy topping:", error);
    //     message.error("Không thể lấy topping.");
    //   }
    // };

    fetchProducts();
    // fetchToppings();
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
  const handleRemoveTopping = (productId, toppingId) => {
    setSelectedToppings((prev) => {
      const updatedToppings = { ...prev };

      // Xóa topping từ selectedToppings
      if (updatedToppings[productId] && updatedToppings[productId][toppingId]) {
        delete updatedToppings[productId][toppingId]; // Xóa topping
      }

      // Cập nhật giỏ hàng
      const newOrders = [...orders];
      const currentCart = newOrders[activeTab].cart;

      // Tìm sản phẩm trong giỏ hàng
      const productInCart = currentCart.find((item) => item.id === productId);

      if (productInCart) {
        // Cập nhật topping và giá
        productInCart.toppings = productInCart.toppings.filter(
          (topping) => topping.id !== toppingId
        );
        productInCart.toppingPrice = productInCart.toppings.reduce(
          (total, topping) => total + topping.price * topping.quantity,
          0
        );
        // Cập nhật amount
        productInCart.amount = productInCart.price + productInCart.toppingPrice;
      }

      // Cập nhật state và local storage
      setOrders(newOrders);
      localStorage.setItem("orders", JSON.stringify(newOrders));

      return updatedToppings; // Trả lại updatedToppings
    });
  };

  const handleAddToCart = (variantId, productId) => {
    const selectedVariant = products
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

      // Lấy topping hợp lệ cho sản phẩm
      const validToppings =
        products.find((product) => product.id === productId)?.productToppings ||
        [];

      // Tìm topping đã chọn cho sản phẩm
      const toppingsWithQuantity = Object.entries(
        selectedToppings[productId] || {}
      )
        .filter(
          ([toppingId, quantity]) =>
            quantity > 0 &&
            validToppings.some((t) => t.topping.id === parseInt(toppingId))
        )
        .map(([toppingId, quantity]) => {
          const foundTopping = validToppings.find(
            (t) => t.topping.id === parseInt(toppingId)
          );
          return foundTopping
            ? {
                productId, // Lưu productId để sử dụng khi xóa topping
                id: foundTopping.topping.id,
                name: foundTopping.topping.name,
                price: foundTopping.topping.price,
                quantity: quantity,
              }
            : null;
        })
        .filter((topping) => topping !== null);

      // Tính giá topping
      const toppingPrice = toppingsWithQuantity.reduce(
        (total, topping) => total + topping.price * topping.quantity,
        0
      );

      // Tạo sản phẩm mới với topping đã chọn
      const newItem = {
        ...selectedVariant,
        quantity: 1,
        toppings: toppingsWithQuantity,
        toppingPrice: toppingPrice,
        amount: selectedVariant.price + toppingPrice,
      };

      // Thêm sản phẩm mới vào giỏ hàng
      currentCart.push(newItem);

      // Cập nhật orders và localStorage
      setOrders(newOrders);
      localStorage.setItem("orders", JSON.stringify(newOrders));

      message.success(
        `${selectedVariant.productName} (Size ${selectedVariant.size.name}) has been added to the cart!`
      );

      // Reset số lượng topping về 0 cho sản phẩm đã thêm
      setSelectedToppings((prev) => ({
        ...prev,
        [productId]: validToppings.reduce((acc, topping) => {
          acc[topping.topping.id] = 0;
          return acc;
        }, {}),
      }));
    } else {
      message.error("This product was not found.");
    }
  };

  const handleSearch = (value) => {
    console.log("Search:", value);
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
        message.success("Entered the correct phone number!");

        updatedOrders[index].customerPhone = enteredPhone;
        updatedOrders[index].customerId = foundAccount.username;
        updatedOrders[index].customerName = foundAccount.fullName;
      } else {
        updatedOrders[index].customerId = "";
        updatedOrders[index].customerName = ""; // Reset tên khách hàng nếu không tìm thấy
        updatedOrders[index].customerPhone = ""; // Reset số điện thoại nếu không tìm thấy
      }
      return updatedOrders;
    });
  };

  const handleFinish = async (values, index) => {
    // Lấy phương thức thanh toán từ orders cho tab hiện tại
    const currentPaymentMethod = orders[index].paymentMethod;

    const cartItems = orders[index].cart.map((item) => ({
      productVariant: { id: item.id },
      quantity: item.quantity,
      momentPrice: item.price,
      note: item.note,
      totalPrice:
        item.price * item.quantity +
        item.toppings.reduce(
          (total, topping) => total + topping.price * topping.quantity,
          0
        ),
      orderDetailToppings: item.toppings.map((topping) => ({
        topping: {
          id: topping.id,
          name: topping.name,
          price: topping.price,
        },
        quantity: topping.quantity,
        momentPrice: topping.price,
      })),
    }));

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    const order = {
      cashierId: JSON.parse(localStorage.getItem("user")).username,
      totalAmount: totalAmount,
      phone: orders[index].customerPhone || phoneNumberInput,
      orderStatus: currentPaymentMethod === "ONLINE" ? 0 : 1,
      paymentMethod: currentPaymentMethod,
      paymentStatus: currentPaymentMethod === "CASH" ? 1 : 0,
      active: false,
      shippingFee: 0,
      orderType: 0,
      fullAddress: null,
      customerId: orders[index].customerId || "test1",
      orderDetails: cartItems,
    };

    try {
      // Gọi insertOrder từ OrderService để gửi đơn hàng
      console.log("Order not yet:", order);
      const orderResponse = await orderService.insertOrder(order);
      order.id = orderResponse.data.id;
      console.log("Order created:", order);

      // Chỉ thực hiện thanh toán nếu phương thức là ONLINE
      if (currentPaymentMethod === "ONLINE") {
        await handleOnlinePayment(
          order,
          totalAmount,
          index,
          orderResponse.data
        );
      } else {
        handleSuccess(order, index, orderResponse.data);
      }
    } catch (error) {
      console.error("Error when processing order:", error);
      message.error(
        "An error occurred while processing the order. Please try again."
      );
    }
  };
  const handlePaymentMethodChange = (value, index) => {
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      updatedOrders[index].paymentMethod = value;
      return updatedOrders;
    });
  };
  // Hàm xử lý thanh toán online
  const handleOnlinePayment = async (
    order,
    totalAmount,
    index,
    orderResponse
  ) => {
    try {
      const response = await paymentService.createPayment(
        totalAmount, // Số tiền thanh toán
        `Pay for the order ID: ${order.id}`,
        "d" // Thông tin đơn hàng
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
              message.success("Payment successful!");
              handleSuccess(order, index, orderResponse); // Đóng form bán hàng
              setPhoneNumberInput("");
              removeCustomer(index.toString());
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
      message.error(
        "An error occurred while creating the payment. Please try again."
      );
    }
  };

  // Hàm xử lý thành công
  const handleSuccess = async (order, index, orderResponse) => {
    message.success(`Successful payment for ${orders[index].tabName}!`);

    // Reset giỏ hàng và thông tin khách hàng sau khi thanh toán
    const newOrders = [...orders];
    setPhoneNumberInput("");
    // Xóa giỏ hàng của đơn hàng đã thanh toán
    newOrders[index].cart = []; // Giỏ hàng sẽ được làm sạch

    // Làm sạch số điện thoại và ID khách hàng
    newOrders[index].customerPhone = ""; // Reset số điện thoại
    newOrders[index].customerId = ""; // Reset ID nếu cần
    newOrders[index].customerName = ""; // Reset ID nếu cần

    // Reset input số điện thoại trong trạng thái

    // Cập nhật trạng thái đơn hàng mà không xóa tab
    setOrders(newOrders);

    // Cập nhật Local Storage
    localStorage.setItem("orders", JSON.stringify(newOrders));
    printBill(orderResponse);
    // Không gọi removeCustomer để giữ nguyên tab
  };

  const addNewOrder = () => {
    let newTabIndex = 1;
    let newTabName = `Order ${newTabIndex}`;

    while (orders.some((customer) => customer.tabName === newTabName)) {
      newTabIndex++;
      newTabName = `Order ${newTabIndex}`;
    }

    // Thêm đơn hàng mới với paymentMethod mặc định là "CASH"
    const newOrder = {
      cart: [],
      tabName: newTabName,
      paymentMethod: "CASH",
      customerPhone: "", // Reset số điện thoại
      customerId: "",
      customerName: "",
    };
    setOrders([...orders, newOrder]);

    console.log("New order added:", newOrder); // log giá trị của đơn hàng mới
    console.log("Orders after add:", orders); // log giá trị orders hiện tại
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
      // Nếu không còn tab nào, tạo tab mới với tên "Đơn 1"
      addNewOrder(); // Gọi hàm addNewOrder để tạo tab mới
      setActiveTab(`${orders.length - 1}`); // Đặt activeTab về tab mới
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => `${record.productName} - ${record.size.name}`,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString()}`,
    },
    // {
    //   title: "S.L",
    //   dataIndex: "quantity",
    //   key: "quantity",
    //   render: (text, record, index) => (
    //     <InputNumber
    //       min={1}
    //       value={text}
    //       onChange={(value) => {
    //         const newOrders = [...orders];
    //         const itemIndex = newOrders[activeTab].cart.findIndex(
    //           (item) => item.id === record.id
    //         );
    //         if (itemIndex > -1) {
    //           newOrders[activeTab].cart[itemIndex].quantity = value;
    //           setOrders(newOrders);
    //           localStorage.setItem("orders", JSON.stringify(newOrders)); // Cập nhật localStorage khi thay đổi số lượng
    //         }
    //       }}
    //     />
    //   ),
    // },
    {
      title: "Toppings",
      dataIndex: "toppings",
      key: "toppings",
      render: (
        toppings,
        record // record được thêm vào để lấy productId
      ) =>
        toppings
          .filter((topping) => topping !== null)
          .map((topping) => {
            // const getRandomColor = () => {
            //   const colors = [
            //     "magenta", "red", "volcano", "orange", "gold",
            //     "lime", "green", "cyan", "blue", "geekblue", "purple",
            //   ];
            //   return colors[Math.floor(Math.random() * colors.length)];
            // };

            return (
              <p key={topping.id}>
                <Tag>
                  {topping.name} ({topping.price.toLocaleString()})
                
                </Tag>{" "}
                x {topping.quantity}
              </p>
            );
          }),
    },

    // {
    //   title: "Thành tiền",
    //   dataIndex: "amount",
    //   key: "amount",
    //   render: (text) => `${text.toLocaleString()}`,
    // },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text, record, index) => (
        <div>
          <Input
            placeholder="Note"
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
    newOrders[activeTab].cart.splice(index, 1);
    setOrders(newOrders);
    message.success("The product has been removed from the cart!");
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <ProductItem
          products={products}
          selectedVariants={selectedVariants}
          handleSelectVariant={handleSelectVariant}
          handleToppingChange={handleToppingChange}
          handleAddToCart={handleAddToCart}
          selectedToppings={selectedToppings}
        />
      </Col>

      <Col xs={24} md={12}>
        {/* Code hiển thị giỏ hàng */}
        <OrderTab
          orders={orders}
          handlePaymentMethodChange={handlePaymentMethodChange}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          addNewOrder={addNewOrder}
          removeCustomer={removeCustomer}
          handleFinish={handleFinish}
          handlePhoneNumberChange={handlePhoneNumberChange}
          phoneNumberInput={phoneNumberInput}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          columns={columns}
          handleRemoveItem={handleRemoveItem}
          handleRemoveTopping={handleRemoveTopping} // Thêm vào đây
        />
      </Col>
    </Row>
  );
};

export default CounterForm;
