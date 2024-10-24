import React, { useEffect, useState } from 'react';
import { Table, Checkbox } from 'antd';
import PropTypes from 'prop-types';

const AuthorityList = ({ accounts, authorities }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
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
            setTimeout(() => {
                setData(accounts);
                setLoading(false);
                setTableParams((prev) => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        total: Array.isArray(accounts) ? accounts.length : 0,
                    },
                }));
            }, 500);
        };

        fetchData();
    }, [accounts]);

    const handleTableChange = (pagination) => {
        setTableParams({
            pagination,
        });
    };
    const authorityOf = (acc, role) => {
        if (authorities) {
            return authorities.find(ur => 
                ur.account.username === acc.username && ur.role.id === role.id
            );
        }
        return null;  // Nếu không tìm thấy quyền, trả về null
    };
    const renderCheckbox = (record, role) => {
        const authority = authorityOf(record, role);
        return <Checkbox checked={!!authority} />;
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
            title: 'Admin',
            key: 'admin',
            render: (_, record) => renderCheckbox(record, { id: 1 }), // ID 1 là ADMIN
        },
        {
            title: 'Staff',
            key: 'staff',
            render: (_, record) => renderCheckbox(record, { id: 2 }), // ID 2 là STAFF
        },
        {
            title: 'User',
            key: 'user',
            render: (_, record) => renderCheckbox(record, { id: 3 }), // ID 3 là USER
        },
    ];
    return (
        <Table
            columns={columns}
            rowKey={(record) => record.id || (record.account ? record.account.username : record.key)}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            locale={{ emptyText: 'No accounts found' }}
            onChange={handleTableChange}
        />
    );
};

AuthorityList.propTypes = {
    accounts: PropTypes.array.isRequired,
    authorities: PropTypes.array.isRequired,

};

export default AuthorityList;
