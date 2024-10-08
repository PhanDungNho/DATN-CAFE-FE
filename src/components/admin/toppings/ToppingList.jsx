// src/components/ToppingList.jsx

import React, { useEffect, useState } from 'react';
import { Button, Space, Switch, Table, Tag, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const columns = (editTopping, updateToppingActive) => [
  {
    title: "Topping ID",
    dataIndex: "id",
    key: "id",
    width: 120,
    align: "center",
  },
  {
    title: "Topping Image",
    dataIndex: "image",
    key: "image",
    render: (text) => text ? <img src={text} alt="Topping Image" style={{ width: '50px', height: '50px' }} /> : 'No Image',
  },
  {
    title: "Topping Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Topping Price",
    dataIndex: "price",
    key: "price",
    render: (text) => `${text} VNĐ`,
  },
  {
    title: "Active",
    dataIndex: "active",
    key: "active",
    width: 100,
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
          type="primary"
          size="small"
          onClick={() => editTopping(record)}
        >
          <EditOutlined style={{ marginRight: 8 }} /> Edit
        </Button>
        <Switch
          checked={record.active}
          onChange={(checked) => {
            updateToppingActive(record.id, checked);
          }}
        />
      </Space>
    ),
  },
];

const ToppingList = ({ toppings, editTopping, updateToppingActive }) => {
  const [data, setData] = useState(toppings);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10, // Đã sửa 'pageTopping' thành 'pageSize'
      // total: 0,
    },
  });

  const fetchData = () => {
    setLoading(true);
    // Giả lập việc fetch dữ liệu từ server
    setTimeout(() => {
      setData(toppings);
      setLoading(false);
      setHasData(toppings.length > 0);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: toppings.length,
        },
      }));
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, [toppings]); // Thay đổi phụ thuộc để fetch dữ liệu khi toppings thay đổi

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: sorter.order,
      sortField: sorter.field,
    });

    // Nếu pageSize thay đổi, có thể cần điều chỉnh dữ liệu hoặc fetch lại
    if (pagination.pageSize !== tableParams.pagination.pageSize) {
      // Tùy thuộc vào cách bạn fetch dữ liệu, có thể cần fetch lại dữ liệu với pageSize mới
      // Ở đây, tôi giả định bạn fetch lại toàn bộ dữ liệu
      setData(toppings);
    }
  };

  return (
    <Table
      columns={columns(editTopping, updateToppingActive)}
      rowKey="id"
      dataSource={hasData ? data : []}
      pagination={{
        ...tableParams.pagination,
      }}
      loading={loading}
      onChange={handleTableChange}
      size="small" // Đã sửa từ 'topping' thành 'size'
      locale={{ emptyText: 'No toppings found' }}
    />
  );
};

export default ToppingList;
