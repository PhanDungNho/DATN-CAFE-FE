import React, { useEffect, useState } from "react";
import { Button, Space, Switch, Table, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";

const columns = (editCategory, updateCategoryActive) => [
  {
    title: "Category ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    align: "center",
  },
  {
    title: "Category Name",
    dataIndex: "name",
    key: "name",
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
          onClick={() => editCategory(record)}
        >
          <EditOutlined style={{ marginRight: 8 }} /> Edit
        </Button>
        <Switch
          checked={record.active}
          onChange={(checked) => {
            updateCategoryActive(record.id, checked);
          }}
        />
      </Space>
    ),
  },
];

const CategoryList = ({ categories, editCategory, updateCategoryActive }) => {
  const [data, setData] = useState(categories);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      // Simulate fetching data
      setTimeout(() => {
        setData(categories);
        setLoading(false);
        setHasData(categories.length > 0);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            total: categories.length,
          },
        }));
      }, 1500);
    };

    fetchData();
  }, [categories]); // Fetch new data when categories change

  return (
    <Table
      columns={columns(editCategory, updateCategoryActive)}
      rowKey="id"
      dataSource={hasData ? data : []}
      pagination={tableParams.pagination}
      loading={loading}
      size="small"
      locale={{ emptyText: "No categories found" }}
    />
  );
};

export default CategoryList;
