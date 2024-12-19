import React, { useEffect, useState } from "react";
import { Typography, Table, Divider } from "antd";

const { Text } = Typography;

const Bill = ({ billData }) => {
  // Nhận billData từ props
  const [displayData, setDisplayData] = useState({
    orderDetails: [], // Khởi tạo như một mảng rỗng
    totalAmount: 0,
    createdTime:""
  });

  // Lấy dữ liệu từ props khi component được load
  useEffect(() => {
    console.log(billData)
    if (billData && Array.isArray(billData.orderDetails)) {
      setDisplayData(billData);
      console.log("Invoice data: ", billData);
    } else {
      console.log(
        "Invoice data not found or orderDetails is not an array"
      );
    }
  }, [billData]);

  const columns = [
    {
      title:<div style={{ fontSize: "12px", fontWeight: 'bold' }}>Product</div>, 
      dataIndex: "item",
      key: "item",
      render: (text, record) => (
        <div style={{ fontSize: "12px",marginTop: "3px" }}>
          <strong >
            {record.name} - {record.size} (
            {Number(record.price).toLocaleString()}đ)
          </strong>
          <br />
          {record.toppings && record.toppings.length > 0 && (
            <div >
              <ul style={{ paddingLeft: "0px", margin: "2px 0" }}>
                {record.toppings.map((topping, i) => (
                  <li
                    key={i}
                    style={{
                      marginLeft: "0",
                      fontSize: "10px",
                      // color: "#888",
                      listStyle: "none",
                    }}
                  >
                    {topping.name} ({topping.price.toLocaleString()} đ) x{" "}
                    {topping.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {record.note && record.note.trim() !== "null" && (
            <div
              style={{
                marginLeft: "0",
                marginTop: "5px",
                fontSize: "12px",
               
              }}
            >
              Note: {record.note}
            </div>
          )}
        </div>
      ),
    },
    {
      title: <div style={{ fontSize: "12px", fontWeight: 'bold', textWrap:"none",textAlign:"center" }}>Total</div>, 
      dataIndex: "total",
     textWrap:"none",
      key: "total",
      align: "right",
      render: (total) => <span style={{ fontSize: "12px",}}>{total.toLocaleString()} đ</span>,
    },
  ];

  const billItems = (displayData.orderDetails || []).map((detail, index) => {
    const toppingTotal = detail.orderDetailToppings.reduce((sum, topping) => {
      return sum + topping.momentPrice * topping.quantity;
    }, 0);

    const totalAmount = detail.momentPrice + toppingTotal;

    return {
      key: index + 1,
      name: `${detail.productVariant.product.name}`,
      size: `${detail.productVariant.size.name}`,
      price: `${detail.momentPrice}`,
      quantity: detail.quantity,
      note: `${detail.note}`,
      total: totalAmount,
      toppings: detail.orderDetailToppings.map((topping) => ({
        name: topping.topping.name,
        quantity: topping.quantity,
        price: topping.momentPrice,
      })),
    };
  });
  const formattedCreatedTime = new Date(displayData.createdTime).toLocaleString();
  return (
    <div style={{
      width: "58mm",
      maxWidth: "58mm",
      padding: "5px 0px",
      background: "#fff",
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#333",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @media print {
          button { 
            display: none;
          }
          body {
            margin: 0; 
          }
        }
        .bordered-row {
          // border: 1px solid #ddd portant; ;
        }
        .ant-table-cell {
          // border: 1px solid black !important;
        }
        .ant-table {
          // border: 1px solid #ddd;
        }
          .ant-table-content>table{
          // border-collapse: collapse; 
       
          width:100%}
      `}</style>
      
      <img
        src="/assets/img/logo3.png"
        alt="Logo"
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "200px",
          height: "auto",
        }}
      />

      <div style={{ marginTop: "80px", textAlign: "center" }}>
        <Text style={{ fontSize: "12px",color:"black", marginBottom: "5px" }}>
        123, 30th of April Street, An Khanh Ward, Ninh Kieu District - Can Tho City.
        </Text>
        <br />
        <Text style={{ fontSize: "12px",color:"black", marginBottom: "10px" }}>
          Phone number: 0974.300.007 - 0909.191.195
        </Text>
      </div>
   
      <Divider style={{ margin: "10px 0" }} />
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "16px",
          color:"black",
          margin: "0",
        }}
      >
        SALES INVOICE
      </Text>
      <div style={{ textAlign: "center", marginTop:"3px" }}>
        <Text style={{ fontSize: "12px",color:"black",}}>Time: {formattedCreatedTime}</Text>
      </div>
      <Table
        dataSource={billItems}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        style={{ width: "100%", marginTop: "10px" }}
      />

      <Divider style={{ margin: "10px 0" }} />
      <div
        style={{
          textAlign: "right",
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "10px",
        }}
      >
        <Text style={{color:"black"}}>Total: {displayData.totalAmount.toLocaleString()} VNĐ</Text>
      </div>

      <Divider style={{ marginTop: " 5px" }} />
      <Text
        style={{
          textAlign: "center",
          fontStyle: "italic",
          fontSize: "14px",
          color:"black",
          marginBottom:"4"
        }}
      >
      Thank you. See you again!
      </Text>
      <Text
      style={{
        textAlign: "center",
      
        fontSize: "12px",
        color:"black",
      }}
    >
  Wifi password: THAYTRUNG
    </Text>
    </div>
  );
};

export default Bill;
