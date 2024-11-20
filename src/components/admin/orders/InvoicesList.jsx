import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Space, Switch, Table, Tag } from "antd";
import moment from "moment";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { BsListColumnsReverse } from "react-icons/bs";

const columns = (updateOrderActive, updateOrder, showModal) => [
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
    // width: 150,
    align: "left",
    render: (_, record) => {
      return record.paymentStatus === "PAID" ? (
        <Tag color="green">PAID</Tag>
      ) : (
        <Tag color="volcano">UNPAID</Tag>
      );
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
        PROCESSING: [
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

      return (
        <Select
          defaultValue={record.orderStatus}
          style={{ width: 150 }}
          options={statusOptions[record.orderStatus]}
          onChange={(value) => {
            updateOrder(record.id, { orderStatus: value });
          }}
        />
      );
    },
  },
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
    render: (text) => text.toLocaleString(),
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

const InvoicesList = ({
  invoices,
  editInvoice,
  updateOrderActive,
  updateOrder,
}) => {
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
    const expandDataSource = (record.orderdetails || []).map(
      (detail, index) => ({
        key: detail.id.toString(),
        id: index + 1,
        productName: detail.productVariant.product.name,
        quantity: detail.quantity,
        price: detail.momentPrice,
        size: detail.productVariant.size.name,
        toppings: detail.orderDetailToppings
          .map((topping) => topping.topping.name)
          .join(", "),
        note: detail.note,
      })
    );
    return (
      <>
        <Table
          columns={expandColumns}
          dataSource={expandDataSource}
          pagination={false}
          style={{ paddingBottom: 20, paddingRight: 40, paddingTop: 20 }}
          bordered
        />
      </>
    );
  };

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

  useEffect(() => {
    fetchData();
    setData(invoices);
  }, [invoices]);

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

  return (
    <>
      <Table
        columns={columns(updateOrderActive, updateOrder, showModal)}
        rowKey="id"
        dataSource={hasData ? data : []}
        pagination={{ ...tableParams.pagination }}
        loading={loading}
        onChange={handleTableChange}
        size="small"
        bordered
        locale={{ emptyText: "Không có dữ liệu" }}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
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
                        Link thanh toán
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
