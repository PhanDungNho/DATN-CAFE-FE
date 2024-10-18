import React, { useEffect, useState } from "react";
import {Select, Space, Switch, Table, Tag } from "antd";
import moment from "moment";
 
import { EyeOutlined,EyeInvisibleOutlined } from '@ant-design/icons';
const columns = (updateOrderActive, updateOrder) => [
  {
    title: "Order ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    align: "center",
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
    dataIndex: "createtime",
    key: "createdtime",
    align: "center",
    render: (text) => {
      return moment(text).format("HH:mm:ss DD-MM-YYYY");
    },
  },
  {
    title: "Total Amount",
    dataIndex: "totalalount",
    key: "totalalount",
    align: "center",
    render: (text) => (text ? text.toLocaleString() : "0"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    align: "center",
  },
  {
    title: "Order Type",
    dataIndex: "ordertype",
    key: "ordertype",
    align: "center",
  },
  {
    title: "Payment Method",
    dataIndex: "paymentmethod",
    key: "paymentmethod",
    align: "center",
  },
  {
    title: "Active",
    dataIndex: "active",
    key: "active",
    width: 80,
    render: (_, { active }) => {
      let color = active ? "green" : "volcano";
      let statusText = active ? "Active" : "Inactive";
      return <Tag color={color}>{statusText}</Tag>;
    },
  },
  {
    title: "Action",
    key: "action",
    width: 150,
    align: "center",
    render: (_, record) => {
      const statusOptions = {
        PENDING_PAYMENT: [
          { value: "PENDING_PAYMENT", label: "Chờ thanh toán" },
          { value: "ORDERED", label: "Đã đặt hàng" },
          { value: "CANCELED", label: "Hủy" },
        ],
        ORDERED: [
          { value: "ORDERED", label: "Đã đặt hàng" },
          { value: "IN_DELIVERY", label: "Đang giao" },
          { value: "CANCELED", label: "Hủy" },
        ],
        IN_DELIVERY: [
          { value: "IN_DELIVERY", label: "Đang giao" },
          { value: "COMPLETED", label: "Hoàn thành" },
        ],
        COMPLETED: [{ value: "COMPLETED", label: "Hoàn thành" }],
        CANCELED: [{ value: "CANCELED", label: "Hủy" }],
      };

      return (
        <Space size="middle">
          <Select
            defaultValue={record.status}
            style={{ width: 150 }}
            options={statusOptions[record.status]}
            onChange={(value) => {
              updateOrder(record.id, { status: value });
            }}
          />
          <Switch
            checked={record.active}
            onChange={(checked) => {
              updateOrderActive(record.id, checked);
            }}
          />
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
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const expandedRowRender = (record) => {
    const expandDataSource = (record.orderdetails || []).map(
      (detail, index) => ({
        key: detail.id.toString(),
        id: index + 1,
        productName: detail.productVariant.product.name,
        quantity: detail.quantity,
        price: detail.momentprice,
        size: detail.productVariant.size.name,
        toppings: detail.orderdetailtoppings
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
          style={{ paddingBottom: 20, paddingRight: 40, paddingTop: 20, }}
          bordered
        />
      </>
    );
  };

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(invoices);
      setLoading(false);
      setHasData(invoices.length > 0);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: invoices.length,
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
    <Table
      columns={columns(updateOrderActive, updateOrder)}
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
        defaultExpandedRowKeys: ["0"]
        ,
        // Customizing expand/collapse icons to use eye and eyeline icons
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <EyeInvisibleOutlined onClick={(e) => onExpand(record, e)} />
          ) : (
            <EyeOutlined onClick={(e) => onExpand(record, e)} />
          )

      }}
    />
  );
};

export default InvoicesList;
