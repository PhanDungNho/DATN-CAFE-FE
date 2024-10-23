// src/components/AuthorityList.jsx

import React, { useEffect, useState } from 'react';
import { Button, Space, Switch, Table, Checkbox } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const AuthorityList = ({ accounts }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasData, setHasData] = useState(true);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageAuthority: 10,
            total: 0,
        },
    });

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            // Simulate fetching data
            setTimeout(() => {
                setData(accounts);
                setLoading(false);
                setHasData(Array.isArray(accounts) && accounts.length > 0);
                setTableParams((prev) => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        total: Array.isArray(accounts) ? accounts.length : 0,
                    },
                }));
            }, 500); // Reduced timeout for better UX
        };

        fetchData();
    }, [accounts]);

    const handleTableChange = (pagination) => {
        setTableParams({
            pagination,
        });
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 250,
            align: 'center',
        },
        {
            title: 'Staff',
            key: 'staff',
            
            render: (_, record) => {
                // Kiểm tra xem roleName có phải là "STAFF" hay không
                const isStaff = record.role?.roleName.toUpperCase() === 'STAFF';
        
                return (
                    <div>
                        <Checkbox checked={isStaff}></Checkbox>
                    </div>
                );
            },
        },
        {
            title: 'Admin',
            key: 'admin',
            render: (_, record) => {
                // Kiểm tra xem roleName có phải là "STAFF" hay không
                const isStaff = record.role?.roleName.toUpperCase() === 'ADMIN';
        
                return (
                    <div>
                        <Checkbox checked={isStaff}></Checkbox>
                    </div>
                );
            },
        },
        {
            title: 'User',
            key: 'user',
            render: (_, record) => {
                // Kiểm tra xem roleName có phải là "STAFF" hay không
                const isStaff = record.role?.roleName.toUpperCase() === 'USER';
        
                return (
                    <div>
                        <Checkbox checked={isStaff}></Checkbox>
                    </div>
                );
            },
        }
    ];

    return (
        <Table
        columns={columns}
        rowKey={(record) => record.id || record.username || record.key} // Fallback to username or index if needed
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        authority="small"
        locale={{ emptyText: 'No accounts found' }}
        onChange={handleTableChange}
    />
    );
};

AuthorityList.propTypes = {
    accounts: PropTypes.array.isRequired,
};

export default AuthorityList;
