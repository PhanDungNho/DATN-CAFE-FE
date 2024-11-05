import React from "react";
import {
  Card,
  Table,
  Tabs,
  Form,
  Input,
  Select,
  Button,
} from "antd";

const { Option } = Select;

const OrderTab = ({

  orders,
  handlePaymentMethodChange,
  activeTab,
  setActiveTab,
  addNewOrder,
  removeCustomer,
  handleFinish,
  handlePhoneNumberChange,
  phoneNumberInput,
  paymentMethod,
  setPaymentMethod,
  columns,
  handleRemoveItem,
}) => {
  return (
    <Tabs
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key)}
      type="editable-card"
      onEdit={(targetKey, action) => {
        if (action === "add") {
          addNewOrder();
        } else {
          removeCustomer(targetKey);
        }
      }}
    >
 
      {orders.map((customer, index) => (
        <Tabs.TabPane 
          tab={customer.customerName}
          key={index}
          closable={orders.length > 1}
        >
          <Card title={`Giỏ hàng  ${customer.customerName}`}>
          <style>
  {`
  .ant-table-tbody {
    vertical-align: top;
  }

  .ant-table-tbody input {
    width: 9rem !important
  }

  `}
</style>
            {customer.cart.length === 0 ? (
              <p>Giỏ hàng đang trống</p>
            ) : (
              <Table
                columns={columns}
                dataSource={orders[activeTab]?.cart}
                pagination={false}
                rowKey="id"
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      Tổng
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      {orders[activeTab]?.cart
                        .reduce((total, item) => total + item.amount, 0)
                        .toLocaleString()}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            )}
          </Card>

          <Form
            onFinish={(values) => handleFinish(values, index)}
            style={{ marginTop: "20px" }}
          >
            <Form.Item name="phoneNumber">
              <Input
              id="phoneNumber"
                placeholder="Số điện thoại khách hàng"
                value={phoneNumberInput}
                onChange={(e) => handlePhoneNumberChange(e, index)}
              />
            </Form.Item>

            {orders[index] && (
              <div>
                <p style={{ color: "green" }}>
                  Tên khách hàng: {orders[index].customerName}
                </p>
                <p style={{ color: "green" }}>
                  Số điện thoại: {orders[index].customerPhone}
                </p>
              </div>
            )}
<Form.Item name="paymentMethod" label="Hình thức thanh toán">
    {console.log("Current Payment Method for tab:", index, orders[index].paymentMethod)} {/* Log giá trị */}
    <Select
        value={orders[index].paymentMethod} // Giá trị từ orders
        onChange={(value) => handlePaymentMethodChange(value, index)}
    >
        <Option value="CASH">Tiền mặt</Option>
        <Option value="ONLINE">Ví Momo</Option>
    </Select>
</Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={
                orders[index].cart.length === 0 ||
                (orders[index].customerPhone &&
                  !orders[index].customerName)
              }
            >
              Thanh toán
            </Button>
          </Form>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default OrderTab;