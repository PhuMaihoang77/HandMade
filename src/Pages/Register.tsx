import React, { useState, useEffect } from 'react';
import { registerUser } from '../services/AuthService';
import '../Styles/auth.css';

interface RegisterProps {
    onSwitchToLogin: () => void;
    onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // State cho CAPTCHA
    const [captchaCode, setCaptchaCode] = useState('');
    const [userCaptchaInput, setUserCaptchaInput] = useState('');
    const [captchaColor, setCaptchaColor] = useState('#000');

    // Hàm tạo mã ngẫu nhiên và màu sắc ngẫu nhiên
    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Tạo màu tối ngẫu nhiên để đảm bảo dễ đọc trên nền sáng
        const randomColor = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`;
        
        setCaptchaCode(result);
        setCaptchaColor(randomColor);
        setUserCaptchaInput(''); 
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Kiểm tra CAPTCHA (so sánh chính xác từng ký tự)
        if (userCaptchaInput !== captchaCode) {
            setError('Mã xác nhận không chính xác. Vui lòng thử lại.');
            generateCaptcha();
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        try {
            await registerUser({ email, password, username });
            setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
            setEmail(''); setPassword(''); setUsername('');
            generateCaptcha();
        } catch (err) {
            setError((err as Error).message || 'Đăng ký không thành công.');
            generateCaptcha();
        }
    };

    return (
        <div className="auth-container">
            <button className="auth-close-button" onClick={onClose} aria-label="Close">
                &times; 
            </button>
            <h2>Đăng Ký Tài Khoản</h2>
            
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-message">{message}</p>}

                <input type="text" placeholder="Tên người dùng" value={username} onChange={(e) => setUsername(e.target.value)} required className="auth-input" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
                <input type="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} required className="auth-input" />

                {/* Phần CAPTCHA */}
                <div className="captcha-section">
                    <label className="captcha-label">Mã xác nhận (Click vào mã để đổi):</label>
                    <div 
                        className="captcha-display" 
                        onClick={generateCaptcha}
                        style={{ color: captchaColor }}
                        title="Đổi mã khác"
                    >
                        {captchaCode}
                    </div>
                    <input 
                        type="text" 
                        placeholder="Nhập mã xác nhận" 
                        value={userCaptchaInput} 
                        onChange={(e) => setUserCaptchaInput(e.target.value)} 
                        required 
                        className="auth-input captcha-input" 
                    />
                </div>

                <button type="submit" className="auth-button">Đăng Ký</button>
            </form>

            <p className="auth-switch-text">
                Đã có tài khoản? <span onClick={onSwitchToLogin} className="auth-link">Đăng nhập</span>
            </p>
        </div>
    );
};

export default Register;