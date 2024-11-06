import React, { useEffect, useState } from "react";
import {
  Form,
  DatePicker,
  Button,
  Card,
  Typography,
  Space,
  Table,
  Row,
  Col,
  Select,
} from "antd";
import {
  BarChartOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { Pie, Column } from "@ant-design/charts";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { countOrder } from "../../../redux/actions/invoiceAction";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const StatisticsDashboard = ({ authorityData }) => {
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [revenueData, setRevenueData] = useState(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const dispatch = useDispatch();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
      total: 0,
      position: ["bottomRight"],
    },
  });

  const [productData, setProductData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const invoiceState = useSelector((state) => state.invoice);
  console.log(invoiceState);
  const count = invoiceState?.count || 0; // Lấy count từ state Redux
  const [totalOrders, setTotalOrders] = useState(0); // State for total orders

  useEffect(() => {
    const fetchTotalOrders = async () => {
        setLoading(true);
        try {
          console.log("Fetching total orders...");
          const result = await dispatch(countOrder()); // Lưu giá trị trả về từ action
          console.log("Result from countOrder:", result); // Kiểm tra giá trị trả về
          setTotalOrders(result); // Cập nhật totalOrders với giá trị từ action
        } catch (error) {
          console.error("Error fetching total orders:", error);
        } finally {
          setLoading(false);
        }
      };

    fetchTotalOrders(); // Gọi hàm khi component được mount
  }, [dispatch, count]); // Thêm count vào dependency array

  const handleRevenueSubmit = async (values) => {
    setLoadingRevenue(true);
    const { revenuePeriod } = values;
    const startDate = moment(revenuePeriod[0]).format("YYYY-MM-DD");
    const endDate = moment(revenuePeriod[1]).format("YYYY-MM-DD");

    try {
      const response = await fetch(
        `/api/statistics/revenue?startDate=${startDate}&endDate=${endDate}`
      );
      const totalRevenue = await response.json();
      setRevenueData(totalRevenue);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoadingRevenue(false);
    }
  };

  const handleYearRevenueSubmit = (year) => {
    setLoadingRevenue(true);
    // Mock data for monthly revenue
    const sampleMonthlyRevenueData = [
      { month: "Jan", revenue: 20000 },
      { month: "Feb", revenue: 30000 },
      { month: "Mar", revenue: 25000 },
      { month: "Apr", revenue: 40000 },
      { month: "May", revenue: 45000 },
      { month: "Jun", revenue: 30000 },
      { month: "Jul", revenue: 35000 },
      { month: "Aug", revenue: 50000 },
      { month: "Sep", revenue: 48000 },
      { month: "Oct", revenue: 53000 },
      { month: "Nov", revenue: 60000 },
      { month: "Dec", revenue: 70000 },
    ];

    setTimeout(() => {
      setLoadingRevenue(false);
      setMonthlyRevenueData(sampleMonthlyRevenueData);
    }, 1000);
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
  };

  const handleDateFilter = (dates) => {
    if (!dates || dates.length < 2) {
      setFilteredData(tableData);
      return;
    }
    const [start, end] = dates;
    const filtered = tableData.filter((item) => {
      const createdTime = moment(item.created_time);
      return createdTime.isBetween(start, end, "day", "[]");
    });
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      align: "center",
      width: 200,
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "center",
      width: 150,
    },
    {
      title: "Cashier ID",
      dataIndex: "cashier_id",
      key: "cashier_id",
      align: "center",
      width: 150,
    },
    {
      title: "Created Time",
      dataIndex: "created_time",
      key: "created_time",
      align: "center",
      width: 200,
    },
  ];

  const statsData = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCartOutlined />,
      color: "#3b82f6",
      change: "+4.2%",
    },
    {
      title: "Total Revenue",
      value: "$8323",
      icon: <DollarOutlined />,
      color: "#f59e0b",
      change: "+1.2%",
    },
    {
      title: "Visitors",
      value: "6200",
      icon: <UserOutlined />,
      color: "#10b981",
      change: "+5.2%",
    },
    {
      title: "Messages",
      value: "5630",
      icon: <MailOutlined />,
      color: "#ef4444",
      change: "+2.7%",
    },
  ];

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    // Mock data for product sales
    const sampleProductData = [
      { product: "Product A", sales: 50 },
      { product: "Product B", sales: 70 },
      { product: "Product C", sales: 30 },
      { product: "Product D", sales: 90 },
    ];
    setProductData(sampleProductData);
  };

  const productPieConfig = {
    data: productData,
    angleField: "sales",
    colorField: "product",
    radius: 0.8,
    label: {
      content: "{name} {percentage}",
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    interactions: [{ type: "element-active" }],
  };

  const monthlyRevenueColumnConfig = {
    data: monthlyRevenueData,
    xField: "month",
    yField: "revenue",
    label: {
      style: {
        fill: "#000",
        opacity: 0.6,
      },
    },
    meta: {
      revenue: { alias: "Doanh Thu" },
      month: { alias: "Tháng" },
    },
    interactions: [{ type: "active-region" }],
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Dashboard Thống Kê
      </Title>

      <Row gutter={16} style={{ marginBottom: "20px" }}>
        {statsData.map((stat, index) => (
          <Col span={6} key={index}>
            <Card
              style={{
                backgroundColor: stat.color,
                color: "#ffffff",
                borderRadius: "8px",
              }}
              bordered={false}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Title
                    level={4}
                    style={{ color: "#ffffff", marginBottom: 0 }}
                  >
                    {stat.value}
                  </Title>
                  <p style={{ color: "#ffffff" }}>{stat.title}</p>
                </div>
                <div style={{ fontSize: "24px", color: "#ffffff" }}>
                  {stat.icon}
                </div>
              </div>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "14px",
                  textAlign: "right",
                }}
              >
                {stat.change}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Card title="Tổng Số Đơn Hàng" bordered={false}>
            <Title level={3} style={{ textAlign: "center" }}>
              {totalOrders}
            </Title>
            <p style={{ textAlign: "center" }}>Tổng số đơn hàng hiện tại</p>
          </Card>
        </Col>
      </Row>

      <Form onFinish={handleRevenueSubmit}>
        <Form.Item name="revenuePeriod">
          <RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loadingRevenue}>
            Xem Doanh Thu
          </Button>
        </Form.Item>
      </Form>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Doanh Thu Theo Tháng" bordered={false}>
            <Column {...monthlyRevenueColumnConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Sản Phẩm Bán Chạy" bordered={false}>
            <Pie {...productPieConfig} />
          </Card>
        </Col>
      </Row>

      <Card title="Danh Sách Đơn Hàng" bordered={false}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={tableParams.pagination}
          loading={loadingTable}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

StatisticsDashboard.propTypes = {
  authorityData: PropTypes.object.isRequired,
};

export default StatisticsDashboard;
