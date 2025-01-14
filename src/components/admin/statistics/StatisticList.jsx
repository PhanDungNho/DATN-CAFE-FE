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
import { API } from "../../../services/constant";
import { useSelector, useDispatch } from "react-redux";
import { getInvoices } from "../../../redux/actions/invoiceAction";

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
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productData, setProductData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pieChartData, setPieChartData] = useState({ labels: [], values: [] }); // Dữ liệu biểu đồ

  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [invoices, setInvoices] = useState([]);
  const invoicesFromStore = useSelector(
    (state) => state.invoiceReducer.invoices
  );
  console.log("invoicesFromStore", invoicesFromStore);

  console.log(dailyRevenueData);
  console.log(monthlyRevenueData);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchDailyRevenueData(selectedYear, selectedMonth);
      fetchMonthlyRevenueData(selectedYear);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    // Gọi action để lấy dữ liệu invoices khi component mount
    dispatch(getInvoices());
  }, [dispatch]);

  useEffect(() => {
    // Khi dữ liệu invoices thay đổi từ Redux, cập nhật lại state local
    if (invoicesFromStore && invoicesFromStore.length > 0) {
      setInvoices(invoicesFromStore);
    }
  }, [invoicesFromStore]);

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
          axios.get(API + "/api/v1/orders/orderCount"),
          axios.get(API + "/api/v1/orders/revenue"),
          axios.get(API + "/api/v1/products/productCount"),
          axios.get(API + "/api/v1/orders/accountCount"),
          axios.get(API + "/api/v1/orders/most-purchased-products"),
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
        const labels = formattedData.map((item) => item.productName);
        const values = formattedData.map((item) =>
          parseInt(item.totalQuantity, 10)
        );
        setPieChartData({ labels, values });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  // Dữ liệu biểu đồ tròn
  const labels = productData.map((item) => item.productName);
  const values = productData.map((item) => parseInt(item.totalQuantity, 10));

  const pieData = {
    labels: pieChartData.labels,
    datasets: [
      {
        label: "Quantity",
        data: pieChartData.values,
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
      const response = await axios.get(API + `/api/v1/orders/daily-revenue`, {
        params: { year, month },
      });
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
      const response = await axios.get(API + `/api/v1/orders/monthly-revenue`, {
        params: { year },
      });
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
    if (!dates || dates.length !== 2) {
      console.warn("Dates are invalid or not selected");
      return;
    }

    setLoading(true);
    const [startDate, endDate] = dates;

    try {
      const response = await axios.get(API + "/api/v1/orders/totals", {
        params: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
        },
      });
      setTotalRevenue(response.data.totalRevenue);
      setTotalOrders(response.data.totalOrders);
    } catch (error) {
      console.error("Error when retrieving statistics: ", error);
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
      title: "Product name",
      dataIndex: "productName",
      key: "productName",
      align: "center",
      width: 200,
    },
    {
      title: "Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      align: "center",
      width: 150,
    },
    {
      title: "Total amount (VND)",
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
  ];

  const statsData = [
    {
      title: "Total orders",
      value: orderCount || 0,
      icon: <ShoppingCartOutlined />,
      color: "#3b82f6",
    },
    {
      title: "Total revenue",
      value: loadingRevenue ? (
        <Spin />
      ) : (
        revenueData.total.toLocaleString("vi-VN")
      ),
      icon: <DollarOutlined />,
      color: "#f59e0b",
    },
    {
      title: "Number of Users",
      value: visitorCount || 0,
      icon: <UserOutlined />,
      color: "#10b981",
    },
    {
      title: "Product",
      value: productCount || 0,
      icon: <ProductOutlined />,
      color: "#ef4444",
    },
  ];

  const handleDateRangeChange = (dates) => {
    if (!dates || dates.length !== 2) {
      // Nếu không có ngày lọc, hiển thị dữ liệu mặc định là 5 sản phẩm bán chạy
      setFilteredData(tableData); // Reset lại dữ liệu nếu không có ngày chọn
      const labels = productData.map((item) => item.productName);
      const values = productData.map((item) => item.totalQuantity);
      setPieChartData({ labels, values }); // Cập nhật biểu đồ tròn với 5 sản phẩm bán chạy
      return;
    }

    const [startDate, endDate] = dates;
    console.log(
      "Start Date:",
      startDate ? startDate.format("YYYY-MM-DD") : "No start date"
    );
    console.log(
      "End Date:",
      endDate ? endDate.format("YYYY-MM-DD") : "No end date."
    );
    // Kiểm tra xem startDate và endDate có hợp lệ không
    if (!startDate || !endDate) {
      setFilteredData(tableData);
      return;
    }

    setLoadingTable(true);

    // Định dạng ngày theo kiểu "YYYY-MM-DD"
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");

    // Gửi yêu cầu đến API với tham số ngày
    axios
      .get(API + "/api/v1/orders/most-purchased-products/by-date", {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const formattedData = response.data.map((item, index) => ({
          key: index,
          productName: item.productName,
          totalQuantity: item.totalQuantity,
          totalAmount: item.totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        }));

        setFilteredData(formattedData);
        const labels = formattedData.map((item) => item.productName);
        const values = formattedData.map((item) => item.totalQuantity);
        setPieChartData({ labels, values });
      })
      .catch((error) => {
        console.error("Error filtering data by date:", error);
        setFilteredData([]);
        setPieChartData({ labels: [], values: [] }); // Reset biểu đồ khi lỗi
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  const years = Array.from(
    new Set(
      invoices
        .map((invoice) => new Date(invoice.createdTime).getFullYear()) // Lấy năm từ thuộc tính createdTime của invoice
        .sort((a, b) => b - a) // Sắp xếp các năm theo thứ tự giảm dần
    )
  ).slice(0, 5); // Giới hạn lấy 5 năm gần nhất

  return (
    <div style={{ padding: "20px", margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Dashboard Statistics
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
            title="Transaction List (Top Products)"
            bordered={false}
            style={{ minHeight: "400px", overflow: "hidden" }}
          >
            <RangePicker
              onChange={(dates) => {
                handleDateRangeChange(dates); // Lọc dữ liệu theo ngày
                fetchTotalStatistics(dates); // Tính toán tổng
              }}
              format="YYYY-MM-DD"
              style={{ marginTop: "30px", marginBottom: "8px" }}
            />
            <div style={{ height: "330px", overflowY: "auto" }}>
              <Table
                columns={columns}
                dataSource={filteredData}
                // pagination={tableParams.pagination}
                // onChange={({ pagination }) => setTableParams({ pagination })}
                loading={loadingTable}
                pagination={false}
              />
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="Top 5 Best-Selling Products"
            bordered={false}
            style={{ minHeight: "500px" }}
          >
            <Pie data={pieData} />
          </Card>
        </Col>
      </div>

      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <Title level={5} style={{ marginBottom: "8px" }}>
            Select Time Range
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
              Revenue for Selected Date
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
              Orders for Selected Date.
            </Title>
            <div style={{ fontSize: "16px", lineHeight: "1.2" }}>
              {loading ? <Spin /> : totalOrders}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Selectors for Month and Year */}
      <Title level={5} style={{ marginBottom: "8px" }}>
        Select Month and Year
      </Title>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <Select
            defaultValue={selectedMonth}
            style={{ width: "100%" }}
            onChange={handleMonthChange}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
              <Option key={month} value={month}>
                {moment.months()[month - 1]}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select
            defaultValue={selectedYear || years[0]} // Chọn năm mặc định là năm đầu tiên trong danh sách
            style={{ width: "100%" }}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <Card>
            <Title level={4}>Daily Revenue</Title>
            <Column
              data={dailyRevenueData.map((item) => ({
                ...item,
                revenue: item.revenue || 0, // Ensure revenue is numeric
              }))}
              xField="day"
              yField="revenue"
              meta={{
                day: { alias: "Date" },
                revenue: {
                  alias: "Revenue (VND)",
                  formatter: (value) => formatCurrency(value), // Format the value as currency
                },
              }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Title level={4}>Monthly Revenue</Title>
            <Column
              data={monthlyRevenueData.map((item) => ({
                ...item,
                revenue: item.revenue || 0, // Ensure revenue is numeric
              }))}
              xField="month"
              yField="revenue"
              meta={{
                month: { alias: "Month" },
                revenue: {
                  alias: "Revenue (VND)",
                  formatter: (value) => formatCurrency(value),
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
