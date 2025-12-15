import React, { FC } from 'react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/model';
import '../Styles/cart.css'; // Đảm bảo tên file CSS khớp

const Cart: FC = () => {
    const {
        cart,
        updateQuantity,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    const handleIncrease = (item: CartItem) => {
        const newQuantity = item.quantity + 1;
        updateQuantity(item.product.id as number, newQuantity);
    };

    const handleDecrease = (item: CartItem) => {
        const newQuantity = item.quantity - 1;
        updateQuantity(item.product.id as number, newQuantity);
    };

    return (
        <div
            className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="cart-header">
                <h2>Giỏ hàng</h2>
                <div className="cart-header-total">
                    Tổng giá: {cart.totalPrice.toLocaleString('vi-VN')} VNĐ
                </div>
                <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
                    X
                </button>
            </div>

            <div className="cart-items-container">
                {cart.items.length === 0 ? (
                    <p style={{ padding: '10px', textAlign: 'center' }}>Giỏ hàng của bạn đang trống.</p>
                ) : (
                    cart.items.map((item) => (
                        <div key={item.product.id} className="cart-item">
                            <img src={item.product.imageUrl} alt={item.product.name} className="item-image" />

                            <div className="item-info">
                                <div className="item-name">{item.product.name}</div>
                                <div className="item-price">{item.product.price.toLocaleString('vi-VN')} VNĐ</div>
                            </div>

                            <div className="item-total-price">
                                {(item.product.price * item.quantity).toLocaleString('vi-VN')}
                            </div>

                            <div className="quantity-controls">
                                <button onClick={() => handleDecrease(item)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleIncrease(item)}>+</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ padding: '15px', borderTop: '1px solid #000' }}>
                <button style={{ width: '100%', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Thanh toán
                </button>
            </div>
        </div>
    );
};

export default Cart;