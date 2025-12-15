import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { User } from '../types/model';
import { updateUserEmail, updateUserPassword } from '../services/AuthService';
import '../Styles/profile.css';

interface ProfileProps {
    currentUser: User | null;
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
    const navigate = useNavigate();
    const [emailValue, setEmailValue] = useState(currentUser?.email ?? '');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);

    const [passwordValue, setPasswordValue] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const emailChanged = useMemo(
        () => {
            const currentEmail = currentUser?.email ?? '';
            return emailValue.trim() !== currentEmail;
        },
        [emailValue, currentUser?.email]
    );

    if (!currentUser) {
        // Nếu không có người dùng hiện tại, chuyển hướng về trang đăng nhập
        return <Navigate to="/login" replace />;
    }
    
    // Lấy chữ cái đầu tiên của username làm avatar placeholder
    const initial = currentUser.username?.charAt(0)?.toUpperCase() || '?';

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailMessage('');
        setEmailError('');

        const trimmed = emailValue.trim();
        if (!trimmed) {
            setEmailError('Email không được để trống.');
            return;
        }
        if (!trimmed.includes('@')) {
            setEmailError('Email không hợp lệ.');
            return;
        }
        if (!emailChanged) {
            setEmailError('Bạn chưa thay đổi email.');
            return;
        }

        try {
            setEmailLoading(true);
            const updated = await updateUserEmail(currentUser.id, trimmed);
            localStorage.setItem('user', JSON.stringify(updated));
            setEmailMessage('Cập nhật email thành công. Trang sẽ tải lại để đồng bộ.');
            setTimeout(() => window.location.reload(), 800);
        } catch (err) {
            setEmailError((err as Error).message || 'Không thể cập nhật email.');
        } finally {
            setEmailLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage('');
        setPasswordError('');

        if (passwordValue.length < 6) {
            setPasswordError('Mật khẩu phải tối thiểu 6 ký tự.');
            return;
        }
        if (passwordValue !== passwordConfirm) {
            setPasswordError('Mật khẩu nhập lại không khớp.');
            return;
        }

        try {
            setPasswordLoading(true);
            await updateUserPassword(currentUser.id, passwordValue);
            setPasswordMessage('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
            setPasswordValue('');
            setPasswordConfirm('');
            setTimeout(() => navigate('/login'), 800);
        } catch (err) {
            setPasswordError((err as Error).message || 'Không thể đổi mật khẩu.');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div>
                    <p className="profile-subtitle">Trang cá nhân</p>
                    <h2 className="profile-title">Xin chào, {currentUser.username}</h2>
                    <p className="profile-desc">Quản lý thông tin và bảo mật tài khoản của bạn.</p>
                </div>
                <div className="profile-avatar">{initial}</div>
            </div>

            <div className="profile-grid">
                {/* 1. THÔNG TIN TÀI KHOẢN (Đã có) */}
                <section className="profile-card">
                    <div className="profile-card-head">
                        <h3>Thông tin tài khoản</h3>
                        <span className="status-chip">Đã xác thực</span>
                    </div>
                    <div className="info-row">
                        <span>Tên hiển thị</span>
                        <strong>{currentUser.username}</strong>
                    </div>
                    <div className="info-row">
                        <span>Email</span>
                        <strong>{currentUser.email}</strong>
                    </div>
                    <div className="info-row">
                        <span>Mã người dùng</span>
                        <strong>#{currentUser.id}</strong>
                    </div>
                </section>
                
                {/* 2. ĐỔI EMAIL */}
                <section className="profile-card security-card">
                    <div className="profile-card-head">
                        <h3>Đổi email</h3>
                        <span className="status-chip">Bảo mật</span>
                    </div>
                    <form className="profile-form" onSubmit={handleUpdateEmail}>
                        <div className="form-group">
                            <label className="form-label">Email mới</label>
                            <input
                                className="form-input"
                                type="email"
                                value={emailValue}
                                onChange={(e) => setEmailValue(e.target.value)}
                                placeholder="email@domain.com"
                            />
                            <p className="form-helper">Email hiện tại: {currentUser.email}</p>
                        </div>
                        {emailError && <p className="form-error">{emailError}</p>}
                        {emailMessage && <p className="form-success">{emailMessage}</p>}
                        <div className="form-actions">
                            <button
                                className="btn-secondary"
                                type="button"
                                onClick={() => setEmailValue(currentUser.email)}
                                disabled={emailLoading}
                            >
                                Đặt lại
                            </button>
                            <button className="btn-primary" type="submit" disabled={emailLoading}>
                                {emailLoading ? 'Đang lưu...' : 'Lưu email'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* 3. ĐỔI MẬT KHẨU */}
                <section className="profile-card security-card">
                    <div className="profile-card-head">
                        <h3>Đổi mật khẩu</h3>
                        <span className="status-chip warning">Khuyến nghị</span>
                    </div>
                    <form className="profile-form" onSubmit={handleUpdatePassword}>
                        <div className="form-group">
                            <label className="form-label">Mật khẩu mới</label>
                            <input
                                className="form-input"
                                type="password"
                                value={passwordValue}
                                onChange={(e) => setPasswordValue(e.target.value)}
                                placeholder="Tối thiểu 6 ký tự"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nhập lại mật khẩu</label>
                            <input
                                className="form-input"
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="Nhập lại để xác nhận"
                            />
                        </div>
                        {passwordError && <p className="form-error">{passwordError}</p>}
                        {passwordMessage && <p className="form-success">{passwordMessage}</p>}
                        <div className="form-actions">
                            <button
                                className="btn-secondary"
                                type="button"
                                onClick={() => { setPasswordValue(''); setPasswordConfirm(''); }}
                                disabled={passwordLoading}
                            >
                                Xóa nhập
                            </button>
                            <button className="btn-primary" type="submit" disabled={passwordLoading}>
                                {passwordLoading ? 'Đang lưu...' : 'Lưu mật khẩu'}
                            </button>
                        </div>
                    </form>
                </section>

            </div>
        </div>
    );
};

export default Profile;