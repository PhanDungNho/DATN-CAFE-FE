import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy giá trị của 'resultCode' từ query string
  const queryParams = new URLSearchParams(location.search);
  const result = queryParams.get('resultCode');
  const orderInfo = queryParams.get('orderInfo');

  let orderId = null;
  if (orderInfo) {
    orderId = orderInfo.split(": ")[1].trim();
  }

  // Kiểm tra giá trị resultCode và đưa ra thông báo tương ứng
  let message = '';
  let message2 = '';
  let headingStyle = {};
  let buttonStyle = {};
  let buttonText = '';

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f3f4f6',
    },
    messageBox: {
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
    headingSuccess: {
      color: '#4caf50',
      fontSize: '2.5rem',
    },
    headingFailure: {
      color: '#f44336',
      fontSize: '2.5rem',
    },
    paragraph: {
      color: '#555',
      fontSize: '1.2rem',
    },
    successButton: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
    },
    failureButton: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
    },
    closeButton: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#888',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
    }
  };

  switch (result) {
    case '9000':
      message = 'Giao dịch đã được xác nhận thành công.';
      message2 = 'Cảm ơn quý khách đã sử dụng sản phẩm!';
      headingStyle = styles.headingSuccess;
      if (orderId) {
        localStorage.setItem(`payment_status_${orderId}`, "success");
      }
      break;
    case '0':
      message = 'Thanh toán thành công.';
      message2 = 'Cảm ơn quý khách đã sử dụng sản phẩm!';
      headingStyle = styles.headingSuccess;
      if (orderId) {
        localStorage.setItem(`payment_status_${orderId}`, "success");
      }
      break;
    case '1006':
      message = 'Giao dịch bị từ chối bởi người dùng.';
      headingStyle = styles.headingFailure;
      buttonStyle = styles.failureButton;
      buttonText = 'Đóng';
      break;
    case '1001':
      message = 'Thanh toán thất bại!';
      message2 = 'Giao dịch thanh toán thất bại do tài khoản người dùng không đủ tiền.';
      headingStyle = styles.headingFailure;
      break;
    case '1005':
      message = 'Giao dịch thất bại do url hoặc QR code đã hết hạn.';
      message2 = 'Vui lòng gửi lại một yêu cầu thanh toán khác.';
      headingStyle = styles.headingFailure;
      break;
    default:
      message = 'Thanh toán thất bại!';
      message2 = 'Đã có lỗi xảy ra, xin vui lòng Đóng.';
      headingStyle = styles.headingFailure;
      buttonStyle = styles.failureButton;
      buttonText = 'Đóng';
      break;
  }

  // Hàm xử lý nút Đóng
  const handleClose = () => {
    window.close();
  };

  return (
    <div style={styles.container}>
      <div style={styles.messageBox}>
        <h1 style={headingStyle}>{message}</h1>
        <p style={styles.paragraph}>{message2}</p>
        {/* Nút Đóng */}
        <button style={styles.closeButton} onClick={handleClose}>Đóng</button>
      </div>
    </div>
  );
};

export default PaymentResult;
