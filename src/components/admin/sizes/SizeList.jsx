// src/components/SizeList.jsx

import React, { useEffect, useState } from 'react';
import { Button, Space, Switch, Table, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const SizeList = ({ sizes,editSize, updateSizeActive }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      // Simulate fetching data
      setTimeout(() => {
        setData(sizes);
        setLoading(false);
        setHasData(Array.isArray(sizes) && sizes.length > 0);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            total: Array.isArray(sizes) ? sizes.length : 0,
          },
        }));
      }, 500); // Reduced timeout for better UX
    };

    fetchData();
  }, [sizes]);

  const handleTableChange = (pagination) => {
    setTableParams({
      pagination,
    });
  };

  const columns = [
    {
      title: 'Size ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: 'Size Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      align: 'center',
      render: (active) => {
        let color = active ? 'green' : 'volcano';
        let statusText = active ? 'Active' : 'Inactive';
        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
           <Button
          key={record.key}
          type="primary"
          size="small"
          onClick={() => editSize(record)}
        >
          <EditOutlined style={{ marginRight: 8 }} /> Edit
        </Button>
          <Switch
            checked={record.active}
            onChange={(checked) => {
              updateSizeActive(record.id, checked);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey="id"
      dataSource={hasData ? data : []}
      pagination={tableParams.pagination}
      loading={loading}
      size="small"
      locale={{ emptyText: 'No sizes found' }}
      onChange={handleTableChange}
    />
  );
};

SizeList.propTypes = {
  sizes: PropTypes.array.isRequired,
  updateSizeActive: PropTypes.func.isRequired,
};

export default SizeList;
