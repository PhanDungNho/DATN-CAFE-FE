import React, { useEffect, useState } from "react";
import { Typography, Table, Divider, message } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const Bill = ({ orderId }) => {
  const [billData, setBillData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        const data = response.data;

        const formattedData = data.orderDetails.flatMap((item, index) => {
          const mainItem = {
            key: `${index}-product`,
            item: item.productName,
            quantity: item.quantity,
            price: item.momentPrice,
            total: item.momentPrice * item.quantity,
            isTopping: false,
          };

          const toppings = item.toppings.map((topping, i) => ({
            key: `${index}-topping-${i}`,
            item: `+ ${topping.name}`,
            quantity: 1,
            price: topping.price,
            total: topping.price,
            isTopping: true,
          }));

          return [mainItem, ...toppings];
        });

        setBillData(formattedData);
        setTotalAmount(data.totalAmount);
      } catch (error) {
        message.error("Không thể tải dữ liệu hóa đơn");
      }
    };

    fetchOrderData();
  }, [orderId]);

  const columns = [
    {
      title: "Mặt hàng",
      dataIndex: "item",
      key: "item",
      render: (text, record) => (
        <div style={{ paddingLeft: record.isTopping ? "10px" : "0" }}>
          <div style={{ fontWeight: record.isTopping ? "normal" : "bold", fontSize: "10px" }}>
            {record.item}
          </div>
        </div>
      ),
    },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <span style={{ fontSize: "10px" }}>{quantity}</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <div style={{ fontSize: "10px" }}>
          <div>{price.toLocaleString()}đ</div>
        </div>
      ),
    },
    {
      title: "Tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <div style={{ textAlign: "right", fontSize: "10px" }}>
          <span>{total.toLocaleString()}đ</span>
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "58mm", padding: "5px", fontSize: "10px", color: "#000", background: "#fff", border: "1px solid #ccc", margin: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Title level={5} style={{ textAlign: "center", fontSize: "10px", fontWeight: "bold" }}>WALA COFFEE</Title>
      <Text style={{ display: "block", textAlign: "center", fontSize: "9px" }}>P. An Khánh, Q. Ninh Kiều - TP. Cần Thơ</Text>
      <Text style={{ display: "block", textAlign: "center", fontSize: "9px" }}>ĐT: 0974.300.007 - 0909.191.195</Text>
      <Divider style={{ margin: "4px 0" }} />
      <Title level={5} style={{ textAlign: "center", fontSize: "10px", fontWeight: "bold" }}>HÓA ĐƠN BÁN HÀNG</Title>
      <div style={{ width: "100%", textAlign: "left", fontSize: "9px", marginBottom: "4px" }}>
        <Text>Số: 021900003</Text>
        <br />
        <Text>Thu ngân: Administrator</Text>
        <br />
        <Text>Giờ vào: 01:41</Text>
        <br />
        <Text>In lúc: 01:41</Text>
      </div>
      <Divider style={{ margin: "4px 0" }} />
      <Table dataSource={billData} columns={columns} pagination={false} bordered style={{ fontSize: "9px", width: "100%" }} size="small" />
      <Divider style={{ margin: "4px 0" }} />
      <div style={{ textAlign: "right", fontSize: "10px", fontWeight: "bold", width: "100%" }}>
        <Text>Tổng cộng: </Text>
        <Text style={{ fontSize: "11px", fontWeight: "bold", color: "#000" }}>{`${totalAmount.toLocaleString()} đ`}</Text>
      </div>
      <Divider style={{ margin: "4px 0" }} />
      <Text style={{ display: "block", textAlign: "center", marginTop: "4px", fontStyle: "italic", fontSize: "9px" }}>Cảm ơn Quý khách. Hẹn gặp lại!</Text>
    </div>
  );
};

export default Bill;
