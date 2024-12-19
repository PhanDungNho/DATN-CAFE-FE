import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the value of 'resultCode' from the query string
  const queryParams = new URLSearchParams(location.search);
  const result = queryParams.get('resultCode');
  const orderInfo = queryParams.get('orderInfo');

  let orderId = null;
  if (orderInfo) {
    orderId = orderInfo.split(": ")[1].trim();
  }

  // Determine the message based on resultCode
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
      message = 'The transaction has been successfully confirmed.';
      message2 = 'Thank you for using our service!';
      headingStyle = styles.headingSuccess;
      if (orderId) {
        localStorage.setItem(`payment_status_${orderId}`, "success");
      }
      break;
    case '0':
      message = 'Payment successful.';
      message2 = 'Thank you for using our service!';
      headingStyle = styles.headingSuccess;
      if (orderId) {
        localStorage.setItem(`payment_status_${orderId}`, "success");
      }
      break;
    case '1006':
      message = 'The transaction was declined by the user.';
      headingStyle = styles.headingFailure;
      buttonStyle = styles.failureButton;
      buttonText = 'Close';
      break;
    case '1001':
      message = 'Payment failed!';
      message2 = 'The payment failed due to insufficient funds.';
      headingStyle = styles.headingFailure;
      break;
    case '1005':
      message = 'The transaction failed due to an expired URL or QR code.';
      message2 = 'Please send another payment request.';
      headingStyle = styles.headingFailure;
      break;
    default:
      message = 'Payment failed!';
      message2 = 'An error occurred. Please click Close.';
      headingStyle = styles.headingFailure;
      buttonStyle = styles.failureButton;
      buttonText = 'Close';
      break;
  }

  // Handle Close button
  const handleClose = () => {
    window.close();
  };

  return (
    <div style={styles.container}>
      <div style={styles.messageBox}>
        <h1 style={headingStyle}>{message}</h1>
        <p style={styles.paragraph}>{message2}</p>
        {/* Close button */}
        <button style={styles.closeButton} onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default PaymentResult;
