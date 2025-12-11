// src/components/ProductCard.tsx
import React from 'react';

// Khai báo kiểu dữ liệu cho sản phẩm
export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        // Chỉ hiển thị khung thẻ sản phẩm
        <div className="product-card">
            <div className="product-image placeholder"></div> {/* ⭐ DIV Placeholder cho ảnh */}
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                <button className="add-to-cart-button">Thêm vào giỏ</button>
            </div>
        </div>
    );
};

export default ProductCard;