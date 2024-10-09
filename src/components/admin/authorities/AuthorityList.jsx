// src/components/AuthorityList.jsx

import React, { useEffect, useState } from 'react';
import { Button, Space, Switch, Table, Tag, Checkbox, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const AuthorityList = ({ sizes, editSize, updateSizeActive, updateAuthorityRoles }) => {
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

    // Handler for checkbox changes
    const handleRoleChange = (record, role, checked) => {
        const updatedRecord = { ...record, [role]: checked };
        // Dispatch Redux action to update roles in backend
        updateAuthorityRoles(updatedRecord)
            .then(() => {
                // Update local state on success
                setData((prevData) =>
                    prevData.map((item) => (item.id === record.id ? updatedRecord : item))
                );
                message.success(`Updated ${role} role for ${record.name}`);
            })
            .catch((error) => {
                message.error(`Failed to update ${role} role for ${record.name}`);
                console.error(error);
            });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: 200,
            align: 'center',
            key: 'name',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            width: 150,
            align: 'center',
            render: (text, record) => (
                <Checkbox
                    checked={record.customer}
                    onChange={(e) => handleRoleChange(record, 'customer', e.target.checked)}
                />
            ),
        },
        {
            title: 'Staff',
            dataIndex: 'staff',
            key: 'staff',
            width: 150,
            align: 'center',
            render: (text, record) => (
                <Checkbox
                    checked={record.staff}
                    onChange={(e) => handleRoleChange(record, 'staff', e.target.checked)}
                />
            ),
        },
        {
            title: 'Director',
            dataIndex: 'director',
            key: 'director',
            width: 150,
            align: 'center',
            render: (text, record) => (
                <Checkbox
                    checked={record.director}
                    onChange={(e) => handleRoleChange(record, 'director', e.target.checked)}
                />
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
            size="middle"
            locale={{ emptyText: 'No authorities found' }}
            onChange={handleTableChange}
        />
    );
};

AuthorityList.propTypes = {
    sizes: PropTypes.array.isRequired,
    editSize: PropTypes.func.isRequired,
    updateSizeActive: PropTypes.func.isRequired,
    updateAuthorityRoles: PropTypes.func.isRequired, // New prop
};

export default AuthorityList;
