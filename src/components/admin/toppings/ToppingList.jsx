import React, { useEffect, useState } from 'react';
import { Button, Image, Space, Switch, Table, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ToppingService from '../../../services/toppingService';

const columns = (editTopping, updateToppingActive) => [
  {
    title: "Topping ID",
    dataIndex: "id",
    key: "id",
    width: 120,
    align: "center",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    width: 80,
    render: (_, record) => (
      <Space size="middle">
        <Image
          src={ToppingService.getToppingLogoUrl(record.image)}
        ></Image>
      </Space>
    )
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
      pageSize: 10, 
    },
  });

  const fetchData = () => {
    setLoading(true);
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
  }, [toppings]); 

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: sorter.order,
      sortField: sorter.field,
    });

    if (pagination.pageSize !== tableParams.pagination.pageSize) {
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
      size="small"
      locale={{ emptyText: 'No toppings found' }}
    />
  );
};

export default ToppingList;
