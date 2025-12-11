// src/Pages/Home.tsx
import React from 'react';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/model';
import { useProducts } from '../hooks/useProducts'; // 1. Import Hook vừa tạo
import '../Styles/layout.css';
import '../Styles/product.css';

interface HomeProps {
    currentUser: User | null;
}

const Home: React.FC<HomeProps> = ({ currentUser }) => {
    const navigate = useNavigate();
    
    // 2. Sử dụng Hook: Chỉ cần 1 dòng code để lấy toàn bộ dữ liệu
    const { products, loading, error } = useProducts();

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-banner">
                <div className="hero-content">
                    <h1>Tinh Hoa Thủ Công Việt</h1>
                    <p>Khám phá những sản phẩm handmade độc đáo, mang đậm bản sắc cá nhân.</p>
                    
                    {!currentUser ? (
                        <div className="hero-buttons">
                            <button className="btn-primary" onClick={() => navigate('/login')}>
                                Đăng Nhập Ngay
                            </button>
                            <button className="btn-secondary" onClick={() => navigate('/register')}>
                                Đăng Ký
                            </button>
                        </div>
                    ) : (
                        <div className="welcome-message">
                            <h3>Xin chào, {currentUser.username}!</h3>
                            <p>Chúc bạn một ngày mua sắm vui vẻ.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Product List */}
            <section className="product-section">
                <h2>Sản Phẩm Nổi Bật</h2>

                {/* Xử lý các trạng thái Loading / Error / Data */}
                {loading && <div className="loading">Đang tải sản phẩm...</div>}
                
                {error && <div className="error-message">{error}</div>}

                {!loading && !error && (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;