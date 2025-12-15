import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types/model';
import { useProducts } from '../hooks/useProducts';
interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const { products } = useProducts();
    const [query, setQuery] = useState('');

    const normalizedQuery = query.trim().toLowerCase();
    const suggestions = useMemo(() => {
        if (!normalizedQuery) return [];
        return products
            .filter(p => p.name.toLowerCase().includes(normalizedQuery))
            .slice(0, 6);
    }, [products, normalizedQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!normalizedQuery) return;
        const target = suggestions[0] ?? products.find(p => p.name.toLowerCase().includes(normalizedQuery));
        if (target) {
            navigate(`/product/${target.id}`);
            setQuery('');
        }
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
                <Link to="/cart" className="nav-link">Giỏ hàng</Link>
                <Link to="/contact" className="nav-link">Liên Hệ</Link>
            </nav>

            {/* Search */}
            <div className="search-wrapper">
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit"><i className="fas fa-search"></i></button>
                </form>
                {suggestions.length > 0 && (
                    <div className="search-suggestions">
                        {suggestions.map(product => (
                            <button
                                key={product.id}
                                className="suggestion-item"
                                onClick={() => {
                                    navigate(`/product/${product.id}`);
                                    setQuery('');
                                }}
                            >
                                <span className="suggestion-name">{product.name}</span>
                                <span className="suggestion-price">
                                    {product.price.toLocaleString('vi-VN')} VNĐ
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* User / Auth */}
            <div className="auth-actions">
                {currentUser ? (
                    <div className="auth-status">
                        <Link to="/profile" className="profile-link-header">
                            <i className="fas fa-user-circle"></i>
                            <span>{currentUser.username}</span>
                        </Link>
                        <button className="logout-button" onClick={onLogout}>Đăng Xuất</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="auth-link-header">Đăng Nhập</Link>
                        <Link to="/cart" className="nav-cart"><i className="fa-solid fa-cart-shopping icon-white" ></i></Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
