import React, { useEffect, useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getProducts } from '../services/ProductService';
import { useNavigate } from 'react-router-dom'; // 1. Import hook điều hướng
import { User } from '../App';
import '../Styles/layout.css';
import '../Styles/product.css';

interface HomeProps {

    currentUser: User | null;

    // Đã xóa: onSwitchToLogin, onSwitchToRegister, onLogout vì không cần truyền từ App nữa

}
const Home: React.FC<HomeProps> = ({ currentUser }) => {
    const navigate = useNavigate(); // 3. Khai báo hook
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-banner">
                <div className="hero-content">
                    <h1>Tinh Hoa Thủ Công Việt</h1>
                    <p>Khám phá những sản phẩm handmade độc đáo, mang đậm bản sắc cá nhân.</p>
                    {!currentUser ? (
                        <div className="hero-buttons">

                            {/* 4. Sửa onClick: Dùng navigate thay vì props */}
                            <button 
                                className="btn-primary" 
                                onClick={() => navigate('/login')}
                            >
                                Đăng Nhập Ngay
                            </button>
                            <button 
                                className="btn-secondary" 
                                onClick={() => navigate('/register')}
                            >
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
                {loading ? (
                    <div className="loading">Đang tải sản phẩm...</div>
                ) : (
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