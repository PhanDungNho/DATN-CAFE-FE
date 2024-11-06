import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../../../services/invoiceService';

const Allorder = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [totalCount, setTotalCount] = useState(0); // Tổng số hóa đơn
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const navigate = useNavigate();
  const service = new invoiceService();
  const username = JSON.parse(localStorage.getItem("user"))?.username;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await service.getInvoicesByCustomer(username);
        setData(response.data);
        setFilteredData(response.data);

        // Tính số lượng đơn hàng cho từng trạng thái
        const counts = {};
        let total = 0; // Biến để lưu tổng số đơn hàng
        response.data.forEach(order => {
          counts[order.orderStatus] = (counts[order.orderStatus] || 0) + 1;
          total += 1; // Tăng tổng số đơn hàng
        });
        setStatusCounts(counts);
        setTotalCount(total); // Lưu tổng vào state
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
        message.error('Không thể lấy dữ liệu hóa đơn.');
      }
    };

    fetchInvoices();
  }, []);

  const handleDetailClick = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === 'ALL') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(order => order.orderStatus === status));
    }
  };

  const columns = [
    {
      title: 'Order (Số thứ tự)',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // Tính số thứ tự trang
    },
    {
      title: 'Created time',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (text) => new Date(text).toLocaleString('vi-VN'),
    },
    {
      title: 'Order type',
      dataIndex: 'orderType',
      key: 'orderType',
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Payment status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
    {
      title: 'Order status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
    },
    {
      title: 'Shipping fee',
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: 'Total amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleDetailClick(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        {/* Các nút lọc với số lượng đơn hàng */}
        {['ALL', 'UNCONFIRMED', 'PROCESSING', 'DELIVERING', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(status => (
          <Button
            key={status}
            type={statusFilter === status ? 'primary' : 'default'}
            onClick={() => handleFilterChange(status)}
            style={{ marginRight: '8px' }}
          >
            {status} {status === 'ALL' ? `(${totalCount})` : `(${statusCounts[status] || 0})`}
          </Button>
        ))}
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '50'],
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />

      <Modal
        title="Chi tiết đơn hàng"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p><strong>ID:</strong> {selectedRecord.id}</p>
            <p><strong>Thời gian tạo:</strong> {new Date(selectedRecord.createdTime).toLocaleString('vi-VN')}</p>
            <p><strong>Loại đơn hàng:</strong> {selectedRecord.orderType}</p>
            <p><strong>Phương thức thanh toán:</strong> {selectedRecord.paymentMethod}</p>
            <p><strong>Trạng thái thanh toán:</strong> {selectedRecord.paymentStatus}</p>
            <p><strong>Trạng thái đơn hàng:</strong> {selectedRecord.orderStatus}</p>
            <p><strong>Phí vận chuyển:</strong> {selectedRecord.shippingFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
            <p><strong>Tổng số tiền:</strong> {selectedRecord.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Allorder;