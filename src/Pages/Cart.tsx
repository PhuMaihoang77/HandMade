import React, { FC } from 'react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/model';
import '../Styles/cart.css';

const Cart: FC = () => {
    const {
        cart,
        updateQuantity
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
        <div className="cart-page-container">
            <div className="cart-header">
                <h2>Giỏ hàng</h2>
                <div className="cart-header-total">
                    Tổng giá: {cart.totalPrice.toLocaleString('vi-VN')} VNĐ
                </div>
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

            <div className="cart-footer-actions">
                <button className="checkout-button">
                    Thanh toán
                </button>
            </div>
        </div>
    );
};

export default Cart;