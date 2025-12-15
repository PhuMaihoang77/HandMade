// src/pages/ProductDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import ProductPolicy from '../components/ProductPolicy';
import '../Styles/productDetail.css';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { product, loading, error } = useProductDetail(id);
    const { addToCart } = useCart();

    if (loading) return <div className="loading-spinner">Đang tải chi tiết...</div>;

    if (error || !product) return (
        <div className="error-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>{error || "Sản phẩm không tồn tại!"}</p>
            <button onClick={() => navigate('/')}>Về trang chủ</button>
        </div>
    );
    //Hàm thêm vào cart: thêm sản phẩm vào giỏ hàng
    const handleAddToCart = () => {
        if (product && product.inventory > 0) {
            addToCart(product);
        }
    };
    // Hàm Mua ngay: thêm sản phẩm vào localStorage rồi chuyển sang checkout
    const handleBuyNow = () => {
        const buyItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1
        };
        localStorage.setItem('cart', JSON.stringify([buyItem])); // Chỉ 1 sản phẩm
        navigate('/checkout');
    };

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

                {/* ✅ POLICY */}
                <ProductPolicy />

                <div className="product-meta">
                    <p><strong>Danh mục:</strong> {product.category}</p>
                    <p>
                        <strong>Tình trạng:</strong>
                        {product.inventory > 0 ? ' Còn hàng' : ' Hết hàng'}
                    </p>
                </div>

                <div className="product-description">
                    <p>{product.description}</p>
                </div>

                <div className="product-actions">
                    <button
                        className="btn-buy-now"
                        onClick={handleBuyNow}
                        disabled={product.inventory === 0}
                    >
                        Mua ngay
                    </button>
                    <button className="btn-add-cart"
                            onClick={handleAddToCart}>
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
