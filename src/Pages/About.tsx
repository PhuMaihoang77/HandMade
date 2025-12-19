import React from 'react';
import { User } from '../types/model';
import '../Styles/about.css';

interface AboutProps {
    currentUser: User | null;
}

const About: React.FC<AboutProps> = ({ currentUser }) => {
    return (
        <div className="about-page">
            {/* Hero */}
            <section className="about-section about-hero">
                <div className="about-hero-text" style={{ textAlign: 'center' }}>
                    <h1>Chào mừng đến với HandMade Store</h1>
                    <p>“Nơi bạn tìm thấy những sản phẩm thủ công độc đáo, sáng tạo và chất lượng”</p>
                </div>
            </section>

            {/* Giới thiệu chung */}
            <section className="about-section about-content">
                <h2>Về chúng tôi</h2>
                <p>
                    HandMade Store ra đời với sứ mệnh mang đến cho khách hàng những sản phẩm thủ công tinh xảo, được làm bằng tay bởi các nghệ nhân tài năng. Chúng tôi tin rằng mỗi sản phẩm đều chứa đựng câu chuyện riêng và giá trị nghệ thuật độc đáo.
                </p>

                <h2>Cách xây dựng thương hiệu</h2>
                <p>
                    Nhờ nắm bắt được nhu cầu khách hàng, HandMade Store đã tạo dựng được uy tín nhờ chất lượng sản phẩm và trải nghiệm mua sắm độc đáo. Chúng tôi lựa chọn những nguyên liệu tốt nhất, thiết kế tinh tế và luôn cập nhật các xu hướng DIY mới.
                </p>

                <h2>Sản phẩm của chúng tôi</h2>
                <p>
                    Chúng tôi cung cấp các sản phẩm handmade đa dạng: đồ trang trí, quà tặng, đồ gia dụng, phụ kiện và nhiều sản phẩm DIY khác. Mỗi món đồ đều được lựa chọn kỹ lưỡng, đảm bảo chất lượng, thẩm mỹ, phù hợp cho nhiều mục đích: làm quà, trang trí nhà cửa, hoặc dùng trong các dịp đặc biệt.
                </p>

                <h2>Cam kết và chiến lược</h2>
                <ul>
                    <li>Sản phẩm chất lượng, nguyên liệu an toàn.</li>
                    <li>Dịch vụ khách hàng tận tâm, hỗ trợ nhanh chóng.</li>
                    <li>Giao hàng an toàn, đóng gói chắc chắn.</li>
                    <li>Hỗ trợ đổi trả và bảo hành hợp lý.</li>
                    <li>Thiết kế độc đáo, không trùng lặp với các sản phẩm khác.</li>
                </ul>

                <h2>Đội ngũ và xưởng sản xuất</h2>
                <p>
                    HandMade Store sở hữu đội ngũ nghệ nhân chuyên nghiệp và xưởng sản xuất thủ công riêng, đảm bảo mỗi sản phẩm đều được chăm chút tỉ mỉ. Chúng tôi không ngừng sáng tạo để mang đến những món đồ độc đáo, đẹp mắt và chất lượng.
                </p>

                <h2>Liên hệ</h2>
                <p>
                    HandMade Store <br />
                    Trụ sở: 123 Đường Handmade, Thành phố Sáng Tạo, Việt Nam <br />
                    Hotline: 1900 1234 <br />
                    Email: support@handmadestore.com <br />
                    Website: https://handmadestore.com <br />
                    Facebook: https://www.facebook.com/handmadestore
                </p>
            </section>
        </div>
    );
};

export default About;
