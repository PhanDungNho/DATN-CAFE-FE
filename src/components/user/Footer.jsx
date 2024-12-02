import React from "react";
import ChatWidget from "../admin/chat-wiget/ChatWiget"; // Kiểm tra tên file và đường dẫn chính xác

function Footer() {
  return (
    <>
      {/* Footer */}
      <div className="footer-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="footer-box about-widget">
                <h2 className="widget-title">About us</h2>
                <p>
                  Here, every glass of water is a small joy, every moment is a memorable memory for you to take with you.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-box get-in-touch">
                <h2 className="widget-title">Address</h2>
                <ul>
                  <li>
                    Toà nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng,
                    Cần Thơ.
                  </li>
                  <li>walacafe79@gmail.com</li>
                  <li>+84 336 179 835</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-box pages">
                <h2 className="widget-title">Page</h2>
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/about">About us</a>
                  </li>
                  <li>
                    <a href="/shop">Product</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-box subscribe">
                <h2 className="widget-title">Register</h2>
                <p>
                  Sign up to our newsletter to receive the latest product updates.
                </p>
                <form action="index.html">
                  <input type="email" placeholder="Email" required />
                  <button type="submit">
                    <i className="fas fa-paper-plane" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End footer */}

      {/* Copyright */}
      <div className="copyright">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12"></div>
            <div className="col-lg-6 text-right col-md-12">
              <div className="social-icons">
                <ul>
                  <li>
                    <a href="https://www.facebook.com/profile.php?id=61566579881886" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-facebook-f" />
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End copyright */}

      {/* Chat widget */}
      <ChatWidget apiUrl="http://localhost:2998/api/chat" />
    </>
  );
}

export default Footer;