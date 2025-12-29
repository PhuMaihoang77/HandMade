import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Product, User } from '../types/model';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaTrashAlt, FaHeart, FaCheckSquare, FaRegSquare, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import '../Styles/Wishlist.css';

const Wishlist: React.FC = () => {
    const navigate = useNavigate();
    const {addToCart } = useCart();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'info' }>({ show: false, msg: '', type: 'success' });

    // Hàm thông báo thay thế Alert
    const triggerNotification = (msg: string, type: 'success' | 'info' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 2500);
    };

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setCurrentUser(user);
            setWishlist(user.wishlist || []);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const syncDatabase = async (newList: Product[]) => {
        if (!currentUser) return;
        try {
            await axios.patch(`http://localhost:5000/users/${currentUser.id}`, { wishlist: newList });
            const updatedUser = { ...currentUser, wishlist: newList };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setWishlist(newList);
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch (error) {
            triggerNotification("Không thể kết nối máy chủ!", "info");
        }
    };

    const handleBulkAdd = () => {
        const itemsToMove = wishlist.filter(p => selectedIds.includes(p.id));
        if (itemsToMove.length === 0) return;
        
        itemsToMove.forEach(p => p.inventory > 0 && addToCart(p, currentUser));
        triggerNotification(`Đã thêm ${itemsToMove.length} sản phẩm vào giỏ hàng!`);
        setSelectedIds([]);
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        const newList = wishlist.filter(p => !selectedIds.includes(p.id));
        syncDatabase(newList);
        setSelectedIds([]);
        triggerNotification("Đã xóa các mục đã chọn", "info");
    };

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h2>Sản phẩm yêu thích</h2>
            </div>

            {wishlist.length > 0 ? (
                <>
                    <div className="wishlist-bulk-actions">
                        <div className="select-all-wrapper" onClick={() => setSelectedIds(selectedIds.length === wishlist.length ? [] : wishlist.map(p => p.id))}>
                            {React.createElement((selectedIds.length === wishlist.length ? FaCheckSquare : FaRegSquare) as any, {
                                color: selectedIds.length === wishlist.length ? "#28a745" : "#ccc", size: 22
                            })}
                            <span>Chọn tất cả ({selectedIds.length})</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn-ui" style={{ color: '#ff4757', background: '#fff0f0' }} onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
                                {React.createElement(FaTrashAlt as any)} Xóa mục chọn
                            </button>
                            <button className="btn-ui btn-ui-buy" onClick={handleBulkAdd} disabled={selectedIds.length === 0}>
                                {React.createElement(FaShoppingCart as any)} Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>

                    <div className="wishlist-grid">
                        {wishlist.map(item => (
                            <div key={item.id} className="wishlist-card">
                                <div className="card-checkbox" onClick={() => setSelectedIds(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}>
                                    {React.createElement((selectedIds.includes(item.id) ? FaCheckSquare : FaRegSquare) as any, {
                                        color: selectedIds.includes(item.id) ? "#28a745" : "#ddd", size: 24
                                    })}
                                </div>
                                <div className="card-image-wrapper">
                                    <img src={item.imageUrl} alt={item.name} />
                                    <div className="btn-remove-single" onClick={() => syncDatabase(wishlist.filter(p => p.id !== item.id))}>
                                        {React.createElement(FaTrashAlt as any, { size: 16 })}
                                    </div>
                                </div>
                                <div className="card-content">
                                    <h4>{item.name}</h4>
                                    <p className="card-price">{item.price.toLocaleString()} VNĐ</p>
                                    <div className="card-btns">
                                        <button className="btn-ui btn-ui-view" onClick={() => navigate(`/product/${item.id}`)}>Chi tiết</button>
                                        <button className="btn-ui btn-ui-buy" onClick={() => { addToCart(item, currentUser); triggerNotification("Đã thêm vào giỏ hàng!"); }}>
                                            + Giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="wishlist-empty">
                    {React.createElement(FaHeart as any, { size: 80, color: '#f1f2f6' })}
                    <h3 style={{marginTop: '20px', color: '#2f3542'}}>Danh sách yêu thích trống</h3>
                    <button className="btn-ui btn-ui-buy" style={{marginTop: '20px', padding: '12px 30px'}} onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
                </div>
            )}

            {/* Hệ thống Toast UI */}
            {toast.show && (
                <div className="toast-box">
                    {React.createElement((toast.type === 'success' ? FaCheckCircle : FaInfoCircle) as any, { 
                        color: toast.type === 'success' ? '#2ed573' : '#eccc68', size: 20 
                    })}
                    <span>{toast.msg}</span>
                </div>
            )}
        </div>
    );
};

export default Wishlist;