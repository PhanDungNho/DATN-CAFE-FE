import React, { useEffect, useState } from "react";
import { Typography, Table, Divider } from "antd";

const { Title, Text } = Typography;

const Bill = () => {
  const [billData, setBillData] = useState({ items: [], total: 0 });

  // Lấy dữ liệu từ localStorage khi trang được load
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("billData"));
    if (data) {
        setBillData(data);
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
            Size: {record.size}
          </Text>
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

  const billItems = billData.items.map((item, index) => ({
    key: index + 1,
    item: item.productName,
    size: item.size,
    total: item.totalPrice,
  }));

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "80mm",
        padding: "15px",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#000",
        border: "1px solid #ccc",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title level={4} style={{ textAlign: "center", fontWeight: "bold" }}>
        WALA COFFEE
      </Title>
      <Text style={{ textAlign: "center", fontSize: "14px" }}>
        P. An Khánh, Q. Ninh Kiều - TP. Cần Thơ
      </Text>
      <Text style={{ textAlign: "center", fontSize: "14px" }}>
        ĐT: 0974.300.007 - 0909.191.195
      </Text>

      <Divider />

      <Title level={4} style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px" }}>
        HÓA ĐƠN BÁN HÀNG
      </Title>

      <Table dataSource={billItems} columns={columns} pagination={false} bordered size="small" />

      <Divider />

      <div style={{ textAlign: "right", fontWeight: "bold" }}>
        <Text>Tổng cộng: {billData.total.toLocaleString()} đ</Text>
      </div>

      <Divider />

      <Text style={{ textAlign: "center", fontStyle: "italic" }}>
        Cảm ơn Quý khách. Hẹn gặp lại!
      </Text>
    </div>
  );
};

export default Bill;
