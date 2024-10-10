import React, { useEffect, useState } from "react";
import { Button, Space, Switch, Table, Tag, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { MdOutlinePreview } from "react-icons/md";

const columns = (editInvoice, updateInvoiceActive) => [
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
      const date = new Date(text);
      // Format date to HH:mm:ss dd-MM-yyyy
      const formattedDate = ` ${String(date.getHours()).padStart(
        2,
        "0"
      )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
        date.getSeconds()
      ).padStart(2, "0")} ${String(date.getDate()).padStart(2, "0")}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${date.getFullYear()}`;
      return formattedDate;
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
    render: (_, record) => (
      <Space size="middle">
        <Tooltip placement="top" title="View detail" color="black">
          <Button
            key={record.key}
            size="small"
            shape="round"
            style={{
              color: "black",
              transition: "all 0.3s ease",
            }}
           
            onClick={() => editInvoice(record)}
          >
            <MdOutlinePreview size={24} />
          </Button>
        </Tooltip>
        <Switch
          checked={record.active}
          onChange={(checked) => {
            updateInvoiceActive(record.id, checked);
          }}
        />
      </Space>
    ),
  },
];

const InvoicesList = ({ invoices, editInvoice, updateInvoiceActive }) => {
  const [data, setData] = useState(invoices);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(invoices);
      setLoading(false);
      setHasData(invoices.length > 0);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: invoices.length,
        },
      });
    }, 1000);
  };

  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
  ]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: sorter.order,
      sortField: sorter.field,
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <Table
      columns={columns(editInvoice, updateInvoiceActive)}
      rowKey="id"
      dataSource={hasData ? data : []}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
      size="small"
      locale={{ emptyText: "Không có dữ liệu" }}
    />
  );
};

export default InvoicesList;
