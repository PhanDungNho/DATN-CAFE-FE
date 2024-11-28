import React from 'react';
import { Row, Col, Card, Table } from 'antd';

const Queue = ({ ords }) => {
  // Define columns for the table
  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
  
 
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Topping',
      dataIndex: 'toppings',
      key: 'toppings',
      render: (toppings) => toppings.map((topping) => `${topping.name}`),
    },
  ];

  // Function to map the order details into a table data format
  const mapOrderDetailsToTableData = (orderDetails) =>
    orderDetails.map((detail) => ({
        key: detail.id,
        productName: `${detail.productVariant.product.name} - ${detail.productVariant.size.name}`, // Nối chuỗi tên sản phẩm và kích thước
        
        note: detail.note || 'Do not have',
        toppings: detail.orderdetailtoppings.map((topping) => ({
          name: topping.topping.name,
          price: topping.topping.price,
        })),
      }));
      

  return (
    <Row gutter={[16, 16]}>
      {ords.map((order) => (
        <Col xs={24} sm={12} md={12} key={order.id}>
          <Card title={`Waiting line ${order.id}`}>
            <Table
              columns={columns}
              dataSource={mapOrderDetailsToTableData(order.orderdetails)}
              pagination={false} // Disable pagination for smaller tables
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Queue;
