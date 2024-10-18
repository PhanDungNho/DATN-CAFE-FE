import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Space, Switch, Table, Tag } from "antd";

const columns = (editProduct, updateProductActive) => [
  {
    title: "ID",
    dataIndex: "id",
    width: "20%",
    key: "id",
    sorter: (a, b) => Number(b.id) - Number(a.id),
    showSorterTooltip: false,
  },
  {
    title: "Product",
    key: "product",
    dataIndex: "size",
    render: (_, record) => {
      return record.product ? record.product.name : "No product";
    },
  },
  {
    title: "Price",
    width: "20%",
    dataIndex: "price",
    key: "price",
    render: (text) => text.toLocaleString(),
    filters: [
      { text: "< 20000", value: "lessThan100" },
      { text: "20000 - 40000", value: "100to200" },
      { text: "> 40000", value: "greaterThan200" },
    ],
    onFilter: (value, record) => {
      const price = record.price;
      if (value === "lessThan100") return price < 20000;
      if (value === "100to200") return price >= 20000 && price <= 40000;
      if (value === "greaterThan200") return price > 40000;
      return false;
    },
  },
  {
    title: "Size",
    key: "size",
    dataIndex: "size",
    render: (_, record) => {
      return record.size ? record.size.name : "No size";
    },
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

const ProductVariantList = ({
  productVariants,
  editProduct,
  updateProductActive,
}) => {
  const [data, setData] = useState(productVariants);
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
      setData(productVariants);
      setLoading(false);
      setHasData(productVariants.length > 0);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: productVariants.length,
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
      setData([productVariants]);
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

export default ProductVariantList;
