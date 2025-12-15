import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import Home from './Pages/Home';
import ProductDetail from './Pages/ProductDetail';
import { User } from './types/model';

import './Styles/global.css';
import Checkout from "./Pages/Checkout";
import { CartProvider } from './context/CartContext';
import Cart from './Pages/Cart';

// 2. LAYOUT COMPONENT (Giúp ẩn/hiện Header, Footer dễ dàng)
// Những trang nào cần Header/Footer thì bọc trong cái này
const MainLayout = ({ children, currentUser, onLogout }: { children: React.ReactNode, currentUser: User | null, onLogout: () => void }) => {
    return (
        <CartProvider>
        <>
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main style={{ minHeight: '80vh', paddingTop: '20px' }}>
                {children}
            </main>
            <Footer />
            <Cart />
        </>
        </CartProvider>
    );
};

function App() {
    const navigate = useNavigate(); // Dùng hook điều hướng
    const location = useLocation(); // Lấy vị trí hiện tại

    // 3. STATE USER (Giữ nguyên logic cũ của bạn)
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) as User : null;
    });

    // 4. XỬ LÝ LOGIN / LOGOUT
    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/'); // Chuyển hướng về trang chủ sau khi login
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/login'); // Chuyển hướng về login sau khi logout
    };

    // Tự động cuộn lên đầu trang khi chuyển route
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (

        <div className="App">
            <Routes>
                {/* --- ROUTE CHO AUTH (KHÔNG CÓ HEADER/FOOTER) --- */}
                
                <Route path="/login" element={
                    // Nếu đã đăng nhập thì đá về Home, chưa thì hiện Login
                    currentUser ? <Navigate to="/" /> : (
                        <div className="auth-page-wrapper">
                            <Login 
                                onLoginSuccess={handleLoginSuccess}
                                onSwitchToRegister={() => navigate('/register')}
                                onSwitchToForgot={() => navigate('/forgot-password')}
                                onClose={() => navigate('/')}
                            />
                        </div>
                    )
                } />

                <Route path="/register" element={
                    <div className="auth-page-wrapper">
                        <Register 
                            onSwitchToLogin={() => navigate('/login')}
                            onClose={() => navigate('/')}
                        />
                    </div>
                } />

                <Route path="/forgot-password" element={
                    <div className="auth-page-wrapper">
                        <ForgotPassword 
                            onSwitchToLogin={() => navigate('/login')}
                            onClose={() => navigate('/')}
                        />
                    </div>
                } />

                {/* --- ROUTE CHÍNH (CÓ HEADER/FOOTER) --- */}
                
                <Route path="/" element={
                    <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                        <Home currentUser={currentUser} />
                    </MainLayout>
                } />

                {/* Route động: /product/1, /product/2 */}
                <Route path="/product/:id" element={
                    <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                        <ProductDetail />
                    </MainLayout>
                } />
                <Route path="/checkout" element={
                    <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                        <Checkout />
                    </MainLayout>
                } />
                {/* Route 404: Nếu nhập linh tinh thì về Home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>

    );
}

export default App;