import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Space, Switch, Table, Tag } from "antd";

const columns = (editProduct, updateProductActive) => [
  {
    title: "Product ID",
    dataIndex: "id",
    width: "20%",
    key: "id",
    sorter: (a, b) => Number(b.id) - Number(a.id),
    showSorterTooltip: false,
  },
  {
    title: "Product Name",
    dataIndex: "name",
    width: "20%",
    key: "name",
  },
  {
    title: "Category",
    key: "category",
    render: (_, record) => {
      return record.category ? record.category.name : "No category";
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
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
        <Button
          key={record.key}
          type="primary"
          size="small"
          onClick={() => editProduct(record)}
        >
          <EditOutlined style={{ marginRight: 8 }} /> Edit
        </Button>
        <Switch
          checked={record.active}
          onChange={(checked) => {
            updateProductActive(record.id, checked);
          }}
        />
      </Space>
    ),
  },
];

const ProductList = ({ products, editProduct, updateProductActive }) => {
  const [data, setData] = useState(products);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(products);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(products);
      setLoading(false);
      setHasData(products.length > 0);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: products.length,
        },
      });
    }, 1000);
  };

  useEffect(fetchData, [
    products,
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
      columns={columns(editProduct, updateProductActive)}
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

export default ProductList;
