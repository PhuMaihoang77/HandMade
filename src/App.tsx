// =======================
// 1. IMPORT LIBRARIES
// =======================
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

// =======================
// 2. IMPORT COMPONENTS (LAYOUT)
// =======================
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// =======================
// 3. IMPORT PAGES
// =======================
import Home from './Pages/Home';
import Product from './Pages/Product';
import ProductDetail from './Pages/ProductDetail';
import Profile from './Pages/Profile';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import Checkout from "./Pages/Checkout";
import Cart from './Pages/Cart';
import OrderHistory from "./Pages/OrderHistory";

// =======================
// 4. CONTEXT / TYPES / STYLES
// =======================
import { User } from './types/model';
import './Styles/global.css';
import {CartProvider} from "./context/CartContext";

// =======================
// 5. MAIN LAYOUT
// =======================
const MainLayout = ({
                        children,
                        currentUser,
                        onLogout,
                    }: {
    children: React.ReactNode;
    currentUser: User | null;
    onLogout: () => void;
}) => {
    return (
        <>
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main style={{ minHeight: '80vh', paddingTop: '20px' }}>
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </>
    );
};

// =======================
// 6. APP COMPONENT
// =======================
function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // ----- USER STATE -----
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // ----- AUTH HANDLERS -----
    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/login');
    };

    // ----- SCROLL TO TOP -----
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <CartProvider currentUser={currentUser}>
                <div className="App">
                    <Routes>
                        {/* ===== AUTH ROUTES ===== */}
                        <Route path="/login" element={
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

                        {/* ===== MAIN ROUTES ===== */}
                        <Route path="/" element={
                            <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                                <Home currentUser={currentUser} />
                            </MainLayout>
                        } />

                        <Route path="/profile" element={
                            <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                                {/* FIX LỖI TS2741: TRUYỀN THÊM onLogout VÀO ĐÂY */}
                                <Profile currentUser={currentUser} onLogout={handleLogout} />
                            </MainLayout>
                        } />

                        <Route path="/product/:id" element={
                            <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                                <ProductDetail currentUser={currentUser}/>
                            </MainLayout>
                        } />

                        <Route path="/checkout" element={
                            <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                                <Checkout currentUser={currentUser}/>
                            </MainLayout>
                        } />

                        <Route path="/cart" element={
                            <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                                <Cart currentUser={currentUser}/>
                            </MainLayout>
                        }/>

                        <Route path="/orders" element={
                            <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                                <OrderHistory currentUser={currentUser}/>
                            </MainLayout>
                        } />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
        </CartProvider>
    );
}

export default App;