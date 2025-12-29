// src/components/Footer.tsx
import React from "react";
import "../Styles/Footer.css"

const Footer: React.FC = () => {
    return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo & About */}
        <div className="footer-section">
          <h2 className="footer-logo">Handmade Shop</h2>
          <p className="footer-desc">
            Sản phẩm thủ công tinh tế – mang giá trị thủ công truyền thống đến
            từng khách hàng.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-section">
          <h3>Liên kết</h3>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/products">Sản phẩm</a></li>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Liên hệ</h3>
          <p>Email: support@handmadeshop.com</p>
          <p>Hotline: 0123 456 789</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Handmade Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
