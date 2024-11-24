import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Tag, Descriptions } from "antd";
import { useNavigate } from "react-router-dom";
import invoiceService from "../../../services/invoiceService";

const Allorder = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();
  const service = new invoiceService();
  const username = JSON.parse(localStorage.getItem("user"))?.username;

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

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await service.getInvoicesByCustomer(username);
        setData(response.data);
        setFilteredData(response.data);

        const counts = {};
        let total = 0;
        response.data.forEach((order) => {
          counts[order.orderStatus] = (counts[order.orderStatus] || 0) + 1;
          total += 1;
        });
        setStatusCounts(counts);
        setTotalCount(total);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        message.error("Không thể lấy dữ liệu hóa đơn.");
      }
    };

    fetchInvoices();
  }, []);

  const handleDetailClick = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === "ALL") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((order) => order.orderStatus === status));
    }
  };

  const columns = [
    {
      title: "NO#",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Created time",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text) => new Date(text).toLocaleString("vi-VN"),
    },
    {
      title: "Order type",
      dataIndex: "orderType",
      key: "orderType",
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Payment status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Order status",
      dataIndex: "orderStatus",
      key: "orderStatus",
    },
    {
      title: "Shipping fee",
      dataIndex: "shippingFee",
      key: "shippingFee",
      render: (text) =>
        text.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) =>
        text.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleDetailClick(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        {[
          "ALL",
          "UNCONFIRMED",
          "PROCESSING",
          "DELIVERING",
          "DELIVERED",
          "COMPLETED",
          "CANCELLED",
        ].map((status) => (
          <Button
            key={status}
            type={statusFilter === status ? "primary" : "default"}
            onClick={() => handleFilterChange(status)}
            style={{ marginRight: "8px" }}
          >
            {status}{" "}
            {status === "ALL"
              ? `(${totalCount})`
              : `(${statusCounts[status] || 0})`}
          </Button>
        ))}
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />

      <Modal
        title="Order information"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={1000}
      >
        <style>
          {`
      /* CSS để ẩn header chỉ trong bảng đầu tiên */
      .no-header-table .ant-table-thead {
        display: none;
      }
      /* CSS để vô hiệu hover trên tất cả các hàng */
      .ant-table-row:hover {
        background-color: transparent !important;
      }
    `}
        </style>

        {selectedRecord && (
          <div>
            {/* Bảng đầu tiên */}
            <Table
  className="no-header-table"
  dataSource={[
    {
      key: "1",
      info1: (
        <span>
          <strong>Order ID:</strong> {selectedRecord.id}
        </span>
      ),
      info2: (
        <span>
          <strong>Payment status:</strong> {selectedRecord.paymentStatus}
        </span>
      ),
    },
    {
      key: "2",
      info1: (
        <span>
          <strong>Created time:</strong>{" "}
          {new Date(selectedRecord.createdTime).toLocaleString("vi-VN")}
        </span>
      ),
      info2: (
        <span>
          <strong>Order status:</strong> {selectedRecord.orderStatus}
        </span>
      ),
    },
    {
      key: "3",
      info1: (
        <span>
          <strong>Order type:</strong> {selectedRecord.orderType}
        </span>
      ),
      info2: (
        <span>
          <strong>Shipping fee:</strong>{" "}
          {selectedRecord.shippingFee.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      ),
    },
    {
      key: "4",
      info1: (
        <span>
          <strong>Payment method:</strong> {selectedRecord.paymentMethod}
        </span>
      ),
      info2: (
        <span>
          <strong>Order value:</strong>{" "}
          {selectedRecord.totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      ),
    },
  ]}
  pagination={false}
  columns={[
    {
      dataIndex: "info1",
      key: "info1",
    },
    {
      dataIndex: "info2",
      key: "info2",
    },
  ]}
  style={{ marginBottom: "20px" }}
/>


            <h5>Order details</h5>

            {/* Bảng thứ hai */}
            <Table
              dataSource={selectedRecord.orderdetails}
              columns={[
                {
                  title: "Product",
                  key: "productWithSize",
                  render: (_, record) => {
                    const productName = record.productVariant.product.name;
                    const sizeName = record.productVariant.size.name;
                    const productUrl = `/products/${record.productVariant.product.id}`;

                    return (
                      <a
                        href={productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${productName} ${sizeName}`}
                      </a>
                    );
                  },
                },
                {
                  title: "Moment price",
                  dataIndex: ["productVariant", "price"],
                  key: "price",
                  render: (text) =>
                    text.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }),
                },
                {
                  title: "Topping",
                  key: "toppings",
                  onCell: () => ({
                    style: {
                      maxWidth: "120px",
                      textOverflow: "ellipsis",
                      // overflow: "hidden", // Thêm overflow để hiển thị dấu '...'
                      // whiteSpace: "nowrap",
                    },
                  }),
                  render: (_, record) =>
                    record.orderDetailToppings.map((topping) => (
                      <div key={topping.id}>
                        <Tag color={getRandomColor()}>
                          {topping.topping.name} (
                          {topping.topping.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                          )
                        </Tag>
                        x {topping.quantity}
                      </div>
                    )),
                }
,                
                {
                  title: "Note",
                  dataIndex: "note",
                  key: "note",
                  onCell: () => ({
                    style: {
                      maxWidth: "200px",
                      textOverflow: "ellipsis",
                      // overflow: "hidden", // Thêm overflow để hiển thị dấu '...'
                      // whiteSpace: "nowrap",
                    },
                  }),
                },
              ]}
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Allorder;
