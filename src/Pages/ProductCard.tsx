import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../context/CartContext';
import axios from 'axios';
import { Product, User } from '../types/model'; // Thêm User vào đây
import api from '../services/api';
import {useCart} from "../context/CartContext";


interface ProductCardProps {    
    product: Product;
    currentUser: User | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currentUser }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isFavorite, setIsFavorite] = useState(false);
    
    // Lấy thông tin user hiện tại từ localStorage
    const userString = localStorage.getItem('user');
    const currentUser: User | null = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        // Kiểm tra xem sản phẩm có trong wishlist của user không
        if (currentUser?.wishlist) {
            const exists = currentUser.wishlist.some((p: Product) => p.id === product.id);
            setIsFavorite(exists);
        }
    }, [product.id, currentUser]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!currentUser) {
            alert("Vui lòng đăng nhập để lưu sản phẩm yêu thích!");
            return;
        }

        // Tạo wishlist mới dựa trên trạng thái hiện tại
        const currentWishlist = currentUser.wishlist || [];
        let updatedWishlist: Product[];

        if (isFavorite) {
            updatedWishlist = currentWishlist.filter((p: Product) => p.id !== product.id);
        } else {
            updatedWishlist = [...currentWishlist, product];
        }

        try {
            // Gửi dữ liệu lên json-server
            const response = await axios.patch(`http://localhost:3000/users/${currentUser.id}`, {
                wishlist: updatedWishlist
            });

            if (response.status === 200) {
                // Cập nhật lại localStorage để đồng bộ dữ liệu toàn ứng dụng
                const updatedUser = { ...currentUser, wishlist: updatedWishlist };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                setIsFavorite(!isFavorite);

                // Phát tín hiệu để trang Profile cập nhật giao diện ngay lập tức
                window.dispatchEvent(new Event('wishlistUpdated'));
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật json-server:", error);
            alert("Không thể kết nối với máy chủ.");
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.inventory > 0) {
            addToCart(product);
            alert(`Đã thêm ${product.name} vào giỏ hàng!`);
        } else {
            alert("Sản phẩm đã hết hàng!");
        }

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

      
                {/* Icon trái tim bên trái */}
                <div 
                    className={`favorite-icon ${isFavorite ? 'active' : ''}`} 
                    onClick={toggleFavorite}
                >
                    {isFavorite 
                        ? React.createElement(FaHeart as any, { color: "#ff4d4d" }) 
                        : React.createElement(FaRegHeart as any)
                    }
                </div>

             
                <div className="add-to-cart-icon" title="Thêm vào giỏ" onClick={(e) => void handleAddToCart(e)}>

                    {React.createElement(FaShoppingCart as any)}
                </div>
            </div>

            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                <p className="product-inventory">Còn lại: {product.inventory} sản phẩm</p>

                <div className="product-buttons">

                    <button className="view-button" onClick={() => navigate(`/product/${product.id}`)}>
                        Xem chi tiết
                    </button>
                    <button className="buy-button" onClick={() => navigate('/checkout', { state: { buyNowItem: product } })}>
                        Mua ngay
                    </button>

                    <button className="view-button" onClick={() => navigate(`/product/${product.id}`)}>Xem chi tiết</button>
                    <button className="buy-button" onClick={handleBuyNow} >Mua ngay</button>

                </div>
            </div>
        </div>
    );
};

export default ProductCard;