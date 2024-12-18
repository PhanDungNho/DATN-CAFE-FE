import React, { Component } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { API_TRANSACTION, API_MOMO, API } from "./constant";

const ngrok = "https://4e4e-42-114-18-208.ngrok-free.app";

export default class PaymentService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentData: null,
      orderId: null, // Lưu trữ orderId để kiểm tra trạng thái
    };
    this.accessKey = "F8BBA842ECF85";
    this.secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  }

  // Hàm tạo giao dịch thanh toán
  createPayment = (amount, orderInfo, orderId) => {
    const partnerCode = "MOMO";
    const redirectUrl = "https://walacafe.io.vn/paymentresult";
    const ipnUrl = API + "/api/v1/transactions/ipn";
    const requestType = "payWithMethod";
    const newOrderId = partnerCode + new Date().getTime(); // Tạo orderId duy nhất
    const requestId = newOrderId;
    const extraData = "";
    const autoCapture = true;
    const lang = "vi";
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${newOrderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = CryptoJS.HmacSHA256(
      rawSignature,
      this.secretKey
    ).toString();

    const requestBody = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId: newOrderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId: "",
      signature,
      dsa: "d",
    };
    console.log(requestBody);

    return axios.post("http://localhost:2999/momo/create", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };


  refund = function (transaction) {
    const partnerCode = "MOMO";
    const requestId = partnerCode + new Date().getTime();
    const orderId = partnerCode + new Date().getTime();
    const description = "Refund for transaction"; // Description được thêm vào rawSignature

    const rawSignature = `accessKey=${this.accessKey}&amount=${transaction.amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transaction.transId}`;
    const signature = CryptoJS.HmacSHA256(
      rawSignature,
      this.secretKey
    ).toString();

    const requestBody = {
      partnerCode: partnerCode,
      requestId: requestId,
      orderId: orderId,
      amount: transaction.amount,
      transId: transaction.transId,
      lang: "vi",
      description: "Refund for transaction",
      signature: signature,
    };

    console.log("Request Body:", requestBody);
    return axios.post(
      "http://localhost:2999/momo/refund",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  insertTransaction = async (transaction) => {
    return await axios.post(API_TRANSACTION, transaction, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Gửi token trong header
      },
    });
  };

  // Hàm kiểm tra trạng thái của giao dịch đã tạo
  checkStatus = () => {
    const { orderId } = this.state;
    if (!orderId) {
      console.error("No orderId available. Please create a payment first.");
      return;
    }

    const partnerCode = "MOMO"; // Cập nhật đúng với partnerCode của anh
    const requestId = orderId; // requestId và orderId là cùng một giá trị
    const lang = "en"; // Dùng 'en' như yêu cầu

    // Tạo chữ ký (signature) từ rawSignature với các tham số đúng thứ tự
    const rawSignature = `accessKey=${this.accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
    const signature = CryptoJS.HmacSHA256(
      rawSignature,
      this.secretKey
    ).toString();

    // Request body theo yêu cầu API
    const requestBody = {
      partnerCode, // "partnerCode": "MOMO"
      requestId, // "requestId": "1527246504579"
      orderId, // "orderId": "1527246478428"
      signature, // "signature": "13be80957a5ee32107198920fa26aa85a4ca238a29f46e292e8c33dd9186142a"
      lang, // "lang": "en"
    };

    axios
      .post("http://localhost:2999/momo/query", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        this.setState({ paymentData: response.data });
      })
      .catch((error) => {
        console.error("There was an error checking the status!", error);
      });
  };

  render() {
    const { paymentData } = this.state;

    return (
      <div>
        <button onClick={() => this.createPayment(100000, "Test Payment")}>
          Create Payment
        </button>
        <button onClick={this.checkStatus}>Check Status</button>
        {paymentData && <pre>{JSON.stringify(paymentData, null, 2)}</pre>}
      </div>
    );
  }
}
