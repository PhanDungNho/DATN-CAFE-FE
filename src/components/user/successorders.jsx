import React, { useState } from 'react';
import { Table, Tag, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom'; // Sử dụng để điều hướng

const Successorder = () => {
  const [pageSize, setPageSize] = useState(10); // State để quản lý pageSize
  const [currentPage, setCurrentPage] = useState(1); // State để quản lý page hiện tại
  const [isModalVisible, setIsModalVisible] = useState(false); // State để quản lý hiển thị modal
  const [selectedRecord, setSelectedRecord] = useState(null); // State để lưu record được chọn
  const navigate = useNavigate(); // Sử dụng hook để điều hướng

  const data = [
    { key: '1', id: 'HD001', name: 'Sản phẩm A', quantity: 2, major: '200,000 VND', active: 'Hoàn thành', customer: 'Nguyễn Văn B', orderDate: '2024-09-25' },
    { key: '2', id: 'HD002', name: 'Sản phẩm B', quantity: 1, major: '150,000 VND', active: 'Hoàn thành', customer: 'Trần Thị C', orderDate: '2024-09-24' },
    { key: '3', id: 'HD003', name: 'Sản phẩm C', quantity: 5, major: '500,000 VND', active: 'Hoàn thành', customer: 'Lê Quang D', orderDate: '2024-09-23' },
    { key: '4', id: 'HD004', name: 'Sản phẩm D', quantity: 3, major: '300,000 VND', active: 'Hoàn thành', customer: 'Phạm Văn E', orderDate: '2024-09-22' },
  ];

  const getStatusTag = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return <Tag color="blue">{status}</Tag>;
      case 'Hoàn thành':
        return <Tag color="green">{status}</Tag>;
      case 'Đã hủy':
        return <Tag color="red">{status}</Tag>;
      case 'Đang vận chuyển':
        return <Tag color="orange">{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const handleDetailClick = (record) => {
    setSelectedRecord(record); // Cập nhật record đã chọn
    setIsModalVisible(true); // Mở modal
  };

  const handleReorderClick = (record) => {
    // Điều hướng đến trang mua lại sản phẩm
    navigate(`/reorder/${record.id}`);
  };

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (status) => getStatusTag(status), // Gọi hàm để lấy Tag theo trạng thái
    },
    {
      title: 'Hoạt động',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleDetailClick(record)}
          >
            Xem chi tiết
          </Button>
          <Button
            type="default"
            onClick={() => handleReorderClick(record)}
          >
            Mua lại
          </Button>
        </div>
      ),
    },
  ];

  const handleModalClose = () => {
    setIsModalVisible(false); // Đóng modal
    setSelectedRecord(null); // Reset record đã chọn
  };

  return (
    <div style={{ padding: '20px' }}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true, // Cho phép thay đổi số dòng
          pageSizeOptions: ['10', '20', '30', '50'], // Các tùy chọn số dòng
          onChange: (page, pageSize) => {
            setCurrentPage(page); // Cập nhật page hiện tại
            setPageSize(pageSize); // Cập nhật pageSize khi thay đổi
          },
        }}
      />

      {/* Modal hiển thị chi tiết sản phẩm */}
      <Modal
        title="Chi tiết sản phẩm"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null} // Không hiển thị footer
      >
        {selectedRecord && (
          <div>
            <p><strong>Mã hóa đơn:</strong> {selectedRecord.id}</p>
            <p><strong>Tên sản phẩm:</strong> {selectedRecord.name}</p>
            <p><strong>Giá:</strong> {selectedRecord.major}</p>
            <p><strong>Thành tiền:</strong> {selectedRecord.major}</p>
            <p><strong>Trạng thái:</strong> {getStatusTag(selectedRecord.active)}</p>
            <p><strong>Người đặt:</strong> {selectedRecord.customer}</p>
            <p><strong>Ngày đặt:</strong> {selectedRecord.orderDate}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Successorder;
