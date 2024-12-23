import React, { useEffect, useState } from 'react';
import { Table, Checkbox, message, Modal } from 'antd';  // Thêm Modal ở đây
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { postAuthority, deleteAuthority, getAuthorities } from '../../../redux/actions/authorityAction';

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

    const dispatch = useDispatch();

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
        if (!acc || !role || !authorities) return null;
        return authorities.find(ur => ur.account?.username === acc.username && ur.role?.id === role.id) || null;
    };

    const handleCheckboxChange = (acc, role) => {
        const authority = authorityOf(acc, role);
        const action = authority ? 'revoke' : 'grant';
        Modal.confirm({
            title: `Are you sure you want to ${action} this authority?`,
            onOk() {
                if (authority) {
                    dispatch(deleteAuthority(authority.id))
                        .then(() => {
                            dispatch(getAuthorities());
                        })
                        
                } else {
                    const newAuthority = { username: acc.username, roleId: role.id };
                    dispatch(postAuthority(newAuthority))
                        .then(() => {
                            dispatch(getAuthorities());
                        })
                }
            },
            onCancel() {
            },
        });
    };

    const renderCheckbox = (record, role) => {
        const authority = authorityOf(record, role);
        return (
            <Checkbox
                checked={!!authority}
                onChange={() => handleCheckboxChange(record, role)}
            />
        );
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
            render: (_, record) => renderCheckbox(record, { id: 1, name: 'Admin' }), // Role ID 1 is ADMIN
        },
        {
            title: 'Staff',
            key: 'staff',
            render: (_, record) => renderCheckbox(record, { id: 2, name: 'Staff' }), // Role ID 2 is STAFF
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
