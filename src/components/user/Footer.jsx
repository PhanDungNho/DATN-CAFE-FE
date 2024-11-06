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
                  <h2 className="widget-title">About</h2>
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
                      FPT Polytechnic, Đ.22, Thuong Thanh, Cai Rang, Can Tho.
                    </li>
                    <li>walacafe79@gmail.com</li>
                    <li>+84 828631623</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box pages">
                  <h2 className="widget-title">Pages</h2>
                  <ul>
                    <li>
                      <a href="/">Home </a>
                    </li>
                    <li>
                      <a href="/about">About</a>
                    </li>
                    <li>
                      <a href="/shop">Products</a>
                    </li>
                    <li>
                      <a href="/contact">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box subscribe">
                  <h2 className="widget-title">Register</h2>
                  <p>
                  Please sign up to our newsletter to receive updates on the latest products.
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
