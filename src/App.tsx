// src/App.tsx (Dán lại toàn bộ nội dung này)
import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import Home from './Pages/Home'; // Import Home
import './Styles/global.css';

// 1. KHAI BÁO KIỂU USER
export interface User {
    id: number;
    email: string;
    username: string;
    password?: string;
}

// 2. KHAI BÁO TRẠNG THÁI PAGE
const PAGE = {
    HOME: 'home',
    LOGIN: 'login',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgot_password',
} as const;

type PageType = typeof PAGE[keyof typeof PAGE]; // Định nghĩa kiểu union

function App() {
    // 3. KHAI BÁO STATE VỚI KIỂU RÕ RÀNG
    const [currentPage, setCurrentPage] = useState<PageType>(PAGE.HOME);

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) as User : null;
    });

    // 4. CÁC HÀM XỬ LÝ (GIẢI QUYẾT LỖI 'Cannot find name handleLoginSuccess')
    useEffect(() => {
        if (currentUser) {
            setCurrentPage(PAGE.HOME);
        }
    }, [currentUser]);

    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        setCurrentPage(PAGE.HOME);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        setCurrentPage(PAGE.HOME); // Sau khi đăng xuất, trở về trang Home
    };

    const renderPage = () => {
        const isAuthPage = currentPage !== PAGE.HOME;
        const handleCloseAuth = () => setCurrentPage(PAGE.HOME);
        // Nếu đang ở trang xác thực, chỉ render form đó
        if (isAuthPage) {
            return (
                <div className="auth-page-wrapper">
                    {currentPage === PAGE.LOGIN && (
                        <Login
                            onLoginSuccess={handleLoginSuccess}
                            onSwitchToRegister={() => setCurrentPage(PAGE.REGISTER)}
                            onSwitchToForgot={() => setCurrentPage(PAGE.FORGOT_PASSWORD)}
                            onClose={handleCloseAuth}
                        />
                    )}
                    {currentPage === PAGE.REGISTER && (
                        <Register
                            onSwitchToLogin={() => setCurrentPage(PAGE.LOGIN)}
                            onClose={handleCloseAuth}
                        />
                    )}
                    {currentPage === PAGE.FORGOT_PASSWORD && (
                        <ForgotPassword
                            onSwitchToLogin={() => setCurrentPage(PAGE.LOGIN)}
                            onClose={handleCloseAuth}
                        />
                    )}
                </div>
            );
        }

        // Mặc định hoặc sau khi đăng nhập/đăng xuất, hiển thị HOME
        return (
            <Home
                currentUser={currentUser}
                onSwitchToLogin={() => setCurrentPage(PAGE.LOGIN)}
                onSwitchToRegister={() => setCurrentPage(PAGE.REGISTER)}
                onLogout={handleLogout}
            />
        );
    };

    return (
        <div className="App">
            {renderPage()}
        </div>
    );
}

// Đảm bảo không có object styles ở đây nữa.

export default App;