import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code) {
      // Gửi mã code đến backend để lấy JWT
      axios.post('http://localhost:8081/api/v1/auth/google', { code })
        .then(response => {
          const { accessToken } = response.data;
          // Lưu JWT vào localStorage hoặc sessionStorage
          localStorage.setItem('token', accessToken);
          // Chuyển hướng đến trang chính sau khi đăng nhập thành công
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error during Google OAuth2:', error);
        });
    }
  }, [navigate]);

  return (
    <div>
      <h1>Đang xử lý đăng nhập Google...</h1>
    </div>
  );
};

export default GoogleCallback;
