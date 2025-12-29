import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { User } from '../types/model';
import { updateUserEmail, updateUserPassword } from '../services/AuthService';
import '../Styles/profile.css';

interface ProfileProps {
    currentUser: User | null;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    // Loại bỏ 'favorites' khỏi state này vì đã có trang riêng
    const [activeSection, setActiveSection] = useState<'info' | 'email' | 'password'>('info');

    // --- State cho Email ---
    const [emailValue, setEmailValue] = useState(currentUser?.email ?? '');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);

    // --- State cho Password ---
    const [passwordValue, setPasswordValue] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const emailChanged = useMemo(() => {
        return emailValue.trim() !== (currentUser?.email ?? '');
    }, [emailValue, currentUser?.email]);

    if (!currentUser) return <Navigate to="/login" replace />;

    const initial = currentUser.username?.charAt(0).toUpperCase() || '?';

    // --- Xử lý cập nhật Email ---
    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailMessage(''); setEmailError('');
        const trimmed = emailValue.trim();
        if (!trimmed || !trimmed.includes('@') || !emailChanged) {
            setEmailError('Vui lòng kiểm tra lại email.'); return;
        }
        try {
            setEmailLoading(true);
            const updated = await updateUserEmail(currentUser.id, trimmed);
            localStorage.setItem('user', JSON.stringify(updated));
            setEmailMessage('Cập nhật email thành công!');
            // Reload nhẹ để Header nhận email mới
            setTimeout(() => window.location.reload(), 800);
        } catch (err) { setEmailError('Lỗi cập nhật email.'); } 
        finally { setEmailLoading(false); }
    };

    // --- Xử lý đổi mật khẩu ---
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordValue.length < 6 || passwordValue !== passwordConfirm) {
            setPasswordError('Mật khẩu không khớp hoặc quá ngắn (tối thiểu 6 ký tự).'); return;
        }
        try {
            setPasswordLoading(true);
            await updateUserPassword(currentUser.id, passwordValue);
            setPasswordMessage('Đổi mật khẩu thành công. Hệ thống sẽ đăng xuất...');
            setTimeout(() => onLogout(), 1500);
        } catch (err) { setPasswordError('Lỗi đổi mật khẩu.'); }
        finally { setPasswordLoading(false); }
    };

    return (
        <div className="profile-page">
            {/* Header trang Profile */}
            <div className="profile-header">
                <div className="profile-header-info">
                    <p className="profile-subtitle">Tài khoản cá nhân</p>
                    <h2 className="profile-title">Xin chào, {currentUser.username}</h2>
                    <p className="profile-desc">Quản lý bảo mật thông tin và quyền truy cập của bạn.</p>
                </div>
                <div className="profile-avatar">{initial}</div>
            </div>

            <div className="profile-container">
                {/* Sidebar Menu */}
                <div className="profile-menu">
                    <div 
                        className={`menu-item ${activeSection === 'info' ? 'active' : ''}`} 
                        onClick={() => setActiveSection('info')}
                    >
                        <i className="fa-solid fa-user-gear"></i> Thông tin tài khoản
                    </div>

                    {/* Link dẫn sang trang Wishlist riêng */}
                    <Link to="/wishlist" className="menu-item" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <i className="fa-solid fa-heart"></i> Sản phẩm yêu thích
                    </Link>

                    <div 
                        className={`menu-item ${activeSection === 'email' ? 'active' : ''}`} 
                        onClick={() => setActiveSection('email')}
                    >
                        <i className="fa-solid fa-envelope"></i> Thay đổi email
                    </div>
                    <div 
                        className={`menu-item ${activeSection === 'password' ? 'active' : ''}`} 
                        onClick={() => setActiveSection('password')}
                    >
                        <i className="fa-solid fa-shield-halved"></i> Bảo mật mật khẩu
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="profile-content">
                    {/* SECTION 1: INFO */}
                    {activeSection === 'info' && (
                        <section className="profile-card fade-in">
                            <h3>Thông tin cơ bản</h3>
                            <div className="info-row"><span>Tên người dùng:</span><strong>{currentUser.username}</strong></div>
                            <div className="info-row"><span>Email đăng ký:</span><strong>{currentUser.email}</strong></div>
                            <div className="info-row"><span>Mã định danh (ID):</span><strong>#{currentUser.id}</strong></div>
                            <div className="info-row"><span>Trạng thái:</span><strong style={{color: 'green'}}>Đang hoạt động</strong></div>
                        </section>
                    )}

                    {/* SECTION 2: EMAIL */}
                    {activeSection === 'email' && (
                        <section className="profile-card fade-in">
                            <h3>Cập nhật Email</h3>
                            <form className="profile-form" onSubmit={handleUpdateEmail}>
                                <div className="form-group">
                                    <label>Địa chỉ Email mới</label>
                                    <input type="email" value={emailValue} onChange={e => setEmailValue(e.target.value)} />
                                </div>
                                {emailError && <p className="form-error"><i className="fa-solid fa-circle-exclamation"></i> {emailError}</p>}
                                {emailMessage && <p className="form-success"><i className="fa-solid fa-circle-check"></i> {emailMessage}</p>}
                                <button type="submit" className="btn-save" disabled={emailLoading || !emailChanged}>
                                    {emailLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </form>
                        </section>
                    )}

                    {/* SECTION 3: PASSWORD */}
                    {activeSection === 'password' && (
                        <section className="profile-card fade-in">
                            <h3>Thay đổi mật khẩu</h3>
                            <form className="profile-form" onSubmit={handleUpdatePassword}>
                                <div className="form-group">
                                    <label>Mật khẩu mới</label>
                                    <input type="password" placeholder="Nhập ít nhất 6 ký tự" value={passwordValue} onChange={e => setPasswordValue(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Xác nhận mật khẩu</label>
                                    <input type="password" placeholder="Nhập lại mật khẩu mới" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />
                                </div>
                                {passwordError && <p className="form-error"><i className="fa-solid fa-circle-exclamation"></i> {passwordError}</p>}
                                {passwordMessage && <p className="form-success"><i className="fa-solid fa-circle-check"></i> {passwordMessage}</p>}
                                <button type="submit" className="btn-save" disabled={passwordLoading}>
                                    {passwordLoading ? 'Đang thực hiện...' : 'Cập nhật mật khẩu'}
                                </button>
                            </form>
                        </section>
                    )}

                    <div className="logout-section" style={{ marginTop: '20px' }}>
                        <button className="btn-logout" onClick={onLogout}>
                            <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất tài khoản
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;