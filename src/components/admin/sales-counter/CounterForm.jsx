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

const { TabPane } = Tabs; // Khai báo TabPane từ Tabs
const { Search } = Input;
const { Option } = Select;

const CounterForm = () => {
  const [activeTab, setActiveTab] = useState("0");
  // const [ords, setOrds] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [accounts, setAccounts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [orders, setOrders] = useLocalStorage("orders", [
    { cart: [], customerName: "Đơn 1", customerId: "" },
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
        setToppings(response.data);
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

      // Tìm topping đã chọn cho sản phẩm
      const toppingsWithQuantity = Object.entries(
        selectedToppings[productId] || {}
      )
        .filter(([toppingId, quantity]) => quantity > 0)
        .map(([toppingId, quantity]) => {
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
        quantity: 1,
        toppings: toppingsWithQuantity,
        toppingPrice: toppingPrice,
        amount: selectedVariant.price + toppingPrice,
      };

      // Thêm sản phẩm mới vào giỏ hàng
      currentCart.push(newItem);

      // Cập nhật orders và localStorage
      setOrders(newOrders);

      message.success(
        `${selectedVariant.productName} (Size ${selectedVariant.size.name}) đã được thêm vào giỏ hàng!`
      );

      // Reset số lượng topping về 0 cho sản phẩm đã thêm
      setSelectedToppings((prev) => ({
        ...prev,
        [productId]: toppings.reduce((acc, topping) => {
          acc[topping.id] = 0;
          return acc;
        }, {}),
      }));
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

      phone: orders[index].customerPhone || phoneNumberInput,
      status: paymentMethod === "ONLINE" ? 0 : 1,
      paymentmethod: paymentMethod,
      active: false,

      shippingfee: 0,
      ordertype: 0,
      fulladdresstext: null,
      customerid: orders[index].customerId || "test1",
      orderdetails: cartItems,
    };

    try {
      // Gọi insertOrder từ OrderService để gửi đơn hàng

      const orderResponse = await orderService.insertOrder(order);
      order.id = orderResponse.data.id;
      console.log("Order created:", order);

      // Chỉ thực hiện thanh toán nếu phương thức là ONLINE
      if (paymentMethod === "ONLINE") {
        await handleOnlinePayment(order, totalAmount, index);
      } else {
        handleSuccess(order, index);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý đơn hàng:", error);
      message.error("Đã xảy ra lỗi khi xử lý đơn hàng. Vui lòng thử lại.");
    }
  };

  // Hàm xử lý thanh toán online
  const handleOnlinePayment = async (order, totalAmount, index) => {
    try {
      const response = await paymentService.createPayment(
        totalAmount, // Số tiền thanh toán
        `Thanh toán cho đơn hàng ID: ${order.id}`,
        "d" // Thông tin đơn hàng
      );

      if (response && response.data && response.data.payUrl) {
        // Lưu thông tin giao dịch
        await paymentService.insertTransaction({
          order: { id: order.id },
          payUrl: response.data.payUrl,
        });

        console.log("Payment URL created:", response);
        window.open(response.data.payUrl, "_blank", "width=800,height=600");

        // handleSuccess(order, index);
      } else {
        throw new Error("Không thể tạo URL thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      message.error("Đã xảy ra lỗi khi tạo thanh toán. Vui lòng thử lại.");
    }
  };

  // Hàm xử lý thành công
  const handleSuccess = async (order, index) => {
    message.success(`Thanh toán thành công cho ${orders[index].customerName}!`);
  
    // Reset giỏ hàng và thông tin khách hàng sau khi thanh toán
    const newOrders = [...orders];
  
    // Xóa giỏ hàng của đơn hàng đã thanh toán
    newOrders[index].cart = [];
  
    // Reset thông tin khách hàng
    newOrders[index].customerName = "";
    newOrders[index].customerPhone = "";
    newOrders[index].customerId = "";
  
    // Reset input số điện thoại
    setPhoneNumberInput("");
  
    // Cập nhật trạng thái đơn hàng và đóng tab hiện tại
    setOrders(newOrders);
  
    // Cập nhật Local Storage
    localStorage.setItem("orders", JSON.stringify(newOrders));
  
    // Đóng tab hiện tại
    removeCustomer(index.toString()); // Gọi hàm xóa tab
  

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
      // Nếu không còn tab nào, tạo tab mới với tên "Đơn 1"
      addNewOrder(); // Gọi hàm addNewOrder để tạo tab mới
      setActiveTab(`${orders.length - 1}`); // Đặt activeTab về tab mới
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
      render: (toppings) =>
        toppings
          .filter((topping) => topping !== null)

          .map((topping) => {
            // Hàm tạo màu ngẫu nhiên
            const getRandomColor = () => {
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
              return colors[Math.floor(Math.random() * colors.length)];
            };

            return (
              <p key={topping.id}>
                <Tag color={getRandomColor()}>
                  {topping.name} ({topping.price.toLocaleString()})
                </Tag>{" "}
                x {topping.quantity}
              </p>
            );
            // return (
            //   <p key={topping.id}>
            //     <Tag color={getRandomColor()}>{topping.name}</Tag>{" "}
            //     x {topping.quantity}
            //   </p>
            // );
          }),
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
    newOrders[activeTab].cart.splice(index, 1);
    setOrders(newOrders);
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
    
            <ProductItem
              products={products}
              toppings={toppings}
              selectedVariants={selectedVariants}
              handleSelectVariant={handleSelectVariant}
              handleToppingChange={handleToppingChange}
              handleAddToCart={handleAddToCart}
              selectedToppings={selectedToppings}
              setSelectedToppings={setSelectedToppings}
            />
    
        
      </Col>

      <Col xs={24} md={12}>
        {/* Code hiển thị giỏ hàng */}
        <OrderTab
          orders={orders}
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
        />
      </Col>
    </Row>
  );
};

export default CounterForm;
