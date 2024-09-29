import { Button, Form, Input, Space, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import ContentHeader from "../common/ContentHeader";
import React, { Component } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      currentPage: 1,
    };
  }

  handleSearch = (values) => {
    const { id } = values;
    if (id) {
      this.props.getProduct(id); // Gọi hàm getProduct với id
    } else {
      this.props.getProducts(); // Nếu không có id, lấy tất cả sản phẩm
    }
  };

  handleTableChange = (page, pageSize) => {
    this.setState({
      currentPage: page,
      pageSize: pageSize,
    });
  };

  render() {
    const { navigate } = this.props.router;
    const { products } = this.props;

    return (
      <>
        <ContentHeader
          navigate={navigate}
          title="List Products"
          className="site-page-header"
        ></ContentHeader>

        <Form
          layout="inline"
          name="searchForm"
          className="my-3"
          onFinish={this.handleSearch}
        >
          <Form.Item name="id">
            <Input placeholder="Search product by ID" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form>
        <Table
          dataSource={products}
          size="small"
          rowKey="id"
          pagination={{
            current: this.state.currentPage,
            pageSize: this.state.pageSize,
            onChange: this.handleTableChange,
          }}
        >
          <Column
            title="Product ID"
            key="id"
            dataIndex="id"
            width={100}
            align="center"
          />
          <Column title="Product Name" key="name" dataIndex="name" />
          <Column
            title="Description"
            key="description"
            dataIndex="description"
          />
          <Column
            title="Active"
            key="active"
            dataIndex="active"
            width={80}
            render={(_, { active }) => {
              let color = active ? "green" : "volcano";
              let statusText = active ? "Active" : "Inactive";
              return <Tag color={color}>{statusText}</Tag>;
            }}
          />
          <Column
            title="Action"
            key="action"
            width={150}
            align="center"
            render={(_, record) => (
              <Space size="middle">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => this.editCategory(record)}
                >
                  <EditOutlined style={{ marginRight: 8 }} /> Edit
                </Button>
                <Button
                  type="primary"
                  danger
                  size="small"
                  onClick={() => this.openDeleteConfirmModal(record)}
                >
                  <DeleteOutlined style={{ marginRight: 8 }} /> Delete
                </Button>
              </Space>
            )}
          />
        </Table>
      </>
    );
  }
}

export default ProductList;
