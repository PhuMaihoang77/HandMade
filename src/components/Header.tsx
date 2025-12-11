import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../App';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Tính năng tìm kiếm đang phát triển!');
    };

    return (
        <header className="main-header">
            {/* Logo */}
            <h1>
                <Link to="/" className="logo-link">
                    HandMade<span>Store</span>
                </Link>
            </h1>

            {/* Navigation */}
            <nav className="main-nav">
                <Link to="/" className="nav-link">Trang Chủ</Link>
                <Link to="/products" className="nav-link">Sản Phẩm</Link>
                <Link to="/about" className="nav-link">Giới Thiệu</Link>
                <Link to="/contact" className="nav-link">Liên Hệ</Link>
            </nav>

            {/* Search */}
            <form className="search-bar" onSubmit={handleSearch}>
                <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                <button type="submit"><i className="fas fa-search"></i></button>
            </form>

            {/* User / Auth */}
            <div className="auth-actions">
                {currentUser ? (
                    <div className="auth-status">
                        <span><i className="fas fa-user-circle"></i> {currentUser.username}</span>
                        <button className="logout-button" onClick={onLogout}>Đăng Xuất</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="auth-link-header">Đăng Nhập</Link>
                        <Link to="/register" className="auth-link-header">Đăng Ký</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
