// src/components/Register.tsx
import React, { useState } from 'react';
import { registerUser } from '../services/AuthService';

// Khai báo kiểu cho Props (Đã bỏ prop 'styles')
interface RegisterProps {
    onSwitchToLogin: () => void;
}

// Bỏ tham số 'styles'
const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Khai báo kiểu cho tham số sự kiện (e)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        try {
            await registerUser({ email, password, username });
            setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
            setEmail(''); setPassword(''); setUsername('');
        } catch (err) {
            setError((err as Error).message || 'Đăng ký không thành công.');
        }
    };

    return (
        // ⭐ Dùng className
        <div className="auth-container">
            <h2>Đăng Ký Tài Khoản</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-message">{message}</p>}

                <input type="text" placeholder="Tên người dùng" value={username} onChange={(e) => setUsername(e.target.value)} required className="auth-input" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
                <input type="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} required className="auth-input" />

                <button type="submit" className="auth-button">Đăng Ký</button>
            </form>

            <p className="auth-switch-text">
                Đã có tài khoản? <a href="#" onClick={onSwitchToLogin} className="auth-link">Đăng nhập</a>
            </p>
        </div>
    );
};

export default Register;