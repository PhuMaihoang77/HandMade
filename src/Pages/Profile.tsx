import React, { useMemo, useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Đảm bảo đã import api
import { User } from '../types/model';
import { updateUserEmail, updateUserPassword } from '../services/AuthService';
import '../Styles/profile.css';
import OrderHistory from './OrderHistory';
import { filterVouchersForUser } from '../untils/voucherUtils';

interface ProfileProps {
    currentUser: User | null;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<'info' | 'email' | 'password' | 'orders' | 'vouchers'>('info');

    const [emailValue, setEmailValue] = useState(currentUser?.email ?? '');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);

    const [myVouchers, setMyVouchers] = useState<any[]>([]);
    
    const [passwordValue, setPasswordValue] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const emailChanged = useMemo(() => {
        const currentEmail = currentUser?.email ?? '';
        return emailValue.trim() !== currentEmail;
    }, [emailValue, currentUser?.email]);

    // 1. Tải Voucher cá nhân hóa
    useEffect(() => {
        const loadMyVouchers = async () => {
            if (activeSection === 'vouchers' && currentUser) {
                try {
                    const [vouchersRes, ordersRes] = await Promise.all([
                        api.get('/voucher'),
                        api.get(`/orders?userId=${currentUser.id}`)
                    ]);
                    // Giả định giá trị đơn hàng lớn (999.999.999) để hiện tất cả voucher user đủ điều kiện sở hữu
                    const filtered = filterVouchersForUser(vouchersRes.data, ordersRes.data, 999999999);
                    setMyVouchers(filtered);
                } catch (err) {
                    console.error("Lỗi tải voucher cá nhân:", err);
                }
            }
        };
        loadMyVouchers();
    }, [activeSection, currentUser]);

    if (!currentUser) return <Navigate to="/login" replace />;

    const initial = currentUser.username?.charAt(0).toUpperCase() || '?';

    // 2. Cập nhật Email
    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailMessage('');
        setEmailError('');
        const trimmed = emailValue.trim();
        if (!trimmed || !trimmed.includes('@')) { setEmailError('Email không hợp lệ.'); return; }
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

    // 3. Đổi mật khẩu
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage('');
        setPasswordError('');
        if (passwordValue.length < 6) { setPasswordError('Mật khẩu tối thiểu 6 ký tự.'); return; }
        if (passwordValue !== passwordConfirm) { setPasswordError('Mật khẩu không khớp.'); return; }

        try {
            setPasswordLoading(true);
            await updateUserPassword(currentUser.id, passwordValue);
            setPasswordMessage('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
            setTimeout(() => onLogout(), 1000);
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
                {/* Menu SideBar */}
                <div className="profile-menu">
                    <div className={`menu-item ${activeSection === 'info' ? 'active' : ''}`} onClick={() => setActiveSection('info')}>
                        <i className="fa-solid fa-user-gear"></i> Thông tin tài khoản
                    </div>
                    <div className={`menu-item ${activeSection === 'orders' ? 'active' : ''}`} onClick={() => setActiveSection('orders')}>
                        <i className="fa-solid fa-clock-rotate-left"></i> Lịch sử mua hàng
                    </div>
                    <div className={`menu-item ${activeSection === 'vouchers' ? 'active' : ''}`} onClick={() => setActiveSection('vouchers')}>
                        <i className="fa-solid fa-ticket"></i> Voucher của tôi
                    </div>
                    <Link to="/wishlist" className="menu-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <i className="fa-solid fa-heart"></i> Sản phẩm yêu thích
                    </Link>
                    <div className={`menu-item ${activeSection === 'email' ? 'active' : ''}`} onClick={() => setActiveSection('email')}>
                        <i className="fa-solid fa-envelope"></i> Thay đổi email
                    </div>
                    <div className={`menu-item ${activeSection === 'password' ? 'active' : ''}`} onClick={() => setActiveSection('password')}>
                        <i className="fa-solid fa-shield-halved"></i> Bảo mật mật khẩu
                    </div>
                    <div className="menu-item logout-item" onClick={onLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                    </div>
                </div>

                {/* Content Area */}
                <div className="profile-content">
                    {activeSection === 'info' && (
                        <section className="profile-card">
                            <h3 className="section-title">Thông tin cơ bản</h3>
                            <div className="info-row"><span>Tên hiển thị</span><strong>{currentUser.username}</strong></div>
                            <div className="info-row"><span>Email hiện tại</span><strong>{currentUser.email}</strong></div>
                            <div className="info-row"><span>Mã người dùng</span><strong>#{currentUser.id}</strong></div>
                        </section>
                    )}

                    {activeSection === 'vouchers' && (
                        <section className="profile-card">
                            <h3 className="section-title">Voucher của bạn</h3>
                            <div className="my-vouchers-list">
                                {myVouchers.length > 0 ? myVouchers.map(v => (
                                    <div key={v.id} className="my-voucher-item">
                                        <div className="v-left">
                                            <span className="v-code">{v.code}</span>
                                        </div>
                                        <div className="v-right">
                                            <h4 className="v-title">{v.title}</h4>
                                            <p className="v-desc">{v.description}</p>
                                            <div className="v-footer">
                                                <span>HSD: {new Date(v.expiredAt).toLocaleDateString('vi-VN')}</span>
                                                <button onClick={() => navigate('/products')} className="btn-use-now">Dùng ngay</button>
                                            </div>
                                        </div>
                                    </div>
                                )) : <p>Bạn chưa có voucher nào khả dụng.</p>}
                            </div>
                        </section>
                    )}

                    {activeSection === 'orders' && (
                        <div className="profile-card">
                            <h3 className="section-title">Lịch sử đơn hàng</h3>
                            <OrderHistory currentUser={currentUser} />
                        </div>
                    )}

                    {activeSection === 'email' && (
                        <section className="profile-card">
                            <h3 className="section-title">Cập nhật Email</h3>
                            <form className="profile-form" onSubmit={handleUpdateEmail}>
                                <div className="form-group">
                                    <label>Email mới</label>
                                    <input type="email" value={emailValue} onChange={e => setEmailValue(e.target.value)} />
                                </div>
                                {emailError && <p className="form-error">{emailError}</p>}
                                {emailMessage && <p className="form-success">{emailMessage}</p>}
                                <button type="submit" className="btn-submit" disabled={emailLoading}>Lưu email</button>
                            </form>
                        </section>
                    )}

                    {activeSection === 'password' && (
                        <section className="profile-card">
                            <h3 className="section-title">Đổi mật khẩu</h3>
                            <form className="profile-form" onSubmit={handleUpdatePassword}>
                                <div className="form-group">
                                    <label>Mật khẩu mới</label>
                                    <input type="password" value={passwordValue} onChange={e => setPasswordValue(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Xác nhận mật khẩu</label>
                                    <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />
                                </div>
                                {passwordError && <p className="form-error">{passwordError}</p>}
                                {passwordMessage && <p className="form-success">{passwordMessage}</p>}
                                <button type="submit" className="btn-submit" disabled={passwordLoading}>Lưu mật khẩu</button>
                            </form>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;