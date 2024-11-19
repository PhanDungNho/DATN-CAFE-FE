import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Table,
  Spin,
  DatePicker,
  Select,
} from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import { Column } from "@ant-design/charts";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
ChartJS.register(ArcElement, Tooltip, Legend);

const formatCurrency = (amount) => {
  return `${(amount || 0).toLocaleString("vi-VN")} VND`; // Đảm bảo amount không null
};

const StatisticsDashboard = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [revenueData, setRevenueData] = useState({ total: 0 });
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productData, setProductData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);

  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  console.log(dailyRevenueData);
  console.log(monthlyRevenueData);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
      total: 0,
      position: ["bottomRight"],
    },
  });

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchDailyRevenueData(selectedYear, selectedMonth);
      fetchMonthlyRevenueData(selectedYear);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          orderCountRes,
          revenueRes,
          productCountRes,
          visitorCountRes,
          mostPurchasedProductsRes,
        ] = await Promise.all([
          axios.get("http://localhost:8081/api/v1/orders/orderCount"),
          axios.get("http://localhost:8081/api/v1/orders/revenue"),
          axios.get("http://localhost:8081/api/v1/products/productCount"),
          axios.get("http://localhost:8081/api/v1/orders/accountCount"),
          axios.get(
            "http://localhost:8081/api/v1/orders/most-purchased-products"
          ),
        ]);

        setOrderCount(orderCountRes.data);
        setRevenueData(revenueRes.data);
        setProductCount(productCountRes.data);
        setVisitorCount(visitorCountRes.data);

        const formattedData = mostPurchasedProductsRes.data.map((item) => ({
          key: item.productName,
          productName: item.productName,
          totalQuantity: item.totalQuantity,
          totalAmount: item.totalAmount,
          saleDate: item.saleDate,
        }));
        setProductData(formattedData);
        setTableData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  // Dữ liệu biểu đồ tròn
  const labels = productData.map((item) => item.productName);
  const values = productData.map((item) => parseInt(item.totalQuantity, 10));

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Số lượng",
        data: values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "orange", "red"],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "orange",
          "red",
        ],
      },
    ],
  };

  const fetchDailyRevenueData = async (year, month) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/orders/daily-revenue`,
        {
          params: { year, month },
        }
      );
      const dailyData = response.data;
      const adjustedDailyData = dailyData.map((item) => ({
        ...item,
        revenue: item.revenue,
        formattedRevenue: formatCurrency(item.revenue),
      }));
      const allDaysInMonth = [
        ...Array(moment(`${year}-${month}`, "YYYY-MM").daysInMonth()).keys(),
      ].map((i) => i + 1);
      const filledDailyData = allDaysInMonth.map((day) => {
        const existingData = adjustedDailyData.find((item) => item.day === day);
        return existingData
          ? existingData
          : { day, formattedRevenue: formatCurrency(0) };
      });
      setDailyRevenueData(filledDailyData);
    } catch (error) {
      console.error("Error fetching daily revenue data:", error);
    }
  };

  const fetchMonthlyRevenueData = async (year) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/orders/monthly-revenue`,
        {
          params: { year },
        }
      );
      const monthlyData = response.data;
      const adjustedMonthlyData = monthlyData.map((item) => ({
        ...item,
        revenue: item.revenue,
      }));
      const allMonths = [...Array(12).keys()].map((i) => i + 1);
      const filledMonthlyData = allMonths.map((month) => {
        const existingData = adjustedMonthlyData.find(
          (item) => item.month === month
        );
        return existingData ? existingData : { month };
      });
      setMonthlyRevenueData(filledMonthlyData);
    } catch (error) {
      console.error("Error fetching monthly revenue data:", error);
    }
  };

  const fetchTotalStatistics = async (dates) => {
    setLoading(true);
    const [startDate, endDate] = dates;
    try {
      const response = await axios.get(
        "http://localhost:8081/api/v1/orders/totals",
        {
          params: {
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
          },
        }
      );
      setTotalRevenue(response.data.totalRevenue);
      setTotalOrders(response.data.totalOrders);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    fetchMonthlyRevenueData(value); // Cập nhật dữ liệu hàng tháng
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    fetchDailyRevenueData(selectedYear, value); // Cập nhật dữ liệu hàng ngày
  };

  const columns = [
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center",
      width: 200,
    },
    {
      title: "Số Lượng",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      align: "center",
      width: 150,
    },
    {
      title: "Tổng Tiền (VND)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      width: 200,
      render: (amount) =>
        amount
          ? amount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : "0 VND",
    },
    {
      title: "Ngày Bán",
      dataIndex: "saleDate",
      key: "saleDate",
      align: "center",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
  ];

  const statsData = [
    {
      title: "Tổng Đơn Hàng",
      value: orderCount || 0,
      icon: <ShoppingCartOutlined />,
      color: "#3b82f6",
    },
    {
      title: "Tổng Doanh Thu",
      value: loadingRevenue ? (
        <Spin />
      ) : (
        revenueData.total.toLocaleString("vi-VN")
      ),
      icon: <DollarOutlined />,
      color: "#f59e0b",
    },
    {
      title: "Số Người Dùng",
      value: visitorCount || 0,
      icon: <UserOutlined />,
      color: "#10b981",
    },
    {
      title: "Sản Phẩm",
      value: productCount || 0,
      icon: < ProductOutlined /> ,
      color: "#ef4444",
    },
  ];

  // Hàm lọc dữ liệu dựa trên ngày
  const handleDateRangeChange = (dates) => {
    // Kiểm tra nếu dates là mảng và có đủ 2 giá trị
    if (!dates || dates.length !== 2) {
      setFilteredData(tableData); // Nếu không có khoảng thời gian, trả về toàn bộ dữ liệu
      return;
    }

    const [startDate, endDate] = dates;
    console.log(
      "Start Date:",
      startDate ? startDate.format("YYYY-MM-DD") : "Không có ngày bắt đầu"
    );
    console.log(
      "End Date:",
      endDate ? endDate.format("YYYY-MM-DD") : "Không có ngày kết thúc"
    );
    // Kiểm tra xem startDate và endDate có hợp lệ không
    if (!startDate || !endDate) {
      setFilteredData(tableData); // Nếu ngày không hợp lệ, trả về toàn bộ dữ liệu
      return;
    }

    setLoadingTable(true);

    // Định dạng ngày theo kiểu "YYYY-MM-DD"
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");

    // Gửi yêu cầu đến API với tham số ngày
    axios
      .get(
        "http://localhost:8081/api/v1/orders/most-purchased-products/by-date",
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        }
      )
      .then((response) => {
        // Kiểm tra dữ liệu trả về có hợp lệ không
        if (response.data && Array.isArray(response.data)) {
          const formattedData = response.data.map((item) => ({
            key: item.productName,
            productName: item.productName,
            totalQuantity: item.totalQuantity,
            totalAmount: item.totalAmount,
            saleDate: item.saleDate,
          }));
          setFilteredData(formattedData);
        } else {
          setFilteredData([]); // Trường hợp không có dữ liệu
        }
        setLoadingTable(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lọc dữ liệu theo ngày:", error);
        setFilteredData([]); // Trả về dữ liệu rỗng nếu có lỗi
        setLoadingTable(false);
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Thống Kê Dashboard
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
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Col span={16}>
          <Card
            title="Danh Sách Giao Dịch (Top Sản Phẩm)"
            bordered={false}
            style={{ minHeight: "400px" }}
          >
            <RangePicker
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              style={{ marginTop: "30px",marginBottom: "8px" }}
            />
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={tableParams.pagination}
              onChange={({ pagination }) => setTableParams({ pagination })}
              loading={loadingTable}
            />
            
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="Top 5 Sản Phẩm Bán Chạy"
            bordered={false}
            style={{ minHeight: "400px" }}
          >
            <Pie data={chartData} />
          </Card>
        </Col>
      </div>

      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Title level={5} style={{ marginBottom: "8px" }}>
            Chọn Khoảng Thời Gian
          </Title>
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(dates) => fetchTotalStatistics(dates)}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: "10px" }}>
        <Col span={12}>
          <Card
            style={{
              textAlign: "center",
              borderRadius: "4px",
              height: "80px",
              overflow: "hidden",
              padding: "4px",
              backgroundColor: "#f0f2f5", // Light grey background
            }}
          >
            <Title
              level={5}
              style={{ margin: 0, fontSize: "14px", lineHeight: "1" }}
            >
              Doanh Thu Chọn Ngày
            </Title>
            <div style={{ fontSize: "16px", lineHeight: "1.2" }}>
              {loading ? <Spin /> : formatCurrency(totalRevenue)}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            style={{
              textAlign: "center",
              borderRadius: "4px",
              height: "80px",
              overflow: "hidden",
              padding: "4px",
              backgroundColor: "#f0f2f5", // Light grey background
            }}
          >
            <Title
              level={5}
              style={{ margin: 0, fontSize: "14px", lineHeight: "1" }}
            >
              Đơn Hàng Chọn Ngày
            </Title>
            <div style={{ fontSize: "16px", lineHeight: "1.2" }}>
              {loading ? <Spin /> : totalOrders}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Selectors for Month and Year */}
      <Title level={5} style={{ marginBottom: "8px" }}>
        Chọn Tháng và năm:
      </Title>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <Card>
            <Title level={4}>Doanh Thu Hàng Ngày</Title>
            <Column
              data={dailyRevenueData.map((item) => ({
                ...item,
                revenue: item.revenue || 0, // Ensure revenue is numeric
              }))}
              xField="day"
              yField="revenue"
              meta={{
                day: { alias: "Ngày" },
                revenue: {
                  alias: "Doanh Thu (VND)",
                  formatter: (value) => formatCurrency(value), // Format the value as currency
                },
              }}
              tooltip={{
                formatter: (data) => {
                  // Ensure we use the numeric revenue for tooltip
                  if (data && data.revenue != null) {
                    return {
                      name: "Doanh Thu",
                      value: formatCurrency(data.revenue), // Format numeric revenue value for display
                    };
                  }
                  return null; // If no revenue, return null
                },
              }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Title level={4}>Doanh Thu Hàng Tháng</Title>
            <Column
              data={monthlyRevenueData}
              xField="month"
              yField="revenue"
              meta={{
                month: { alias: "Tháng" },
                revenue: {
                  alias: "Doanh Thu (VND)",
                  formatter: (value) => formatCurrency(value),
                },
              }}
              tooltip={{
                formatter: (data) => {
                  console.log("Tooltip data:", data); // Xem dữ liệu nhận được từ tooltip
                  if (data && data.revenue != null) {
                    return {
                      name: "Doanh Thu",
                      value: formatCurrency(data.revenue),
                    };
                  }
                  return null;
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsDashboard;