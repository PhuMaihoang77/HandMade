import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import ProductPolicy from '../components/ProductPolicy';
import '../Styles/productDetail.css';
import api from '../services/api';
import { User } from '../types/model';
import {useCart} from "../context/CartContext";

interface ProductDetailProps {
    currentUser: User | null; // Nhận từ Route
}

const ProductDetail: React.FC<ProductDetailProps> = ({ currentUser }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { product, loading, error } = useProductDetail(id);
    const { addToCart,refreshCart } = useCart();

    if (loading) return <div className="loading-spinner">Đang tải chi tiết...</div>;

    if (error || !product) return (
        <div className="error-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>{error || "Sản phẩm không tồn tại!"}</p>
            <button onClick={() => navigate('/')}>Về trang chủ</button>
        </div>
    );

    const handleAddToCart = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        // Chỉ cần 1 dòng duy nhất
        void addToCart(product, currentUser);
    };

    const handleBuyNow = () => {
        if (product && product.inventory > 0) {
            navigate('/checkout', { state: { buyNowItem: product } });
        }
    };

    return (
        <div className="product-detail">
            <div className="product-detail-image-wrapper">
                <img className="product-detail-image" src={product.imageUrl} alt={product.name} />
            </div>

            <div className="product-detail-info">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                <ProductPolicy />

                <div className="product-meta">
                    <p><strong>Danh mục:</strong> {product.category}</p>
                    <p><strong>Tình trạng:</strong> {product.inventory > 0 ? ' Còn hàng' : ' Hết hàng'}</p>
                </div>

                <div className="product-description"><p>{product.description}</p></div>

                <div className="product-actions">
                    <button className="btn-buy-now" onClick={handleBuyNow} disabled={product.inventory === 0}>Mua ngay</button>
                    <button className="btn-add-cart" onClick={() => void handleAddToCart()}>Thêm vào giỏ</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;