import React, { useEffect, useState } from "react";
import {
  Button,
  message,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { BsListColumnsReverse } from "react-icons/bs";
import { printBill } from "../../user/printBill";
import PaymentService from "../../../services/PaymentService";
import { getInvoices } from "../../../redux/actions/invoiceAction";
const paymentService = new PaymentService();

const columns = (updateOrderActive, updateOrder, showModal, getInvoices) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    align: "center",
    sorter: (b, a) => Number(b.id) - Number(a.id),
    showSorterTooltip: false,
  },
  {
    title: "Cashier",
    dataIndex: "cashier",
    key: "cashier",
    align: "center",
    render: (_, record) => {
      return record.cashier ? record.cashier.username : "No cashier";
    },
  },
  {
    title: "Time",
    dataIndex: "createdTime",
    key: "createdTime",
    align: "center",
    render: (text) => moment(text).format("HH:mm:ss DD-MM-YYYY"),
  },
  {
    title: "Total Amount",
    dataIndex: "totalAmount",
    key: "totalAmount",
    align: "center",
    render: (text) => (text ? text.toLocaleString() : "0"),
  },
  {
    title: "Order Type",
    dataIndex: "orderType",
    key: "orderType",
    align: "center",
  },
  {
    title: "Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    align: "center",
  },
  {
    title: "Payment",
    key: "paymentStatus",
    align: "left",
    render: (_, record) => {
      if (record.paymentStatus === "PAID") {
        return <Tag color="green">PAID</Tag>;
      } else if (record.paymentStatus === "REFUND") {
        return <Tag color="grey">REFUND</Tag>;
      } else {
        return <Tag color="volcano">UNPAID</Tag>;
      }
    },
  },
  {
    title: "Order Status",
    key: "orderStatus",
    align: "center",
    render: (_, record) => {
      const statusOptions = {
        UNCONFIRMED: [
          { value: "UNCONFIRMED", label: "UNCONFIRMED" },
          { value: "PROCESSING", label: "PROCESSING" },
          { value: "CANCELLED", label: "CANCELLED" },
        ],
        PROCESSING: record.orderType === "IN_STORE"
          ? [
              { value: "CANCELLED", label: "CANCELLED" },
              { value: "COMPLETED", label: "COMPLETED" },
            ]
          : [
              { value: "PROCESSING", label: "PROCESSING" },
              { value: "DELIVERING", label: "DELIVERING" },
              { value: "CANCELLED", label: "CANCELLED" },
            ],
        DELIVERING: [
          { value: "DELIVERING", label: "DELIVERING" },
          { value: "DELIVERED", label: "DELIVERED" },
        ],
        DELIVERED: [
          { value: "DELIVERED", label: "DELIVERED" },
          { value: "COMPLETED", label: "COMPLETED" },
        ],
        COMPLETED: [{ value: "COMPLETED", label: "COMPLETED" }],
        CANCELLED: [{ value: "CANCELLED", label: "CANCELLED" }],
      };
  
      const handleStatusChange = async (record, value) => {
        try {
          await updateOrder(record.id, { orderStatus: value });

          if (value === "CANCELLED"&& record.transactions[0]) {
            // Giả sử bạn có response từ một dịch vụ trước đó
            const response = await paymentService.refund(
              record.transactions[0]
            );

            // Xử lý phản hồi sau khi hoàn tiền nếu cần
            if (response.status === 200) {
              await getInvoices();
              message.success("Refund successful");
            } else {
              message.error("Refund failed");
            }
          }
        } catch (error) {
          message.error("Error processing refund");
        }
      };
  
      return (
        <Select
          defaultValue={record.orderStatus}
          style={{ width: 150 }}
          options={statusOptions[record.orderStatus]}
          onChange={(value) => {
            handleStatusChange(record, value);
          }}
        />
      );
    },
  }
  ,
  {
    title: "Active",
    dataIndex: "active",
    key: "active",
    width: 80,
    align: "center",
    render: (_, record) => {
      return (
        <Switch
          checked={record.active}
          onChange={(checked) => {
            updateOrderActive(record.id, checked);
          }}
        />
      );
    },
  },
  {
    title: "",
    dataIndex: "createdTime",
    key: "createdTime",
    align: "center",
    render: (_, record) => {
      return (
        <Space size="middle">
          {record.paymentMethod === "ONLINE" && (
            <Button
              onClick={() => {
                showModal(record);
              }}
            >
              <BsListColumnsReverse
                style={{ fontSize: "18px", color: "#4A90E2" }}
              />
            </Button>
          )}
        </Space>
      );
    },
  },
];

const expandColumns = [
  {
    title: "STT",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (text) => (text ? text.toLocaleString() : "0"),
  },
  {
    title: "Size",
    dataIndex: "size",
    key: "size",
  },
  {
    title: "Toppings",
    dataIndex: "toppings",
    key: "toppings",
  },
  {
    title: "Note",
    dataIndex: "note",
    key: "note",
  },
];

