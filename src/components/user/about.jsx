import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Row, Col, Typography, Space, Button, Card, Carousel } from 'antd';
import { HomeOutlined, DollarOutlined, BoxPlotOutlined, ReloadOutlined, FacebookFilled, TwitterCircleFilled, InstagramFilled, RightCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

function About() {
 
  

  // nút cu
  const [isVisible, setIsVisible] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header />
      <div className="breadcrumb-section breadcrumb-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="breadcrumb-text">
                <p></p>
                <div className="hero-text-tablecell">
                  <h1>WELCOME TO WALACOFFEE</h1>
                  <p className="subtitle">About Us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="feature-bg">
      <div className="container">
        <Row justify="start">
          <Col span={14}>
            <div className="featured-text">
              <Title level={2}>
              Why choose <span className="orange-text">Walacafé</span>
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Space align="start">
                    <HomeOutlined style={{ fontSize: '24px', color: '#ff6a00' }} />
                    <div>
                      <Title level={3}>Home delivery</Title>
                      <Paragraph>
                      We are committed to delivering coffee to you quickly and conveniently, ensuring the product is always fresh and of the highest quality, so you can enjoy the perfect cup of coffee right at home.                      </Paragraph>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space align="start">
                    <DollarOutlined style={{ fontSize: '24px', color: '#ff6a00' }} />
                    <div>
                      <Title level={3}>Best price</Title>
                      <Paragraph>
                      We provide high quality coffee products at the most competitive prices on the market. Committed to bringing you not only great taste but also satisfaction in value </Paragraph>                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space align="start">
                    <BoxPlotOutlined style={{ fontSize: '24px', color: '#ff6a00' }} />
                    <div>
                      <Title level={3}>Multiple choices</Title>
                      <Paragraph>
                      Create your own unique coffee experience with our Custom Box service. Choose from a variety of coffees, from dark roasts to fine grinds, all individually packaged to order.</Paragraph>                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space align="start">
                    <ReloadOutlined style={{ fontSize: '24px', color: '#ff6a00' }} />
                    <div>
                      <Title level={3}>Fast refund</Title>
                      <Paragraph>
                      Shop with confidence with our fast refund policy. If there are any issues with your order, we promise to process and refund quickly and hassle-free. Your satisfaction comes first.</Paragraph>                    </div>
                  </Space>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>



    <section className="shop-banner">
  <div className="container">
    <Row justify="center" align="middle" gutter={[16, 16]}>
      <Col span={24}>
        <Title level={3}>
        December Sale! <br /> is happening! <span className="orange-text">with Great Deals...</span>
        </Title>
      </Col>
      <br />
      <Col span={24} style={{ textAlign: 'left' }}>
  <div className="sale-percent" style={{ fontSize: '36px', textAlign: 'left' }}>
    <Text strong>
    Discount! <br /> up to <span style={{ fontSize: '48px', color: '#ff6a00' }}>50%</span> <br /> 
    </Text>
  </div>
</Col>

<Col span={24} style={{ textAlign: 'left' }}>
  <Button type="primary" size="large" href="shop.html">
  Buy Now
  </Button>
</Col>

    </Row>
  </div>
</section>




    <div className="mt-150">
      <div className="container">
        <Row justify="center">
          <Col lg={16}>
            <div className="section-title" style={{ textAlign: 'center' }}>
              <Title level={3}>
              Team <span className="orange-text">our</span>
              </Title>
              <Paragraph>
              Welcome to our team! We are a dynamic, creative team that is passionate about what we do. Each team member brings unique skills and experience, creating diversity and innovation in every project we undertake.              </Paragraph>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} justify="center">
          <Col lg={8} md={12}>
            <Card
              hoverable
              cover={<div className="team-bg team-bg-1" style={{ height: 200 }} />}
              style={{ textAlign: 'center' }}
            >
              <Title level={4}>
                Mr.Vinh <span style={{ fontSize: '14px', color: '#888' }}>shop owner</span>
              </Title>
              <div>
                <FacebookFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <TwitterCircleFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <InstagramFilled style={{ fontSize: '24px', margin: '0 10px' }} />
              </div>
            </Card>
          </Col>

          <Col lg={8} md={12}>
            <Card
              hoverable
              cover={<div className="team-bg team-bg-2" style={{ height: 200 }} />}
              style={{ textAlign: 'center' }}
            >
              <Title level={4}>
                Mr.Tinh <span style={{ fontSize: '14px', color: '#888' }}>shop owner</span>
              </Title>
              <div>
                <FacebookFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <TwitterCircleFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <InstagramFilled style={{ fontSize: '24px', margin: '0 10px' }} />
              </div>
            </Card>
          </Col>
          <Col lg={8} md={12}>
            <Card
              hoverable
              cover={<div className="team-bg team-bg-2" style={{ height: 200 }} />}
              style={{ textAlign: 'center' }}
            >
              <Title level={4}>
                Mr.Nho <span style={{ fontSize: '14px', color: '#888' }}>shop owner</span>
              </Title>
              
              <div>
                <FacebookFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <TwitterCircleFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <InstagramFilled style={{ fontSize: '24px', margin: '0 10px' }} />
              </div>
            </Card>
          </Col>

          <Col lg={8} md={12}>
            <Card
              hoverable
              cover={<div className="team-bg team-bg-3" style={{ height: 200 }} />}
              style={{ textAlign: 'center' }}
            >
              <Title level={4}>
                Mr.Nguyen <span style={{ fontSize: '14px', color: '#888' }}>shop owner</span>
              </Title>
              <div>
                <FacebookFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <TwitterCircleFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <InstagramFilled style={{ fontSize: '24px', margin: '0 10px' }} />
              </div>
            </Card>
          </Col>
          <Col lg={8} md={12}>
            <Card
              hoverable
              cover={<div className="team-bg team-bg-3" style={{ height: 200 }} />}
              style={{ textAlign: 'center' }}
            >
              <Title level={4}>
                Mr.Vinh <span style={{ fontSize: '14px', color: '#888' }}>shop owner</span>
              </Title>
              <div>
                <FacebookFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <TwitterCircleFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <InstagramFilled style={{ fontSize: '24px', margin: '0 10px' }} />
              </div>
            </Card>
          </Col>
          <Col lg={8} md={12}>
            <Card
              hoverable
              cover={<div className="team-bg team-bg-3" style={{ height: 200 }} />}
              style={{ textAlign: 'center' }}
            >
              <Title level={4}>
                Mr.Khai <span style={{ fontSize: '14px', color: '#888' }}>shop owner</span>
              </Title>
              <div>
                <FacebookFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <TwitterCircleFilled style={{ fontSize: '24px', margin: '0 10px' }} />
                <InstagramFilled style={{ fontSize: '24px', margin: '0 10px' }} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>

    <div className="testimonail-section mt-80 mb-150">
      <div className="container">
        <Row justify="center">
          <Col lg={20} style={{ textAlign: 'center' }}>
            <Carousel autoplay className="testimonial-sliders">
           

              <div className="single-testimonial-slider">
                <div className="client-avater">
                  <img src="assets/img/avaters/avatar2.png" alt="David Niph" />
                </div>
                <div className="client-meta">
                  <Title level={3}>
                    David Khai <span className="testimonial-role">shop owner</span>
                  </Title>
                  <Paragraph className="testimonial-body">
                  "David Khai is a popular local coffee shop owner, known for his passion and love for his craft. With many years of experience in the coffee industry, David has successfully turned his coffee shop into a favorite destination for many people in the area." </Paragraph>                  <div className="last-icon">
                    <RightCircleOutlined style={{ fontSize: '24px', color: '#888' }} />
                  </div>
                </div>
              </div>

              <div className="single-testimonial-slider">
                <div className="client-avater">
                  <img src="assets/img/avaters/avatar3.png" alt="Jacob Sikim" />
                </div>
                <div className="client-meta">
                  <Title level={3}>
                    Vinh Tony<span className="testimonial-role">shop owner</span>
                  </Title>
                  <Paragraph className="testimonial-body">
                  "Vinh Tony is not only the man behind the delicious cups of coffee but also an art lover. He often organizes small exhibitions right at the shop, creating opportunities for local artists to introduce their works. This not only enriches the space of the shop but also promotes the development of the art community." </Paragraph>                  <div className="last-icon">
                    <RightCircleOutlined style={{ fontSize: '24px', color: '#888' }} />
                  </div>
                </div>
              </div>
            </Carousel>
          </Col>
        </Row>
      </div>
    </div>
    
    
      <Footer />
      <Button 
  className="scroll-to-top" 
  onClick={handleScrollToTop}
>
  ↑
</Button>

    </>
  );
}

export default About;
