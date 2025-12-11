// src/Pages/ProductDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail'; // Import Hook
import '../Styles/productDetail.css';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // SỬ DỤNG HOOK: 1 dòng code thay thế cho toàn bộ logic cũ
    const { product, loading, error } = useProductDetail(id);

    // Xử lý các trạng thái UI
    if (loading) return <div className="loading-spinner">Đang tải chi tiết...</div>;
    
    if (error || !product) return (
        <div className="error-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>{error || "Sản phẩm không tồn tại!"}</p>
            <button onClick={() => navigate('/')}>Về trang chủ</button>
        </div>
    );

    // Render giao diện chính
    return (
        <div className="product-detail">
            <div className="product-detail-image-wrapper">
                 <img 
                    className="product-detail-image"
                    src={product.imageUrl} 
                    alt={product.name} 
                />
            </div>
           
            <div className="product-detail-info">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-price">
                    {product.price.toLocaleString('vi-VN')} VNĐ
                </p>
                
                <div className="product-meta">
                    <p><strong>Danh mục:</strong> {product.category}</p>
                    <p><strong>Tình trạng:</strong> {product.inventory > 0 ? 'Còn hàng' : 'Hết hàng'}</p>
                </div>

                <div className="product-description">
                    <p>{product.description}</p>
                </div>

                <div className="product-actions">
                    <button className="btn-buy-now">Mua ngay</button>
                    <button className="btn-add-cart">Thêm vào giỏ</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;