const InvoicesList = ({ invoices, updateOrderActive, updateOrder, getInvoices }) => {
  const [data, setData] = useState(invoices);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const expandedRowRender = (record) => {
    return (
      <div style={{ padding: "20px", background: "#f9f9f9" }}>
        {record.fullAddress && (
          <p>
            <strong>Address: </strong>
            {record.fullAddress}
          </p>
        )}
        {record.customer?.username && (
          <p>
            <strong>Customer ID: </strong>
            {record.customer.username}
          </p>
        )}
        {record.shippingFee !== undefined && record.shippingFee > 0 && (
          <p>
            <strong>Shipping fee: </strong>
            {record.shippingFee.toLocaleString() + " VNĐ"}
          </p>
        )}
        <Table
          columns={expandColumns}
          dataSource={expandDataSource(record)}
          pagination={false}
          bordered
        />
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => printBill(record)} // Chức năng in hóa đơn
          >
            Print Bill
          </Button>
        </div>
      </div>
    );
  };

  const expandDataSource = (record) => {
    return (record.orderDetails || []).map((detail, index) => ({
      key: detail.id.toString(),
      id: index + 1,
      productName: detail.productVariant?.product?.name || "N/A",
      quantity: detail.quantity,
      price: detail.momentPrice,
      size: detail.productVariant?.size?.name || "N/A",
      toppings: detail.orderDetailToppings
        .map(
          (topping) =>
            `${topping.topping.name} ${topping.momentPrice.toLocaleString(
              "vi-VN",
              { style: "currency", currency: "VND" }
            )} x ${topping.quantity}`
        )
        .join(", "),
      note: detail.note,
    }));
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      setTimeout(() => {
        const sortedInvoices = [...invoices].sort((a, b) => b.id - a.id);
        setData(sortedInvoices);
        setLoading(false);
        setHasData(sortedInvoices.length > 0);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            total: sortedInvoices.length,
          },
        }));
      }, 1000);
    };

    fetchData();
  }, [invoices]); // Chỉ phụ thuộc vào 'invoices'

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: sorter.order,
      sortField: sorter.field,
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData(invoices);
    }
  };

  console.log("invoice", invoices);
  console.log("data", data);

  return (
    <>
      <Table
        columns={columns(updateOrderActive, updateOrder, showModal, getInvoices)}
        rowKey="id"
        dataSource={hasData ? data : []}
        pagination={{ ...tableParams.pagination }}
        loading={loading}
        onChange={handleTableChange}
        size="small"
        bordered
        locale={{ emptyText: "No data available" }}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: [],
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <EyeInvisibleOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <EyeOutlined onClick={(e) => onExpand(record, e)} />
            ),
        }}
      />
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        key={invoices.id + invoices.createTime}
        width="90%"
      >
        {selectedOrder ? (
          <>
            <p style={{ fontWeight: "800", fontSize: 18 }}>
              Order ID: {selectedOrder.id}
            </p>
            {selectedOrder.transactions.length > 0 ? (
              <Table
                dataSource={selectedOrder.transactions.map(
                  (transaction, index) => ({
                    key: index,
                    orderId: transaction.orderId,
                    amount: transaction.amount,
                    orderType: transaction.orderType,
                    createTime: transaction.createTime,
                    payType: transaction.payType,
                    orderInfo: transaction.orderInfo,
                    payUrl: transaction.payUrl,
                    message: transaction.message,
                  })
                )}
                columns={[
                  {
                    title: "Time",
                    dataIndex: "createTime",
                    key: "createTime",
                    align: "center",
                    render: (text) =>
                      moment(text).format("HH:mm:ss DD-MM-YYYY"),
                  },
                  {
                    title: "Momo Id",
                    dataIndex: "orderId",
                    key: "orderId",
                    align: "center",
                  },
                  {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                    align: "center",
                    render: (text) => (text ? text.toLocaleString() : "0"),
                  },
                  {
                    title: "Order type",
                    dataIndex: "orderType",
                    key: "orderType",
                    align: "center",
                  },
                  {
                    title: "Payment type",
                    dataIndex: "payType",
                    key: "payType",
                    align: "center",
                  },
                  {
                    title: "Info",
                    dataIndex: "orderInfo",
                    key: "orderInfo",
                    align: "center",
                  },
                  {
                    title: "Url",
                    dataIndex: "payUrl",
                    key: "payUrl",
                    align: "center",
                    render: (text) => (
                      <a href={text} target="_blank" rel="noopener noreferrer">
                        Payment link
                      </a>
                    ),
                  },
                  {
                    title: "Result",
                    dataIndex: "message",
                    key: "message",
                    align: "center",
                  },
                ]}
                pagination={false}
                bordered
              />
            ) : (
              <p>No transactions available for this order.</p>
            )}
          </>
        ) : (
          <p>No order selected</p>
        )}
      </Modal>
    </>
  );
};

export default InvoicesList;
