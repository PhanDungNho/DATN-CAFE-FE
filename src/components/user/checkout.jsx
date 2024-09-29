import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function checkout() {
  return (
    <>
      <Header />
      <div className="breadcrumb-section breadcrumb-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="breadcrumb-text">
                <p>Fresh and Organic</p>
                <h1>Check Out Product</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-section mt-150 mb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="checkout-accordion-wrap">
                <div className="accordion" id="accordionExample">
                  <div className="card single-accordion">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="collapse"
                          data-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          Thông tin khách hàng
                        </button>
                      </h5>
                    </div>

                    <div
                      id="collapseOne"
                      className="collapse show"
                      aria-labelledby="headingOne"
                      data-parent="#accordionExample"
                    >
                      <div className="card-body">
                        <div className="billing-address-form">
                          <form action="index.html">
                            <p>
                              <input type="text" placeholder="Họ tên" />
                            </p>
                            <p>
                              <input type="email" placeholder="Email" />
                            </p>
                            <p>
                              <input type="text" placeholder="Địa chỉ" />
                            </p>
                            <p>
                              <input type="tel" placeholder="Số điện thoại" />
                            </p>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card single-accordion">
                    <div className="card-header" id="headingTwo">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link collapsed"
                          type="button"
                          data-toggle="collapse"
                          data-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          Địa chỉ giao hàng
                        </button>
                      </h5>
                    </div>
                    <div
                      id="collapseTwo"
                      className="collapse"
                      aria-labelledby="headingTwo"
                      data-parent="#accordionExample"
                    >
                      <>
                        Tổng cộng 95.000 VNĐ Phí ship 15.000 VNĐ Tổng thành tiền
                        110.000 VNĐ
                      </>
                    </div>
                  </div>
                  <div className="card single-accordion">
                    <div className="card-header" id="headingThree">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link collapsed"
                          type="button"
                          data-toggle="collapse"
                          data-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          Hình thức thanh toán
                        </button>
                      </h5>
                    </div>
                    <div
                      id="collapseThree"
                      className="collapse"
                      aria-labelledby="headingThree"
                      data-parent="#accordionExample"
                    >
                      <div className="card-body">
                        <div className="card-details">
                          <div className="thanhtoantructiep">
                            <input type="radio" name="payment" /> Thanh toán khi
                            nhận hàng
                          </div>
                          <div className="thanhtoanvnpay">
                            <input type="radio" name="payment" /> Thanh toán
                            bằng ví VNPay
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="order-details-wrap">
                <table className="order-details">
                  <thead>
                    <tr>
                      <th>Giỏ hàng </th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="order-details-body">
                    <tr>
                      <td>Sản phẩm</td>
                      <td>Số lượng</td>
                      <td>Giá</td>
                      <td>Tổng tiền</td>
                    </tr>
                    <tr>
                      <td>Cafe đen</td>
                      <td>2</td>
                      <td>10.000 VNĐ</td>
                      <td>20.000 VNĐ</td>
                    </tr>
                    <tr>
                      <td>Cafe sữa </td>
                      <td>1</td>
                      <td>15.000 VNĐ</td>
                      <td>15.000 VNĐ</td>
                    </tr>
                    <tr>
                      <td>Trà chanh</td>
                      <td>4</td>
                      <td>10.000 VNĐ</td>
                      <td>60.000 VNĐ</td>
                    </tr>
                  </tbody>
                  <>
                    Tổng cộng 95.000 VNĐ Phí ship 15.000 VNĐ Tổng thành tiền
                    110.000 VNĐ
                  </>
                </table>
                <a href="#" className="boxed-btn">
                  Thanh toán
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default checkout;
