// src/pages/ProductDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import ProductPolicy from '../components/ProductPolicy';
import { useCart } from '../context/CartContext';
import * as Icons from 'react-icons/fa'; 
import '../Styles/productDetail.css';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    // Sử dụng hook đã nâng cấp
    const { product, loading, error, reviews, addReview } = useProductDetail(id);

    // State cho Form Review (Giữ lại state nội bộ của Form)
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    // Lấy user đang đăng nhập
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    // Fix Icons
    const FaStar = Icons.FaStar as any;
    const FaUserCircle = Icons.FaUserCircle as any;

    if (loading) return <div className="loading-spinner">Đang tải...</div>;
    if (error || !product) return <div className="error-msg">{error}</div>;

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return navigate('/login');
        if (rating === 0 || !comment.trim()) {
            alert('Vui lòng chọn sao và nhập nội dung.');
            return;
        }

        addReview({
            userName: currentUser.username,
            rating,
            comment: comment.trim(),
        }); // Gọi hàm từ hook (sẽ tự lưu vào reviews.json)
        setRating(0);
        setComment('');
    };

    return (
        <div className="product-page-container">
            <div className="product-detail">
                {/* BÊN TRÁI: ẢNH */}
                <div className="product-detail-image-wrapper">
                    <img className="product-detail-image" src={product.imageUrl} alt={product.name} />
                </div>

                {/* BÊN PHẢI: THÔNG TIN */}
                <div className="product-detail-info">
                    <h2 className="product-title">{product.name}</h2>
                    <p className="product-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                    
                    <ProductPolicy />

                    <div className="product-meta">
                        <p><strong>Danh mục:</strong> {product.category}</p>
                        <p><strong>Tình trạng:</strong> {product.inventory > 0 ? ' Còn hàng' : ' Hết hàng'}</p>
                    </div>

                    <div className="product-description">{product.description}</div>

                    <div className="product-actions">
                        <button className="btn-buy-now" onClick={() => navigate('/checkout')} disabled={product.inventory === 0}>Mua ngay</button>
                        <button className="btn-add-cart" onClick={() => addToCart(product)}>Thêm vào giỏ</button>
                    </div>
                </div>
            </div>

            {/* BÊN DƯỚI: ĐÁNH GIÁ */}
            <div className="product-review-section">
                <h3>Đánh giá từ khách hàng ({reviews.length})</h3>
                
                {currentUser ? (
                    <form className="review-form" onSubmit={handleSubmitReview}>
                        <div className="review-stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    className={(hoverRating || rating) >= star ? 'star-button active' : 'star-button'}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <FaStar />
                                </button>
                            ))}
                        </div>
                        <textarea 
                            className="review-textarea"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Cảm nhận của bạn..."
                        />
                        <button type="submit" className="btn-primary">Gửi đánh giá</button>
                    </form>
                ) : (
                    <div className="review-login-hint">Vui lòng đăng nhập để bình luận.</div>
                )}

                <div className="review-list">
                    {reviews.map(r => (
                        <div key={r.id} className="review-item">
                            <div className="review-header">
                                <span className="review-user"><FaUserCircle /> {r.userName}</span>
                                <span className="review-rating">
                                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                </span>
                            </div>
                            <p className="review-comment">{r.comment}</p>
                            <span className="review-date">{r.createdAt}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ProductDetail;