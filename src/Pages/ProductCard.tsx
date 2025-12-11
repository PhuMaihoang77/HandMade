import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    categoryId: number;
    imageUrl: string;
    description: string;
    inventory: number;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    return (
        <div className="product-card">
            <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
                <div className="add-to-cart-icon" title="Thêm vào giỏ">
                    {React.createElement(FaShoppingCart as any)}     
                </div>
            </div>

            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                <p className="product-inventory">
                    Còn lại: {product.inventory} sản phẩm
                </p>

                <div className="product-buttons">
                    <button
                        className="view-button"
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                        Xem chi tiết
                    </button>
                    <button className="buy-button">Mua ngay</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
