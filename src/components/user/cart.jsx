import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function cart() {
  return (
    <>
      <Header />
      <div className="breadcrumb-section breadcrumb-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="breadcrumb-text">
                <p>Fresh and Organic</p>
                <h1>Cart</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cart-section mt-150 mb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <div className="cart-table-wrap">
                <table className="cart-table">
                  <thead className="cart-table-head">
                    <tr className="table-head-row">
                      <th className="product-remove" />
                      <th className="product-image">Ảnh sản phẩm</th>
                      <th className="product-name">Tên sản phẩm</th>
                      <th className="product-price">Giá</th>
                      <th className="product-quantity">Số lượng</th>
                      <th className="product-total">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="table-body-row">
                      <td className="product-remove">
                        <a href="#">
                          <i className="far fa-window-close" />
                        </a>
                      </td>
                      <td className="product-image">
                        <img
                          src="assets/img/products/product-img-1.jpg"
                          alt=""
                        />
                      </td>
                      <td className="product-name">Cafe sữa</td>
                      <td className="product-price">15.000 VNĐ</td>
                      <td className="product-quantity">
                        <input type="number" placeholder={0} />
                      </td>
                      <td className="product-total">15.000 VNĐ</td>
                    </tr>
                    <tr className="table-body-row">
                      <td className="product-remove">
                        <a href="#">
                          <i className="far fa-window-close" />
                        </a>
                      </td>
                      <td className="product-image">
                        <img
                          src="assets/img/products/product-img-2.jpg"
                          alt=""
                        />
                      </td>
                      <td className="product-name">Cafe đen</td>
                      <td className="product-price">10.000 VNĐ</td>
                      <td className="product-quantity">
                        <input type="number" placeholder={0} />
                      </td>
                      <td className="product-total">10.000 VNĐ</td>
                    </tr>
                    <tr className="table-body-row">
                      <td className="product-remove">
                        <a href="#">
                          <i className="far fa-window-close" />
                        </a>
                      </td>
                      <td className="product-image">
                        <img
                          src="assets/img/products/product-img-3.jpg"
                          alt=""
                        />
                      </td>
                      <td className="product-name">Lipton sữa</td>
                      <td className="product-price">20.000 VNĐ</td>
                      <td className="product-quantity">
                        <input type="number" placeholder={0} />
                      </td>
                      <td className="product-total">20.000 VNĐ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="total-section">
                <table className="total-table">
                  <thead className="total-table-head">
                    <tr className="table-total-row">
                      <th>Tổng tiền</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="total-data">
                      <td>
                        <strong>Tổng tiền giỏ hàng: </strong>
                      </td>
                      <td>45.000 VNĐ</td>
                    </tr>
                    <tr className="total-data">
                      <td>
                        <strong>Phí giao hàng: </strong>
                      </td>
                      <td>15.000 VNĐ</td>
                    </tr>
                    <tr className="total-data">
                      <td>
                        <strong>Tổng tiền: </strong>
                      </td>
                      <td>60.000 VNĐ</td>
                    </tr>
                  </tbody>
                </table>
                <div className="cart-buttons">
                  <a href="" className="boxed-btn">
                    Mua thêm
                  </a>
                  <a href="checkout.html" className="boxed-btn black">
                    Thanh toán
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default cart;
