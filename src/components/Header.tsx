import React from "react";

interface HeaderProps {
    currentUser: { username: string } | null;
    onSwitchToLogin: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onSwitchToLogin, onLogout }) => {

    // Logic hiển thị nút Login / Logout
    const renderAuthButtons = () => {
        if (currentUser) {
            return (
                <div className="auth-status">
                    <span style={{ marginRight: '15px' }}>
                        Xin chào, <strong>{currentUser.username}</strong>!
                    </span>
                    <button onClick={onLogout} className="logout-button">
                        Đăng Xuất
                    </button>
                </div>
            );
        }

        return (
            <div className="auth-actions">
                <a href="#" onClick={onSwitchToLogin} className="auth-link-header">
                    <i className="fa-solid fa-user" style={{ marginRight: 6 }}></i>
                    Sign in
                </a>
            </div>
        );
    };

    return (
        <header className="main-header">
            <h1>Handmade Shop</h1>

            <nav className="main-nav">
                <a className="nav-link active" href="#">Trang Chủ</a>
                <a className="nav-link" href="#">Sản Phẩm</a>
                <a className="nav-link" href="#">Giỏ Hàng (0)</a>
            </nav>

            {renderAuthButtons()}
        </header>
    );
};

export default Header;
