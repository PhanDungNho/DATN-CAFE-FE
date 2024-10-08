import { Button, Input, Form } from 'antd';

const NewPassword = () => {
  return (
    <section
      className="new-password"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundImage: 'url("../../assets/img/nennnn.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="container"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '900px',
          width: '100%',
        }}
      >
        <div
          className="row"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div className="col-lg-5">
            <img
              src="../../assets/img/pass2.webp"
              alt="New Password"
              style={{ maxWidth: '100%' }}
            />
          </div>
          <div
            className="col-lg-5"
            style={{
              border: '1px solid #d9d9d9',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h1>Nhập Mật Khẩu Mới</h1>
            <Form
              action="/auth/newpassword"
              method="post"
              layout="vertical"
              style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }} // Canh giữa input
            >
              <Form.Item
                name="new_password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
              <Form.Item
                name="confirm_password"
                rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<i className="fa fa-envelope"></i>}
                  style={{ marginTop: '10px', width: '100%' }} // Nút nằm ở giữa và rộng 100%
                >
                  Xác Nhận
                </Button>
              </Form.Item>
            </Form>
            <p style={{ marginTop: '10px' }}>
              Trở về <a href="/home">trang chủ</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewPassword;
