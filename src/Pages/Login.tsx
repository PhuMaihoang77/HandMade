// src/components/Login.tsx
import React, { useState } from 'react';
import { loginUser } from '../services/AuthService';

import { User } from '../App'; // Import kiểu User
import '../Styles/auth.css';

// Khai báo kiểu cho Props (Đã bỏ prop 'styles')
interface LoginProps {
    onLoginSuccess: (user: User) => void;
    onSwitchToRegister: () => void;
    onSwitchToForgot: () => void;
    onClose: () => void;
    
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister, onSwitchToForgot,onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Khai báo kiểu cho tham số sự kiện (e)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const user: User = await loginUser(email, password);
            localStorage.setItem('user', JSON.stringify(user));
            onLoginSuccess(user);
        } catch (err) {
            // Ép kiểu cho lỗi
            setError((err as Error).message || 'Đăng nhập không thành công.');
        }
    };

    return (
        <div className="auth-container">
            <button className="auth-close-button" onClick={onClose}>
                &times; 
            </button>
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="auth-error">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input" // ⭐ Dùng className
                />

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input" // ⭐ Dùng className
                />

                <button type="submit" className="auth-button">Đăng Nhập</button>
            </form>

            <p className="auth-switch-text">
                <a href="#" onClick={onSwitchToForgot} className="auth-link">Quên Mật khẩu?</a>
            </p>
            <p className="auth-switch-text">
                Chưa có tài khoản? <a href="#" onClick={onSwitchToRegister} className="auth-link">Đăng ký ngay</a>
            </p>
        </div>
    );
};

export default Login;