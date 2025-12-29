import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { User } from '../types/model';
import { updateUserEmail, updateUserPassword } from '../services/AuthService';
import '../Styles/profile.css';
import OrderHistory from './OrderHistory';

interface ProfileProps {
    currentUser: User | null;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<'info' | 'email' | 'password'|'orders'>('info');

    const [emailValue, setEmailValue] = useState(currentUser?.email ?? '');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);

    const [passwordValue, setPasswordValue] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const emailChanged = useMemo(() => {
        const currentEmail = currentUser?.email ?? '';
        return emailValue.trim() !== currentEmail;
    }, [emailValue, currentUser?.email]);

    if (!currentUser) return <Navigate to="/login" replace />;

    const initial = currentUser.username?.charAt(0).toUpperCase() || '?';

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailMessage('');
        setEmailError('');

        const trimmed = emailValue.trim();
        if (!trimmed) { setEmailError('Email không được để trống.'); return; }
        if (!trimmed.includes('@')) { setEmailError('Email không hợp lệ.'); return; }
        if (!emailChanged) { setEmailError('Bạn chưa thay đổi email.'); return; }

        try {
            setEmailLoading(true);
            const updated = await updateUserEmail(currentUser.id, trimmed);
            localStorage.setItem('user', JSON.stringify(updated));
            setEmailMessage('Cập nhật email thành công. Trang sẽ tải lại.');
            setTimeout(() => window.location.reload(), 800);
        } catch (err) {
            setEmailError((err as Error).message || 'Không thể cập nhật email.');
        } finally { setEmailLoading(false); }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage('');
        setPasswordError('');

        if (passwordValue.length < 6) { setPasswordError('Mật khẩu phải tối thiểu 6 ký tự.'); return; }
        if (passwordValue !== passwordConfirm) { setPasswordError('Mật khẩu nhập lại không khớp.'); return; }

        try {
            setPasswordLoading(true);
            await updateUserPassword(currentUser.id, passwordValue);
            setPasswordMessage('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
            setPasswordValue('');
            setPasswordConfirm('');
            setTimeout(() => onLogout(), 800); // Logout sau khi đổi mật khẩu
        } catch (err) {
            setPasswordError((err as Error).message || 'Không thể đổi mật khẩu.');
        } finally { setPasswordLoading(false); }
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

            <div className="profile-container">
                {/* Menu trái */}
                <div className="profile-menu">
                    <div className={`menu-item ${activeSection==='info'?'active':''}`} onClick={() => setActiveSection('info')}>Thông tin tài khoản</div>
                    <div className={`menu-item ${activeSection==='email'?'active':''}`} onClick={() => setActiveSection('email')}>Đổi email</div>
                    <div className={`menu-item ${activeSection==='password'?'active':''}`} onClick={() => setActiveSection('password')}>Đổi mật khẩu</div>
                    <div className={`menu-item ${activeSection==='orders'?'active':''}`} onClick={() => setActiveSection('orders')}>Lịch sử mua hàng</div>
                </div>

                {/* Nội dung phải */}
                <div className="profile-content">
                    {activeSection==='info' && (
                        <section className="profile-card">
                            <div className="info-row"><span>Tên hiển thị</span><strong>{currentUser.username}</strong></div>
                            <div className="info-row"><span>Email</span><strong>{currentUser.email}</strong></div>
                            <div className="info-row"><span>Mã người dùng</span><strong>#{currentUser.id}</strong></div>
                        </section>
                    )}

                    {activeSection==='email' && (
                        <section className="profile-card">
                            <form className="profile-form" onSubmit={handleUpdateEmail}>
                                <div className="form-group">
                                    <label>Email mới</label>
                                    <input type="email" value={emailValue} onChange={e=>setEmailValue(e.target.value)} placeholder="email@domain.com" />
                                </div>
                                {emailError && <p className="form-error">{emailError}</p>}
                                {emailMessage && <p className="form-success">{emailMessage}</p>}
                                <div className="form-actions">
                                    <button type="button" onClick={()=>setEmailValue(currentUser.email)}>Đặt lại</button>
                                    <button type="submit">{emailLoading?'Đang lưu...':'Lưu email'}</button>
                                </div>
                            </form>
                        </section>
                    )}

                    {activeSection==='password' && (
                        <section className="profile-card">
                            <form className="profile-form" onSubmit={handleUpdatePassword}>
                                <div className="form-group">
                                    <label>Mật khẩu mới</label>
                                    <input type="password" value={passwordValue} onChange={e=>setPasswordValue(e.target.value)} placeholder="Tối thiểu 6 ký tự" />
                                </div>
                                <div className="form-group">
                                    <label>Nhập lại mật khẩu</label>
                                    <input type="password" value={passwordConfirm} onChange={e=>setPasswordConfirm(e.target.value)} placeholder="Nhập lại để xác nhận" />
                                </div>
                                {passwordError && <p className="form-error">{passwordError}</p>}
                                {passwordMessage && <p className="form-success">{passwordMessage}</p>}
                                <div className="form-actions">
                                    <button type="button" onClick={()=>{setPasswordValue('');setPasswordConfirm('')}}>Xóa nhập</button>
                                    <button type="submit">{passwordLoading?'Đang lưu...':'Lưu mật khẩu'}</button>
                                </div>
                            </form>
                        </section>
                    )}
                    {activeSection === 'orders' && (
                        <div className="profile-card">
                            <OrderHistory currentUser={currentUser}/>
                        </div>
                    )}
                    {/* Logout */}
                    <div className="logout-section">
                        <button className="btn-logout" onClick={onLogout}>Đăng Xuất</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
