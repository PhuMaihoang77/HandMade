import React, { useMemo,useState,useEffect } from 'react';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/model';
import { useProducts, getTimeRemaining } from '../hooks/useProducts';
import '../Styles/home.css'; 
import '../Styles/layout.css'; 

import { Link } from 'react-router-dom';
import { useProductFeatures } from '../hooks/useProductFeatures';

const Home: React.FC<{ currentUser: any }> = ({ currentUser }) => {
    const { products, loading, error } = useProducts();
    const { currentProducts } = useProductFeatures({ products, itemsPerPage: 4 });
    
   
    const featuredProducts = currentProducts.slice(0, 3);
 const tetDate = new Date('2026-02-17T00:00:00'); // 🔴 sửa đúng ngày Giao Thừa
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(tetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeRemaining(tetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    return (
        <div className="home-container">
            {/* HERO BANNER Tết Bính Ngọ */}
            <section className="hero-banner">
                <div className="hero-overlay"></div>
                <div className="horse-decoration">
                    <div className="horse-silhouette"></div>
                    <div className="horse-silhouette reverse"></div>
                </div>
                <div className="firework firework-1"></div>
                <div className="firework firework-2"></div>
                <div className="firework firework-3"></div>
                
                <div className="hero-content">
                    <span className="hero-subtitle">Chào Xuân Bính Ngọ 2026</span>
                    <h1>Mã Đáo Thành Công<br />An Khang Thịnh Vượng</h1>
                    <p>Đón năm Ngựa vàng với bộ sưu tập gốm sứ cao cấp - Biểu tượng của sự sung túc, bền vững và thành công vượt bậc</p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn-primary">
                            <span className="btn-icon">🐎</span> Khám Phá Ngay
                        </Link>
                        <Link to="/games" className="btn-outline">
                           Vòng quay may mắn 
                        </Link> 
                    </div>
                </div>
                
                <div className="tet-decoration">
                    <div className="lantern lantern-left"></div>
                    <div className="lantern lantern-right"></div>
                    <div className="spring-flower spring-flower-1">🌸</div>
                    <div className="spring-flower spring-flower-2">🏵️</div>
                </div>
            </section>

            {/* SERVICE FEATURES với chủ đề Tết */}
            <section className="service-features">
                <div className="feature-item">
                    <div className="icon">🎁</div>
                    <h3>Quà Tết Cao Cấp</h3>
                    <p>Hộp quà Tết sang trọng, bọc lụa đỏ vàng, phù hợp biếu tặng đối tác, người thân</p>
                </div>
                <div className="feature-item">
                    <div className="icon">🚚</div>
                    <h3>Giao Hàng Tết</h3>
                    <p>Miễn phí giao hàng toàn quốc đơn từ 1.5 triệu, đảm bảo nhận hàng trước 30 Tết</p>
                </div>
                <div className="feature-item">
                    <div className="icon">🎨</div>
                    <h3>Thiết Kế Độc Quyền</h3>
                    <p>Họa tiết ngựa phong thủy, chữ Tết thư pháp độc bản, mang may mắn cả năm</p>
                </div>
                <div className="feature-item">
                    <div className="icon">💝</div>
                    <h3>Bảo Hành Trọn Đời</h3>
                    <p>Cam kết chất lượng, đổi trả trong 7 ngày, bảo hành sản phẩm trọn đời</p>
                </div>
            </section>

            {/* FEATURED PRODUCTS - Tết Bính Ngọ */}
            <section className="featured-section">
                <div className="section-header">
                    <div className="horse-heading-decoration">
                        <span className="horse-head">🐎</span>
                        <h2>Sản Phẩm Tết Đặc Biệt</h2>
                        <span className="horse-head reverse">🐎</span>
                    </div>
                    <p>Bộ sưu tập giới hạn "Mã Đáo Thành Công" - Thiết kế riêng cho năm Ngựa vàng 2026</p>
                    <div className="chinese-character">馬</div>
                </div>
                
                <div className="product-grid-limited">
                   {featuredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                currentUser={currentUser}
                            />
                        ))}
                </div>
                
                <div className="view-more-container">
                    <Link to="/products" className="btn-view-all">
                        <span className="btn-horse-icon">🏇</span> Xem Tất Cả Sản Phẩm Tết
                    </Link>
                </div>
            </section>

            {/* PROMO BANNER - Ưu đãi Tết */}
            <section className="promo-banner">
                <div className="promo-content">
                    <div className="promo-tag">ƯU ĐÃI ĐẶC BIỆT</div>
                    <h2>Lì Xì Đầu Năm<br />Giảm 20% Toàn Bộ</h2>
                    <p>Nhập mã <strong>BINHNGO2026</strong> để nhận ưu đãi đặc biệt. Áp dụng từ 1/1 đến 15/1 Âm lịch. Miễn phí thiết kế chữ thư pháp theo yêu cầu.</p>
                    <button className="btn-white">
                        <span className="btn-gold-icon">💰</span> Nhận Mã Ngay
                    </button>
                    
                    <div className="countdown-tet">
    <h4>Đếm ngược đến Giao Thừa</h4>

    <div className="countdown-timer">
        <div className="countdown-item">
            <span className="countdown-number">{timeLeft.days}</span>
            <span className="countdown-label">Ngày</span>
        </div>

        <div className="countdown-separator">:</div>

        <div className="countdown-item">
            <span className="countdown-number">{timeLeft.hours}</span>
            <span className="countdown-label">Giờ</span>
        </div>

        <div className="countdown-separator">:</div>

        <div className="countdown-item">
            <span className="countdown-number">{timeLeft.minutes}</span>
            <span className="countdown-label">Phút</span>
        </div>

        <div className="countdown-separator">:</div>

        <div className="countdown-item">
            <span className="countdown-number">{timeLeft.seconds}</span>
            <span className="countdown-label">Giây</span>
        </div>
    </div>
</div>

                </div>
                
                <div className="promo-image">
                    <img src="https://images.unsplash.com/photo-1544735716-c2c25ceb3c9a?auto=format&fit=crop&q=80&w=1600" alt="Bộ sưu tập Tết" />
                    <div className="promo-overlay">
                        <div className="chinese-blessing">馬到成功</div>
                        <div className="english-blessing">Success Comes with the Horse</div>
                    </div>
                </div>
                
                <div className="gold-coin gold-coin-1"></div>
                <div className="gold-coin gold-coin-2"></div>
                <div className="gold-coin gold-coin-3"></div>
            </section>
            
            {/* Tết Traditions Section */}
            <section className="tet-traditions">
                <div className="tradition-content">
                    <h3>Truyền Thống Tết Việt</h3>
                    <p>Năm Bính Ngọ - Ngựa tượng trưng cho sự nhanh nhẹn, bền bỉ và thành công. Mỗi sản phẩm của chúng tôi đều được chế tác với tinh thần ấy, kết hợp tinh hoa gốm sứ Việt cùng ý nghĩa phong thủy sâu sắc.</p>
                    <div className="tradition-icons">
                        <div className="tradition-icon-item">
                            <div className="icon-circle">🌺</div>
                            <span>Mai Vàng</span>
                        </div>
                        <div className="tradition-icon-item">
                            <div className="icon-circle">🍊</div>
                            <span>Quất Cảnh</span>
                        </div>
                        <div className="tradition-icon-item">
                            <div className="icon-circle">📜</div>
                            <span>Thư Pháp</span>
                        </div>
                        <div className="tradition-icon-item">
                            <div className="icon-circle">🏮</div>
                            <span>Đèn Lồng</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;