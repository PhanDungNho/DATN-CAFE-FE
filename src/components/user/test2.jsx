import React, { useState } from 'react';
import { Table } from 'antd';

const StudentTable = () => {
  const [pageSize, setPageSize] = useState(10); // State để quản lý pageSize
  const [currentPage, setCurrentPage] = useState(1); // State để quản lý page hiện tại

  const data = [
    { key: '1', id: 'SV001', name: 'Nguyễn Văn A', age: 20, class: 'K19CT', major: 'Công nghệ thông tin' },
    { key: '2', id: 'SV002', name: 'Trần Thị B', age: 19, class: 'K20KT', major: 'Kinh tế' },
    { key: '3', id: 'SV003', name: 'Lê Văn C', age: 21, class: 'K18MM', major: 'Marketing' },
    { key: '4', id: 'SV004', name: 'Phạm Thị D', age: 20, class: 'K19CT', major: 'Công nghệ thông tin' },
    { key: '5', id: 'SV005', name: 'Nguyễn Văn E', age: 22, class: 'K17KT', major: 'Kinh tế' },
    { key: '6', id: 'SV006', name: 'Lê Thị F', age: 19, class: 'K20MM', major: 'Marketing' },
    { key: '7', id: 'SV007', name: 'Trần Văn G', age: 20, class: 'K19CT', major: 'Công nghệ thông tin' },
    { key: '8', id: 'SV008', name: 'Phạm Thị H', age: 21, class: 'K18KT', major: 'Kinh tế' },
    { key: '9', id: 'SV009', name: 'Nguyễn Văn I', age: 19, class: 'K20MM', major: 'Marketing' },
    { key: '10', id: 'SV010', name: 'Lê Văn J', age: 22, class: 'K17CT', major: 'Công nghệ thông tin' },
    { key: '11', id: 'SV011', name: 'Trần Thị K', age: 20, class: 'K19KT', major: 'Kinh tế' },
    { key: '12', id: 'SV012', name: 'Phạm Văn L', age: 19, class: 'K20CT', major: 'Công nghệ thông tin' },
    { key: '13', id: 'SV013', name: 'Nguyễn Văn M', age: 21, class: 'K18MM', major: 'Marketing' },
    { key: '14', id: 'SV014', name: 'Lê Thị N', age: 20, class: 'K19KT', major: 'Kinh tế' },
    { key: '15', id: 'SV015', name: 'Trần Văn O', age: 22, class: 'K17CT', major: 'Công nghệ thông tin' },
    { key: '16', id: 'SV016', name: 'Phạm Thị P', age: 19, class: 'K20MM', major: 'Marketing' },
    { key: '17', id: 'SV017', name: 'Nguyễn Văn Q', age: 20, class: 'K19CT', major: 'Công nghệ thông tin' },
    { key: '18', id: 'SV018', name: 'Lê Văn R', age: 21, class: 'K18KT', major: 'Kinh tế' },
    { key: '19', id: 'SV019', name: 'Trần Thị S', age: 19, class: 'K20MM', major: 'Marketing' },
    { key: '20', id: 'SV020', name: 'Phạm Văn T', age: 22, class: 'K17CT', major: 'Công nghệ thông tin' },
    { key: '21', id: 'SV021', name: 'Nguyễn Văn U', age: 20, class: 'K19KT', major: 'Kinh tế' },
    { key: '22', id: 'SV022', name: 'Lê Thị V', age: 19, class: 'K20CT', major: 'Công nghệ thông tin' },
    { key: '23', id: 'SV023', name: 'Trần Văn W', age: 21, class: 'K18MM', major: 'Marketing' },
    { key: '24', id: 'SV024', name: 'Phạm Thị X', age: 20, class: 'K19KT', major: 'Kinh tế' },
    { key: '25', id: 'SV025', name: 'Nguyễn Văn Y', age: 22, class: 'K17CT', major: 'Công nghệ thông tin' },
{ key: '26', id: 'SV026', name: 'Lê Văn Z', age: 19, class: 'K20MM', major: 'Marketing' },
    { key: '27', id: 'SV027', name: 'Trần Thị AA', age: 20, class: 'K19CT', major: 'Công nghệ thông tin' },
    { key: '28', id: 'SV028', name: 'Phạm Văn BB', age: 21, class: 'K18KT', major: 'Kinh tế' },
    { key: '29', id: 'SV029', name: 'Nguyễn Văn CC', age: 19, class: 'K20MM', major: 'Marketing' },
    { key: '30', id: 'SV030', name: 'Lê Thị DD', age: 22, class: 'K17CT', major: 'Công nghệ thông tin' },
  ];

  const columns = [
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Chuyên Ngành',
      dataIndex: 'major',
      key: 'major',
    },
  ];

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
    </div>
  );
};

export default StudentTable;