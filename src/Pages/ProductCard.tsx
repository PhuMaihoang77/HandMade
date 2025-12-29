import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Product, User } from '../types/model'; // Thêm User vào đây
import api from '../services/api';
import {useCart} from "../context/CartContext";

interface ProductCardProps {
    product: Product;
    currentUser: User | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currentUser }) => {
    const navigate = useNavigate();
    const { addToCart,refreshCart } = useCart();
    const handleBuyNow = () => {
        if (product.inventory > 0) {
            navigate('/checkout', { state: { buyNowItem: product } });
        }
    };

    const handleAddToCart = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        // Chỉ cần 1 dòng duy nhất
        void addToCart(product, currentUser);
    };

    return (
        <div className="product-card">
            <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
                <div className="add-to-cart-icon" title="Thêm vào giỏ" onClick={(e) => void handleAddToCart(e)}>
                    {React.createElement(FaShoppingCart as any)}
                </div>
            </div>

            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                <p className="product-inventory">Còn lại: {product.inventory} sản phẩm</p>

                <div className="product-buttons">
                    <button className="view-button" onClick={() => navigate(`/product/${product.id}`)}>Xem chi tiết</button>
                    <button className="buy-button" onClick={handleBuyNow} >Mua ngay</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;