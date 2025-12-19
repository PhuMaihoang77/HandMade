// src/Pages/Home.tsx
import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/model';
import { useProducts } from '../hooks/useProducts';
import '../Styles/home.css'; 
import '../Styles/layout.css'; 

interface HomeProps {
    currentUser: User | null;
}

const Home: React.FC<HomeProps> = ({ currentUser }) => {
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();

    // Chỉ lấy 4 hoặc 8 sản phẩm đầu tiên để làm "Sản phẩm nổi bật"
    const featuredProducts = useMemo(() => {
        return products ? products.slice(0, 8) : [];
    }, [products]);

    return (
        <div className="home-container">
            {/* 1. HERO SECTION: Banner chính */}
            <section className="hero-banner">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <span className="hero-subtitle">Bộ Sưu Tập Mới 2024</span>
                    <h1>Tinh Hoa Thủ Công Việt</h1>
                    <p>Mỗi sản phẩm là một câu chuyện, được làm nên từ đôi bàn tay khéo léo và trái tim nhiệt huyết.</p>
                    
                    <div className="hero-actions">
                        {!currentUser ? (
                            <>
                                <button className="btn-primary" onClick={() => navigate('/products')}>Mua Sắm Ngay</button>
                                <button className="btn-outline" onClick={() => navigate('/register')}>Đăng Ký Thành Viên</button>
                            </>
                        ) : (
                            <div className="welcome-box">
                                <h3>Xin chào, {currentUser.username}!</h3>
                                <button className="btn-primary" onClick={() => navigate('/products')}>Khám Phá Sản Phẩm</button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 2. SERVICE FEATURES: Cam kết (Lấp khoảng trống & Tăng uy tín) */}
            <section className="service-features">
                <div className="feature-item">
                    <div className="icon">🚚</div>
                    <h3>Giao Hàng Toàn Quốc</h3>
                    <p>Miễn phí vận chuyển cho đơn từ 500k</p>
                </div>
                <div className="feature-item">
                    <div className="icon">🛡️</div>
                    <h3>Bảo Hành 1 Đổi 1</h3>
                    <p>Cam kết chất lượng trong 30 ngày</p>
                </div>
                <div className="feature-item">
                    <div className="icon">🎁</div>
                    <h3>Quà Tặng Độc Đáo</h3>
                    <p>Gói quà miễn phí cho mọi đơn hàng</p>
                </div>
            </section>

            {/* 3. FEATURED PRODUCTS: Sản phẩm nổi bật (Giới hạn số lượng) */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Sản Phẩm Nổi Bật</h2>
                    <p>Những món đồ được yêu thích nhất tháng này</p>
                </div>

                {loading && <div className="loading">Đang tải tinh hoa...</div>}
                {error && <div className="error-message">{error}</div>}

                {!loading && !error && (
                    <div className="product-grid-limited">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <div className="view-more-container">
                    <button className="btn-view-all" onClick={() => navigate('/products')}>
                        Xem Tất Cả Sản Phẩm &rarr;
                    </button>
                </div>
            </section>

            {/* 4. PROMO BANNER: Chương trình khuyến mãi lớn (Điểm nhấn) */}
            <section className="promo-banner">
                <div className="promo-content">
                    <span className="promo-tag">Khuyến Mãi Đặc Biệt</span>
                    <h2>Giảm 20% Cho Đơn Hàng Đầu Tiên</h2>
                    <p>Nhập mã <strong>WELCOME20</strong> khi thanh toán. Áp dụng cho toàn bộ sản phẩm thủ công.</p>
                    <button className="btn-white" onClick={() => navigate('/product')}>Săn Deal Ngay</button>
                </div>
                <div className="promo-image">
                    {/* Ảnh minh họa khuyến mãi */}
                    <img src="https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&q=80&w=600" alt="Promo" />
                </div>
            </section>
        </div>
    );
};

export default Home;