import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { Product, User } from '../types/model';

interface ProductCardProps {    
    product: Product;
    currentUser?: User | null; 
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isFavorite, setIsFavorite] = useState(false);
    
    const userString = localStorage.getItem('user');
    const userInStorage: User | null = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (userInStorage?.wishlist) {
            const exists = userInStorage.wishlist.some((p: Product) => p.id === product.id);
            setIsFavorite(exists);
        }
    }, [product.id, userInStorage]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!userInStorage) {
            alert("Vui lòng đăng nhập để lưu sản phẩm yêu thích!");
            return;
        }

        const currentWishlist = userInStorage.wishlist || [];
        let updatedWishlist: Product[];

        if (isFavorite) {
            updatedWishlist = currentWishlist.filter((p: Product) => p.id !== product.id);
        } else {
            updatedWishlist = [...currentWishlist, product];
        }

        try {
            const response = await axios.patch(`http://localhost:3000/users/${userInStorage.id}`, {
                wishlist: updatedWishlist
            });

            if (response.status === 200) {
                const updatedUser = { ...userInStorage, wishlist: updatedWishlist };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsFavorite(!isFavorite);
                window.dispatchEvent(new Event('wishlistUpdated'));
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật wishlist:", error);
            alert("Không thể kết nối với máy chủ.");
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.inventory > 0) {
            void addToCart(product, userInStorage);
        } else {
            alert("Sản phẩm đã hết hàng!");
        }
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.inventory > 0) {
            navigate('/checkout', { state: { buyNowItem: product } });
        } else {
            alert("Sản phẩm đã hết hàng!");
        }
    };

    return (
        <div className="product-card">
            <div className="product-image" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.imageUrl} alt={product.name} />

                {/* SỬA LỖI: Dùng thẻ <i> của FontAwesome thay cho react-icons */}
                <div 
                    className={`favorite-icon ${isFavorite ? 'active' : ''}`} 
                    onClick={toggleFavorite}
                >
                    {isFavorite 
                        ? <i className="fas fa-heart" style={{ color: '#ff4d4d' }}></i> 
                        : <i className="far fa-heart"></i>
                    }
                </div>

                {/* SỬA LỖI: Dùng thẻ <i> của FontAwesome thay cho react-icons */}
                <div className="add-to-cart-icon" title="Thêm vào giỏ" onClick={handleAddToCart}>
                    <i className="fas fa-shopping-cart"></i>
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
                    <button className="buy-button" onClick={handleBuyNow}>
                        Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;