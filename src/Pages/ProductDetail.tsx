import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import ProductPolicy from '../components/ProductPolicy';
import { useCart } from '../context/CartContext';
import { User } from '../types/model';
import { useNotify } from '../components/NotificationContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

import '../Styles/productDetail.css';

// Interface cho Props
interface ProductDetailProps {
    currentUser: User | null;
    onLogout: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ currentUser }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
const notify = useNotify();
console.log('notify:', notify);
    const { product, loading, error, reviews, addReview } = useProductDetail(id);

    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    // Xử lý gửi đánh giá
  // Gửi đánh giá
const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
        notify.warning("Vui lòng đăng nhập để gửi đánh giá");
        navigate('/login', { state: { from: `/product/${id}` } });
        return;
    }

    if (rating === 0 || !comment.trim()) {
        notify.info("Vui lòng chọn số sao và nhập nội dung đánh giá");
        return;
    }

    addReview({
        userName: currentUser.username,
        rating,
        comment: comment.trim(),
    });

    notify.success("Cảm ơn bạn đã đánh giá sản phẩm!");
    setRating(0);
    setComment('');
};

// Mua ngay
const handleBuyNow = () => {
    if (!product || product.inventory <= 0) {
        notify.error("Sản phẩm hiện đã hết hàng");
        return;
    }

    if (!currentUser) {
        notify.warning("Vui lòng đăng nhập để mua hàng");
        navigate('/login', { state: { from: '/checkout', buyNowItem: product } });
        return;
    }

    navigate('/checkout', { state: { buyNowItem: product } });
};


    if (loading) return <div className="loading-spinner">Đang tải...</div>;
    
    if (error || !product) return (
        <div className="error-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>{error || "Sản phẩm không tồn tại!"}</p>
            <button onClick={() => navigate('/')}>Về trang chủ</button>
        </div>
    );

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
                        <p><strong>Tình trạng:</strong> 
                            <span style={{ color: product.inventory > 0 ? '#27ae60' : '#e74c3c' }}>
                                {product.inventory > 0 ? ' Còn hàng' : ' Hết hàng'}
                            </span>
                        </p>
                    </div>

                    <div className="product-description">{product.description}</div>
                    
                    <div className="product-actions">
                        <button 
                            className="btn-buy-now" 
                            onClick={handleBuyNow} 
                            disabled={product.inventory === 0}
                        >
                            Mua ngay
                        </button>
                        <button 
                            className="btn-add-cart" 
                            onClick={() => addToCart(product, currentUser)}
                            disabled={product.inventory === 0}
                        >
                            Thêm vào giỏ
                        </button>
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
                                    <i className="fas fa-star"></i>
                                </button>
                            ))}
                        </div>
                        <textarea 
                            className="review-textarea"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Cảm nhận của bạn về sản phẩm này..."
                        />
                        <button type="submit" className="btn-primary">Gửi đánh giá</button>
                    </form>
                ) : (
                    <div className="review-login-hint">
                        Vui lòng <strong style={{cursor:'pointer', color:'#007bff'}} onClick={() => navigate('/login')}>đăng nhập</strong> để bình luận.
                    </div>
                )}

                <div className="review-list">
                    {reviews.length === 0 ? (
                        <p style={{color: '#888', fontStyle: 'italic'}}>Chưa có đánh giá nào cho sản phẩm này.</p>
                    ) : (
                        reviews.map(r => (
                            <div key={r.id} className="review-item">
                                <div className="review-header">
                                    <span className="review-user">
                                        <i className="fas fa-user-circle"></i> {r.userName}
                                    </span>
                                    <span className="review-rating">
                                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                    </span>
                                </div>
                                <p className="review-comment">{r.comment}</p>
                                <span className="review-date">{r.createdAt}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;