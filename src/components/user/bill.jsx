import React from "react";
import { Typography, Table, Divider } from "antd";

const { Title, Text } = Typography;

const Bill = () => {
  const billItems = [
    { key: "1", item: "Cà phê đá", quantity: 1, price: 10000, total: 10000 },
    { key: "2", item: "Bún thịt xào", quantity: 1, price: 15000, total: 15000 },
    { key: "3", item: "Cà phê sữa", quantity: 1, price: 12000, total: 12000 },
    { key: "4", item: "Cơm tấm", quantity: 1, price: 17000, total: 17000 },
  ];

  const columns = [
    { title: "Mặt hàng", dataIndex: "item", key: "item" },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {total.toLocaleString()}đ
        </span>
      ),
    },
  ];

  const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "80mm", // Chiều rộng phù hợp với máy in XP-58C
        padding: "15px", // Tăng padding để tạo không gian
        fontFamily: "Arial, sans-serif",
        fontSize: "16px", // Kích thước chữ lớn hơn
        color: "#000",
        background: "#fff",
        border: "1px solid #ccc",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title level={4} style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>
        WALA COFFEE
      </Title>

      <Text style={{ display: "block", textAlign: "center", fontSize: "14px" }}>
        P. An Khánh, Q. Ninh Kiều - TP. Cần Thơ
      </Text>

      <Text style={{ display: "block", textAlign: "center", fontSize: "14px" }}>
        ĐT: 0974.300.007 - 0909.191.195
      </Text>

      <Divider style={{ margin: "10px 0" }} />

      <Title level={4} style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px" }}>
        HÓA ĐƠN BÁN HÀNG
      </Title>

      <div style={{ width: "100%", textAlign: "left", fontSize: "14px", marginBottom: "10px" }}>
        <Text>Số: 021900003</Text>
        <br />
        <Text>Thu ngân: Administrator</Text>
        <br />
        <Text>Giờ vào: 01:41</Text>
        <br />
        <Text>In lúc: 01:41</Text>
      </div>

      <Divider style={{ margin: "10px 0" }} />

      <Table
        dataSource={billItems}
        columns={columns}
        pagination={false}
        bordered
        style={{ fontSize: "14px", width: "100%" }}
        size="small"
      />

      <Divider style={{ margin: "10px 0" }} />

      <div style={{ textAlign: "right", fontSize: "16px", fontWeight: "bold", width: "100%" }}>
        <Text>Tổng cộng: </Text>
        <Text style={{ fontSize: "18px", fontWeight: "bold", color: "#000", whiteSpace: "nowrap" }}>
          {`${totalAmount.toLocaleString()} đ`}
        </Text>
      </div>

      <Divider style={{ margin: "10px 0" }} />

      <Text
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "10px",
          fontStyle: "italic",
          fontSize: "14px",
        }}
      >
        Cảm ơn Quý khách. Hẹn gặp lại!
      </Text>
    </div>
  );
};

export default Bill;
