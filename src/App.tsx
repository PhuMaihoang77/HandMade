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
import Checkout from './Pages/Checkout';
import About from './Pages/About';
import Chatbox from './Pages/Chatbox';

import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';

// =======================
// 4. CONTEXT / TYPES / STYLES
// =======================
import { CartProvider } from './context/CartContext';
import { User } from './types/model';
import './Styles/global.css';
import Cart from './Pages/Cart';
import OrderHistory from "./Pages/OrderHistory";
import { OrderProvider } from './context/OrderContext';
import ChatWidget from "./Pages/ChatWidget";
import './Styles/global.css';


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
              <ChatWidget currentUser={currentUser} />
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

    // =======================
    // 7. ROUTES
    // =======================
    return (

        <OrderProvider>
        <CartProvider currentUser={currentUser}>
        <div className="App">
            <Routes>
                {/* ===== AUTH ROUTES ===== */}
                <Route
                    path="/login"
                    element={
                        currentUser ? (
                            <Navigate to="/" />
                        ) : (
                            <div className="auth-page-wrapper">
                                <Login
                                    onLoginSuccess={handleLoginSuccess}
                                    onSwitchToRegister={() => navigate('/register')}
                                    onSwitchToForgot={() => navigate('/forgot-password')}
                                    onClose={() => navigate('/')}
                                />
                            </div>
                        )
                    }
                />

                <Route
                    path="/register"
                    element={
                        <div className="auth-page-wrapper">
                            <Register
                                onSwitchToLogin={() => navigate('/login')}
                                onClose={() => navigate('/')}
                            />
                        </div>
                    }
                />

                <Route
                    path="/forgot-password"
                    element={
                        <div className="auth-page-wrapper">
                            <ForgotPassword
                                onSwitchToLogin={() => navigate('/login')}
                                onClose={() => navigate('/')}
                            />
                        </div>
                    }
                />

                {/* ===== MAIN ROUTES ===== */}
                <Route
                    path="/"
                    element={
                        <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                            <Home currentUser={currentUser} />
                        </MainLayout>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                            <Product currentUser={currentUser} />
                        </MainLayout>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                            <Profile currentUser={currentUser} onLogout={handleLogout} />
                        </MainLayout>
                    }
                />
                <Route
                    path="/chat"
                     element={
                        <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                            <Chatbox currentUser={currentUser} />
                        </MainLayout>
                    }
                />
                 <Route
                    path="/about"
                    element={
                        <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                        <About currentUser={currentUser} />
                        </MainLayout>
                    }
                />

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
                <Route path="/cart" element={
                    <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                        <Cart />
                    </MainLayout>
                }/>
                <Route path="/orders" element={
                    <MainLayout currentUser={currentUser} onLogout={handleLogout}>
                        <OrderHistory />
                    </MainLayout>
                } />
                {/* Route 404: Nếu nhập linh tinh thì về Home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
        </CartProvider>
        </OrderProvider>
    );
}

export default App;
