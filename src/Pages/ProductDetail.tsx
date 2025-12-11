// src/Pages/ProductDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from './ProductCard';
import { getProducts } from '../services/ProductService';
import '../Styles/productDetail.css'; // Lưu ý tên file chính xác

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProducts();
                const found = products.find(p => p.id === Number(id));
                setProduct(found || null);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [id]);

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải sản phẩm...</p>;
    if (!product) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Không tìm thấy sản phẩm!</p>;

    return (
        <div className="product-detail">
            <img 
                className="product-detail-image"
                src={product.imageUrl} 
                alt={product.name} 
            />
            <div className="product-detail-info">
                <h2>{product.name}</h2>
                <p className="product-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                <p>Danh mục: {product.category}</p>
                <p>Còn lại: {product.inventory} sản phẩm</p>
                <p>{product.description}</p>
                <button>Mua ngay</button>
            </div>
        </div>
    );
};

export default ProductDetail;
