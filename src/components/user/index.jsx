import React from "react";
import { Layout, Row, Col, Button, Card, Typography } from "antd";
import { ShoppingCartOutlined, SyncOutlined, PhoneOutlined, RocketOutlined } from '@ant-design/icons';
import Header from "./Header";
import Footer from "./Footer";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function Index() {
  return (
    <Layout>
      <Header />
      
      {/* Hero Section */}
      <Content 
  className="hero-area" 
  style={{ 
    backgroundImage: 'url(assets/img/cafe-bg-1.jpg)', // Thay đường dẫn tới ảnh nền của bạn
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundRepeat: 'no-repeat',
    padding: '50px 0',
    color: '#fff' // Đảm bảo màu chữ nổi bật trên nền
  }}
>
<div className="container">
  <Row justify="center" align="middle">
    <Col span={12} style={{ textAlign: 'center' }}>
      <div>
        {/* Dùng span để giữ chữ "WELCOME TO WALACOFFEE" trên cùng một dòng */}
        <span>
        <Title level={1} style={{ color: '#ffffff', fontSize: '43px', display: 'inline' }}>
          WELCOME TO WALACOFFEE
        </Title>
        </span>
        <Paragraph className="subtitle" style={{ color: '#ff8c00',fontSize: '20px'}}>
          Coffee &amp; Tea
        </Paragraph> {/* Màu cam */}
      </div>
    </Col>
  </Row>
</div>
</Content>



      {/* Features Section */}
      <Content style={{ padding: "50px 0", backgroundColor: "#cccccc"}}>
  <div className="container">
    {/* Feature Section */}
    <Row gutter={[16, 16]} justify="center">
  <Col span={8}>
    <Card
      style={{
        textAlign: 'center',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: '2px solid #f0f0f0', // Viền nhạt
      }}
      hoverable
    >
      <Row align="middle" justify="center">
        <Col span={4} style={{ borderRadius: '100%', background: '#f0f0f0', padding: '8px' }}>
          <RocketOutlined style={{ fontSize: '40px', color: '#ff8c00',marginBottom:'20px' }} />
        </Col>
        <Col span={20}>
          <Title level={3} style={{  fontWeight: '600' }}>
            Free Shipping
          </Title>
          <Paragraph style={{ }}>Free Ship đơn trên 150.000 </Paragraph>
        </Col>
      </Row>
    </Card>
  </Col>
  <Col span={8}>
    <Card
      style={{
        textAlign: 'center',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: '2px solid #f0f0f0', // Viền nhạt
      }}
      hoverable
    >
      <Row align="middle" justify="center">
        <Col span={4} style={{ borderRadius: '100%', background: '#f0f0f0', padding: '8px'}}>
          <PhoneOutlined style={{ fontSize: '40px', color: '#ff8c00', marginBottom:'20px'}} />
        </Col>
        <Col span={20}>
          <Title level={3} style={{ fontWeight: '600' }}>
            24/7 Support
          </Title>
          <Paragraph style={{  }}>Get support all day</Paragraph>
        </Col>
      </Row>
    </Card>
  </Col>
  <Col span={8}>
    <Card
      style={{
        textAlign: 'center',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: '2px solid #f0f0f0', // Viền nhạt
      }}
      hoverable
    >
      <Row align="middle" justify="center">
        <Col span={4} style={{ borderRadius: '100%', background: '#f0f0f0', padding: '8px' }}>
          <SyncOutlined style={{ fontSize: '40px', color: '#ff8c00',marginBottom:'20px' }} />
        </Col>
        <Col span={20}>
          <Title level={3} style={{  fontWeight: '600' }}>
            Refund
          </Title>
          <Paragraph style={{  }}>Get refund within 3 days!</Paragraph>
        </Col>
      </Row>
    </Card>
  </Col>
</Row>

    {/* Product Section */}
    <Row justify="center" style={{ marginTop: '50px' }}>
      <Col span={16} style={{ textAlign: 'center' }}>
        <Title level={2} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600', color: '#333' }}>
          <span className="orange-text">Sản phẩm</span> Của chúng tôi
        </Title>
        <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#555', lineHeight: '1.6' }}>
          Nơi mỗi ngụm cà phê không chỉ là thức uống, mà là hành trình trải nghiệm hương vị của cuộc sống.
        </Paragraph>
      </Col>
    </Row>

    <Row gutter={[16, 16]} justify="center">
  <Col span={8}>
    <Card
      cover={<img alt="Caffe Đá" src="assets/img/index/cafeden.png" />}
      actions={[
        <Button
          icon={<ShoppingCartOutlined />}
          type="primary"
          style={{
            height: '45px',
            backgroundColor: '#ff8c00',
            borderColor: '#ff8c00',
            color: '#fff',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000';
            e.currentTarget.style.color = '#ff8c00';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff8c00';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Add to Cart
        </Button>,
      ]}
      style={{
        textAlign: 'center',
        borderRadius: '16px', // Bo góc mềm mại
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ cho khung
        border: '2px solid #ddd', // Thêm viền nhẹ cho card
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        backgroundColor: '#fff', // Màu nền trắng cho card
      }}
      hoverable
      bodyStyle={{
        padding: '20px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)'; // Tăng độ bóng khi hover
        e.currentTarget.style.transform = 'translateY(-5px)'; // Nâng card lên
        e.currentTarget.style.borderColor = '#ff8c00'; // Đổi màu viền khi hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#ddd'; // Trở lại màu viền ban đầu
      }}
    >
      <Title level={3} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600' }}>
        Caffe Đá
      </Title>
      <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#ff8c00' }}>
        Giá: 17.000đ
      </Paragraph>
    </Card>
  </Col>

  <Col span={8}>
    <Card
      cover={<img alt="Bạc xĩu" src="assets/img/index/bacxiu2.avif" />}
      actions={[
        <Button
          icon={<ShoppingCartOutlined />}
          type="primary"
          style={{
            height: '45px',
            backgroundColor: '#ff8c00',
            borderColor: '#ff8c00',
            color: '#fff',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000';
            e.currentTarget.style.color = '#ff8c00';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff8c00';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Add to Cart
        </Button>,
      ]}
      style={{
        textAlign: 'center',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        border: '2px solid #ddd',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        backgroundColor: '#fff',
      }}
      hoverable
      bodyStyle={{
        padding: '20px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#ff8c00';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#ddd';
      }}
    >
      <Title level={3} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600' }}>
        Bạc xĩu
      </Title>
      <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#ff8c00' }}>
        Giá: 21.000đ
      </Paragraph>
    </Card>
  </Col>

  <Col span={8}>
    <Card
      cover={<img alt="Cafe Trứng" src="assets/img/index/cafesua.png" />}
      actions={[
        <Button
          icon={<ShoppingCartOutlined />}
          type="primary"
          style={{
            height: '45px',
            backgroundColor: '#ff8c00',
            borderColor: '#ff8c00',
            color: '#fff',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000';
            e.currentTarget.style.color = '#ff8c00';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff8c00';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Add to Cart
        </Button>,
      ]}
      style={{
        textAlign: 'center',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        border: '2px solid #ddd',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        backgroundColor: '#fff',
      }}
      hoverable
      bodyStyle={{
        padding: '20px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#ff8c00';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#ddd';
      }}
    >
      <Title level={3} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600' }}>
        Cafe Sữa
      </Title>
      <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#ff8c00' }}>
        Giá: 29.000đ
      </Paragraph>
    </Card>
  </Col>
</Row>
  </div>
</Content>


<Content style={{ backgroundColor: "#cccccc"}}>
  <div className="container">
    {/* Feature Section */}
    <Row gutter={[16, 16]} justify="center">
</Row>

    {/* Product Section */}
    <Row justify="center" style={{ marginTop: '50px' }}>
      <Col span={16} style={{ textAlign: 'center' }}>
        <Title level={2} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600', color: '#333' }}>
          <span className="orange-text">Sản phẩm</span> Trà nổi bật
        </Title>
        <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#555', lineHeight: '1.6' }}>
          Mỗi ly trà là một cuộc hành trình qua thời gian và không gian, gợi nhớ về truyền thống và sự thanh khiết của thiên nhiên.
        </Paragraph>
      </Col>
    </Row>

    <Row gutter={[16, 16]} justify="center">
  <Col span={8}>
    <Card
      cover={<img alt="Caffe Đá" src="assets/img/index/cafeden.png" />}
      actions={[
        <Button
          icon={<ShoppingCartOutlined />}
          type="primary"
          style={{
            height: '45px',
            backgroundColor: '#ff8c00',
            borderColor: '#ff8c00',
            color: '#fff',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000';
            e.currentTarget.style.color = '#ff8c00';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff8c00';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Add to Cart
        </Button>,
      ]}
      style={{
        textAlign: 'center',
        borderRadius: '16px', // Bo góc mềm mại
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ cho khung
        border: '2px solid #ddd', // Thêm viền nhẹ cho card
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        backgroundColor: '#fff', // Màu nền trắng cho card
      }}
      hoverable
      bodyStyle={{
        padding: '20px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)'; // Tăng độ bóng khi hover
        e.currentTarget.style.transform = 'translateY(-5px)'; // Nâng card lên
        e.currentTarget.style.borderColor = '#ff8c00'; // Đổi màu viền khi hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#ddd'; // Trở lại màu viền ban đầu
      }}
    >
      <Title level={3} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600' }}>
        Caffe Đá
      </Title>
      <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#ff8c00' }}>
        Giá: 17.000đ
      </Paragraph>
    </Card>
  </Col>

  <Col span={8}>
    <Card
      cover={<img alt="Bạc xĩu" src="assets/img/index/bacxiu2.avif" />}
      actions={[
        <Button
          icon={<ShoppingCartOutlined />}
          type="primary"
          style={{
            height: '45px',
            backgroundColor: '#ff8c00',
            borderColor: '#ff8c00',
            color: '#fff',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000';
            e.currentTarget.style.color = '#ff8c00';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff8c00';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Add to Cart
        </Button>,
      ]}
      style={{
        textAlign: 'center',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        border: '2px solid #ddd',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        backgroundColor: '#fff',
      }}
      hoverable
      bodyStyle={{
        padding: '20px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#ff8c00';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#ddd';
      }}
    >
      <Title level={3} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600' }}>
        Bạc xĩu
      </Title>
      <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#ff8c00' }}>
        Giá: 21.000đ
      </Paragraph>
    </Card>
  </Col>

  <Col span={8}>
    <Card
      cover={<img alt="Cafe Trứng" src="assets/img/index/cafesua.png" />}
      actions={[
        <Button
          icon={<ShoppingCartOutlined />}
          type="primary"
          style={{
            height: '45px',
            backgroundColor: '#ff8c00',
            borderColor: '#ff8c00',
            color: '#fff',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000';
            e.currentTarget.style.color = '#ff8c00';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff8c00';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Add to Cart
        </Button>,
      ]}
      style={{
        textAlign: 'center',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        border: '2px solid #ddd',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        backgroundColor: '#fff',
      }}
      hoverable
      bodyStyle={{
        padding: '20px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#ff8c00';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#ddd';
      }}
    >
      <Title level={3} style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600' }}>
        Cafe Sữa
      </Title>
      <Paragraph style={{ fontFamily: 'Arial, sans-serif', color: '#ff8c00' }}>
        Giá: 29.000đ
      </Paragraph>
    </Card>
  </Col>
</Row>
  </div>
</Content>





      {/* Deal of the Month Section */}
      <Content style={{ padding: "30px 0", backgroundColor: "#cccccc" }}>
  <div className="container">
    <Row gutter={16} align="middle">
      <Col lg={12}>
        {/* Add border and hover effect */}
        <img
          src="assets/img/index/cafedua.jpg"
          alt="Deal of the month"
          style={{
            width: '500px',
            height:'450px',
            border: '2px solid #cccccc', // Add a solid border
            borderRadius: '10px', // Rounded corners by default
            transition: 'all 0.3s ease', // Smooth transition for hover effect
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderRadius = '30px'; // Rounded corners on hover
            e.currentTarget.style.transform = 'scale(1.05)'; // Slightly enlarge image on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderRadius = '10px'; // Reset to original corners
            e.currentTarget.style.transform = 'scale(1)'; // Reset to original size
          }}
        />
      </Col>

      <Col lg={12}>
        <div style={{ textAlign: 'center' }}>
          {/* Thiết kế chữ SALE */}
          <Title
            level={2}
            style={{
              fontSize: '50px',
              fontWeight: 'bold',
              color: '#ff8c00',
              textTransform: 'uppercase',
              letterSpacing: '5px',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <span
              className="orange-text"
              style={{
                position: 'relative',
                zIndex: '1',
              }}
            >
              Ưu đãi
            </span>
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: '-1',
                backgroundColor: '#ff8c00',
                height: '100%',
                borderRadius: '5px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                opacity: 0.2,
              }}
            ></span>
            <br />
            <span
              style={{
                fontSize: '80px',
                fontWeight: 'bold',
                color: 'red', // Màu đỏ cho chữ SALE
                textTransform: 'uppercase',
                letterSpacing: '5px',
                animation: 'scaleAnimation 1s infinite', // Thêm hiệu ứng nhảy to nhỏ
              }}
            >
              NEW
            </span>
          </Title>

          <Title level={3}>Sản phẩm mới ra</Title>
          <Paragraph>
            Sản phẩm mới ra sự kết hợp giữa cafe hạt và 1 vị nước cốt dừa hòa huyện tạo nên 1 cảm giác lạ.
          </Paragraph>
          <Button
            icon={<ShoppingCartOutlined />}
            type="primary"
            style={{
              height: '45px',
              backgroundColor: '#ff8c00',
              borderColor: '#ff8c00',
              color: '#fff',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#000';
              e.currentTarget.style.color = '#ff8c00';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ff8c00';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Add to Cart
          </Button>
        </div>
      </Col>
    </Row>
  </div>
</Content>


      <Footer />
    </Layout>
  );
}

export default Index;
