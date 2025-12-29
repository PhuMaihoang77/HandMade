import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import ProductPolicy from '../components/ProductPolicy';
import { useCart } from '../context/CartContext';
import { User } from '../types/model'; // Đảm bảo import User
import '../Styles/productDetail.css';

interface ProductDetailProps {
    currentUser: User | null;
    onLogout: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ currentUser }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { product, loading, error, reviews, addReview } = useProductDetail(id);

    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (rating === 0 || !comment.trim()) {
            alert('Vui lòng chọn sao và nhập nội dung.');
            return;
        }

        addReview({
            userName: currentUser.username,
            rating,
            comment: comment.trim(),
        });
        setRating(0);
        setComment('');
    };

    if (loading) return <div className="loading-spinner">Đang tải...</div>;
    if (error || !product) return <div>Lỗi: {error || "Không tìm thấy sản phẩm"}</div>;

    return (
        <div className="product-page-container">
            <div className="product-detail">
                <div className="product-detail-image-wrapper">
                    <img className="product-detail-image" src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-detail-info">
                    <h2 className="product-title">{product.name}</h2>
                    <p className="product-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                    <ProductPolicy />
                    <div className="product-description">{product.description}</div>
                    
                    <div className="product-actions">
                        <button 
                            className="btn-buy-now" 
                            onClick={() => navigate('/checkout', { state: { buyNowItem: product } })} 
                            disabled={product.inventory === 0}
                        >
                            Mua ngay
                        </button>
                        {/* SỬA TẠI ĐÂY: Truyền thêm currentUser */}
                        <button 
                            className="btn-add-cart" 
                            onClick={() => addToCart(product, currentUser)}
                        >
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
            {/* ... phần review giữ nguyên ... */}
        </div>
    );
};

export default ProductDetail;