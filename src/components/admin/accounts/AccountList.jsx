// src/components/AccountList.jsx

import React, { useEffect, useState } from 'react';
import { Button, Image, Space, Switch, Table, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import AccountService from '../../../services/accountService';

const columns = (editAccount, updateAccountActive) => [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    width: 120,
    align: "center",
  },
  {
    title: "Hình ảnh",
    dataIndex: "image",
    key: "image",
    width: 80,
    render: (_, record) => (
      <Space size="middle">
        <Image
          src={AccountService.getAccountLogoUrl(record.image)}
        ></Image>
      </Space>
    )
  },
  {
    title: "Họ và tên",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Số tiền đã trả",
    dataIndex: "amountPaid",
    key: "amountPaid",
    // width: 40,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Trạng thái",
    dataIndex: "active",
    key: "active",
    // width: 100,
    render: (_, { active }) => {
      let color = active ? "green" : "volcano";
      let statusText = active ? "Hoạt động" : "Không hoạt động";
      return <Tag color={color}>{statusText}</Tag>;
    },
  },
  {
    title: "Hành động",
    key: "action",
    // width: 150,
    align: "center",
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          size="small"
          onClick={() => editAccount(record)}
        >
          <EditOutlined style={{ marginRight: 8 }} /> Edit
        </Button>
        <Switch
          checked={record.active}
          onChange={(checked) => {
            updateAccountActive(record.username, checked);
          }}
        />
      </Space>
    ),
  },
];

const AccountList = ({ accounts, editAccount, updateAccountActive }) => {
  const [data, setData] = useState(accounts);
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
      setData(accounts);
      setLoading(false);
      setHasData(accounts.length > 0);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: accounts.length,
        },
      }));
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, [accounts]); 

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: sorter.order,
      sortField: sorter.field,
    });

    if (pagination.pageSize !== tableParams.pagination.pageSize) {
      setData(accounts);
    }
  };

  return (
    <Table
      columns={columns(editAccount, updateAccountActive)}
      rowKey="username"
      dataSource={hasData ? data : []}
      pagination={{
        ...tableParams.pagination,
      }}
      loading={loading}
      onChange={handleTableChange}
      size="small"
      locale={{ emptyText: 'Không tìm thấy tài khoản nào' }}
    />
  );
};

export default AccountList;
