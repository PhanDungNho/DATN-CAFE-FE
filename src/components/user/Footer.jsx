import React from "react";

function Footer() {
  return (
    <>
        {/* footer */}
        <div className="footer-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="footer-box about-widget">
                  <h2 className="widget-title">Về chúng tôi</h2>
                  <p>
                    Ở đây, mỗi ly nước là một niềm vui nhỏ, mỗi phút giây là một kỷ
                    niệm đáng nhớ để bạn mang theo
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box get-in-touch">
                  <h2 className="widget-title">Địa chỉ</h2>
                  <ul>
                    <li>
                      Toà nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần
                      Thơ
                    </li>
                    <li>walacafe79@gmail.com</li>
                    <li>+84 828631623</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box pages">
                  <h2 className="widget-title">Trang</h2>
                  <ul>
                    <li>
                      <a href="/">Trang chủ </a>
                    </li>
                    <li>
                      <a href="/about">Về chúng tôi</a>
                    </li>
                    <li>
                      <a href="/shop">Sản phẩm</a>
                    </li>
                    <li>
                      <a href="/contact">Liên hệ</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box subscribe">
                  <h2 className="widget-title">Đăng ký</h2>
                  <p>
                    Hãy đăng ký vào danh sách nhận tin của chúng tôi để nhận những cập
                    nhật về sản phẩm mới nhất.
                  </p>
                  <form action="index.html">
                    <input type="email" placeholder="Email" />
                    <button type="submit">
                      <i className="fas fa-paper-plane" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end footer */}
        {/* copyright */}
        <div className="copyright">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-12"></div>
              <div className="col-lg-6 text-right col-md-12">
                <div className="social-icons">
                  <ul>
                    <li>
                      <a href="#" target="_blank">
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank">
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank">
                        <i className="fab fa-linkedin" />
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank">
                        <i className="fab fa-dribbble" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end copyright */}
      </>
  );
}

export default Footer;
