// src/components/Home.tsx
import React from 'react';
import ProductCard, { Product } from './ProductCard';

// Dữ liệu mẫu (sử dụng 3 khung rỗng)
const emptyProducts: Product[] = [
    { id: 1, name: "Tên Sản Phẩm Handmade", price: 100000, imageUrl: "", description: "Mô tả ngắn gọn về sản phẩm thủ công." },
    { id: 2, name: "Tên Sản Phẩm Handmade", price: 100000, imageUrl: "", description: "Mô tả ngắn gọn về sản phẩm thủ công." },
    { id: 3, name: "Tên Sản Phẩm Handmade", price: 100000, imageUrl: "", description: "Mô tả ngắn gọn về sản phẩm thủ công." },
];

interface HomeProps {
    currentUser: { username: string } | null;
    onSwitchToLogin: () => void;
    onSwitchToRegister: () => void;
    onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ currentUser, onSwitchToLogin, onSwitchToRegister, onLogout }) => {

    // Logic hiển thị nút Đăng nhập/Đăng ký/Đăng xuất
    const renderAuthButtons = () => {
        if (currentUser) {
            return (
                <div className="auth-status">
                    <span style={{marginRight: '15px'}}>Xin chào, **{currentUser.username}**!</span>
                    <button onClick={onLogout} className="logout-button">Đăng Xuất</button>
                </div>
            );
        }
        return (
            <div className="auth-actions">
                <a href="#" onClick={onSwitchToLogin} className="auth-link-header">Đăng Nhập</a>
                <span style={{color: 'white', margin: '0 5px'}}>/</span>
                <a href="#" onClick={onSwitchToRegister} className="auth-link-header">Đăng Ký</a>
            </div>
        );
    };

    return (
        <div className="app-layout">
            <header className="main-header">
                <h1>Handmade Shop</h1>
                <nav className="main-nav">
                    {/* Các Tab điều hướng */}
                    <a href="#" className="nav-link active">Trang Chủ</a>
                    <a href="#" className="nav-link">Sản Phẩm</a>
                    <a href="#" className="nav-link">Giỏ Hàng (0)</a>
                </nav>

                {/* Khu vực Đăng nhập/Đăng ký/Đăng xuất ở góc phải */}
                {renderAuthButtons()}

            </header>

            <main className="product-grid">
                <h2>Khung Bố Cục Sản Phẩm</h2>
                <div className="product-list-wrapper">
                    {/* ⭐ SỬ DỤNG DỮ LIỆU RỖNG CHỈ ĐỂ TẠO KHUNG */}
                    {emptyProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>

            <footer className="main-footer">
                <p>&copy; 2025 Handmade Shop. Powered by React.</p>
            </footer>
        </div>
    );
};

export default Home;