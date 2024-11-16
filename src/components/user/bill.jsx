import React, { useEffect, useState } from "react";
import { Typography, Table, Divider } from "antd";

const { Text } = Typography;

const Bill = () => {
  const [billData, setBillData] = useState({
    orderDetails: [],
    totalAmount: 0,
  });

  // Lấy dữ liệu từ localStorage khi trang được load
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("billData"));
    if (data) {
      setBillData(data);
      console.log("localStorage: ", data);
    } else {
      console.log("Không tìm thấy dữ liệu hóa đơn trong localStorage");
    }
  }, []);

  const columns = [
    {
      title: "Mặt hàng",
      dataIndex: "item",
      key: "item",
      render: (text, record) => (
        <div>
          <strong>{record.item}</strong>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Số lượng: {record.quantity}
          </Text>
          {/* Hiển thị danh sách topping nếu có */}
          {record.toppings && record.toppings.length > 0 && (
            <div style={{ marginTop: "5px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Topping:
              </Text>
              <ul style={{ paddingLeft: "15px", margin: "5px 0" }}>
                {record.toppings.map((topping, i) => (
                  <li key={i} style={{ fontSize: "12px", color: "#888" }}>
                    {topping.name} - Số lượng: {topping.quantity} - Giá: {topping.price.toLocaleString()} đ
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => <span>{total.toLocaleString()} đ</span>,
    },
  ];
  
  // Thêm topping vào cấu trúc billItems
  const billItems = billData.orderDetails.map((detail, index) => {
    // Tính tổng tiền của các topping
    const toppingTotal = detail.orderDetailToppings.reduce((sum, topping) => {
      return sum + topping.momentPrice * topping.quantity;
    }, 0);
  
    // Tổng tiền của variant = giá variant + tổng tiền topping
    const totalAmount = detail.momentPrice + toppingTotal;
  
    return {
      key: index + 1,
      item: `${detail.productVariant.product.name}`,
      quantity: detail.quantity,
      total: totalAmount, // Tổng tiền cho variant bao gồm cả topping
      toppings: detail.orderDetailToppings.map((topping) => ({
        name: topping.topping.name,
        quantity: topping.quantity,
        price: topping.momentPrice,
      })),
    };
  });
  

  console.log(billItems);

  console.log("Bill: ", billItems);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "80mm",
        padding: "20px",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#333",
        border: "1px solid #ddd",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        position: "relative", // Chú ý thêm position relative ở đây
      }}
    >
      {/* Logo được điều chỉnh không bị bể và có kích thước như ban đầu */}
      <img
        src="/assets/img/logo2.png"
        alt="Logo"
        style={{
          position: "absolute", // Để logo không đè lên nội dung
          top: "0",
          left: "50%",
          transform: "translateX(-50%)", // Để logo căn giữa
          width: "100%", // Logo chiếm toàn bộ chiều rộng của tờ hóa đơn
          maxWidth: "200px", // Giới hạn chiều rộng tối đa để không quá lớn
          height: "auto", // Đảm bảo logo không bị méo
          opacity: 0.9, // Làm logo mờ đi một chút
        }}
      />

      {/* Địa chỉ và thông tin điện thoại không bị đè lên logo */}
      <div style={{ marginTop: "80px", textAlign: "center" }}>
        <Text style={{ fontSize: "12px", color: "#555", marginBottom: "5px" }}>
          P. An Khánh, Q. Ninh Kiều - TP. Cần Thơ
        </Text>
        <br />
        <Text style={{ fontSize: "12px", color: "#555", marginBottom: "10px" }}>
          ĐT: 0974.300.007 - 0909.191.195
        </Text>
      </div>

      <Divider style={{ margin: "10px 0" }} />

      {/* Thay Title bằng Text */}
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "16px",
          margin: "0",
          display: "block",
        }}
      >
        HÓA ĐƠN BÁN HÀNG
      </Text>

      <Table
        dataSource={billItems}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        style={{ width: "100%", marginTop: "15px" }}
        rowClassName="table-row"
      />

      <Divider style={{ margin: "15px 0" }} />

      <div
        style={{
          textAlign: "right",
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "10px",
        }}
      >
        <Text>Tổng cộng: {billData.totalAmount.toLocaleString()} đ</Text>
      </div>

      <Divider style={{ margin: "15px 0" }} />

      <Text
        style={{
          textAlign: "center",
          fontStyle: "italic",
          fontSize: "14px",
          color: "#888",
        }}
      >
        Cảm ơn Quý khách. Hẹn gặp lại!
      </Text>
    </div>
  );
};

export default Bill;