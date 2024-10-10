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
                  <p className="subtitle">Về Chúng Tôi</p>
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
              Tại sao chọn <span className="orange-text">Walacafé</span>
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Space align="start">
                    <HomeOutlined style={{ fontSize: '24px', color: '#ff6a00' }} />
                    <div>
                      <Title level={3}>Giao hàng tận nhà</Title>
                      <Paragraph>
                      Chúng tôi cam kết giao cà phê đến tận tay bạn một cách nhanh chóng và tiện lợi, đảm bảo sản phẩm luôn tươi ngon và đạt chất lượng cao nhất, để bạn có thể thưởng thức tách cà phê hoàn hảo ngay tại nhà.
                      </Paragraph>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space align="start">
                    <DollarOutlined style={{ fontSize: '24px', color: '#ff6a00' }} />
                    <div>
                      <Title level={3}>Giá tốt nhất</Title>
                      <Paragraph>
                      Chúng tôi cung cấp các sản phẩm cà phê chất lượng cao với giá cả cạnh tranh nhất trên thị trường. Cam kết mang đến cho bạn không chỉ hương vị tuyệt hảo mà còn sự hài lòng về giá trị </Paragraph>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space align="start">
                    <BoxPlotOutlined style={{ fontSize: '24px', color: '#ff6a00' }} />
                    <div>
                      <Title level={3}>Nhiều lựa chọn</Title>
                      <Paragraph>
                      Tạo nên trải nghiệm cà phê độc đáo của riêng bạn với dịch vụ Custom Box. Bạn có thể tự do chọn lựa những loại cà phê yêu thích, từ hạt rang đậm đến cà phê xay mịn, tất cả được đóng gói riêng biệt theo yêu cầu.</Paragraph>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space align="start">
                    <ReloadOutlined style={{ fontSize: '24px', color: '#ff6a00' }} />
                    <div>
                      <Title level={3}>Hoàn tiền nhanh</Title>
                      <Paragraph>
                      Mua sắm an tâm với chính sách hoàn tiền nhanh chóng của chúng tôi. Nếu có bất kỳ vấn đề nào với đơn hàng, chúng tôi cam kết xử lý và hoàn tiền nhanh gọn, không rắc rối. Đặt sự hài lòng của bạn lên hàng đầu.</Paragraph>
                    </div>
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
         Giảm giá tháng 12! <br /> đang diễn ra! <span className="orange-text">với Ưu đãi lớn...</span>
        </Title>
      </Col>
      <br />
      <Col span={24} style={{ textAlign: 'left' }}>
  <div className="sale-percent" style={{ fontSize: '36px', textAlign: 'left' }}>
    <Text strong>
      Giảm giá! <br /> lên đến <span style={{ fontSize: '48px', color: '#ff6a00' }}>50%</span> <br /> 
    </Text>
  </div>
</Col>

<Col span={24} style={{ textAlign: 'left' }}>
  <Button type="primary" size="large" href="shop.html">
    Mua Ngay
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
              Đội ngũ <span className="orange-text">của chúng tôi</span>
              </Title>
              <Paragraph>
              Chào mừng đến với nhóm của chúng tôi! Chúng tôi là một đội ngũ năng động, sáng tạo và đam mê công việc mình làm. Mỗi thành viên trong nhóm đều mang đến những kỹ năng và kinh nghiệm độc đáo, tạo nên sự đa dạng và sự đổi mới trong mỗi dự án chúng tôi thực hiện.
              </Paragraph>
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
                Thế Vinh <span style={{ fontSize: '14px', color: '#888' }}>Farmer</span>
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
                Minh Tính <span style={{ fontSize: '14px', color: '#888' }}>Farmer</span>
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
                Dũng Nhớ <span style={{ fontSize: '14px', color: '#888' }}>Farmer</span>
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
                Hiếu Nguyên <span style={{ fontSize: '14px', color: '#888' }}>Farmer</span>
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
                Quang Vinh <span style={{ fontSize: '14px', color: '#888' }}>Farmer</span>
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
                Hoàng Khải <span style={{ fontSize: '14px', color: '#888' }}>Farmer</span>
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
                    David Khải <span className="testimonial-role">Chủ cửa hàng</span>
                  </Title>
                  <Paragraph className="testimonial-body">
                  "David Khải là chủ một cửa hàng cà phê địa phương nổi tiếng, được biết đến với sự nhiệt huyết và tình yêu với ngành nghề của mình. Với kinh nghiệm nhiều năm trong lĩnh vực cà phê, David đã thành công biến quán cà phê của mình trở thành điểm đến ưa thích của nhiều người dân trong khu vực".                  </Paragraph>
                  <div className="last-icon">
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
                    Vinh Tony<span className="testimonial-role">Chủ cửa hàng</span>
                  </Title>
                  <Paragraph className="testimonial-body">
                  "Vinh Tony không chỉ là người đứng sau những tách cà phê thơm ngon mà còn là một người yêu thích nghệ thuật. Anh thường tổ chức các buổi triển lãm nhỏ ngay tại quán, tạo điều kiện cho các nghệ sĩ địa phương giới thiệu tác phẩm của mình. Điều này không chỉ làm phong phú thêm không gian quán mà còn thúc đẩy sự phát triển của cộng đồng nghệ thuật".                  </Paragraph>
                  <div className="last-icon">
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
