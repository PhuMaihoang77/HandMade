// src/components/ForgotPassword.tsx
import React, { useState } from 'react';
import { forgotPassword } from '../services/AuthService';

// Khai báo kiểu cho Props (Đã bỏ prop 'styles')
interface ForgotPasswordProps {
    onSwitchToLogin: () => void;
}

// Bỏ tham số 'styles'
const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Khai báo kiểu cho tham số sự kiện (e)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await forgotPassword(email);
            setMessage(`Yêu cầu đã được gửi. Vui lòng kiểm tra hộp thư của ${email}.`);
            setEmail('');
        } catch (err) {
            setError((err as Error).message || 'Đã xảy ra lỗi trong quá trình xử lý.');
        }
    };

    return (
        // ⭐ Dùng className
        <div className="auth-container">
            <h2>Quên Mật khẩu</h2>
            <p>Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-message">{message}</p>}

                <input type="email" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
                <button type="submit" className="auth-button">Gửi Yêu Cầu</button>
            </form>

            <p className="auth-switch-text">
                <a href="#" onClick={onSwitchToLogin} className="auth-link">Quay lại Đăng nhập</a>
            </p>
        </div>
    );
};

export default ForgotPassword;