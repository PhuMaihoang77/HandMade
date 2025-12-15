import React, { FC } from 'react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/model';
import '../Styles/cart.css';

const Cart: FC = () => {
    const {
        cart,
        updateQuantity,
        selectedItemIds,
        toggleItemSelected,
        toggleSelectAll,
        totalSelectedPrice
    } = useCart();

    const handleIncrease = (item: CartItem) => {
        const newQuantity = item.quantity + 1;
        updateQuantity(item.product.id as number, newQuantity);
    };

    const handleDecrease = (item: CartItem) => {
        const newQuantity = item.quantity - 1;
        updateQuantity(item.product.id as number, newQuantity);
    };

    const isAllSelected = cart.items.length > 0 && selectedItemIds.length === cart.items.length;

    return (
        <div className="cart-page-container">
            <div className="cart-header">
                <label>
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        disabled={cart.items.length === 0}
                    />
                    Chọn tất cả ({selectedItemIds.length}/{cart.items.length})
                </label>

                <div className="cart-header-total">
                    Tổng giá (Tất cả): {cart.totalPrice.toLocaleString('vi-VN')} VNĐ
                </div>
            </div>

            <div className="cart-items-container">
                {cart.items.length === 0 ? (
                    <p style={{ padding: '10px', textAlign: 'center' }}>Giỏ hàng của bạn đang trống.</p>
                ) : (
                    cart.items.map((item) => (
                        <div key={item.product.id} className="cart-item">

                            <input
                                type="checkbox"
                                checked={selectedItemIds.includes(item.product.id as number)}
                                onChange={() => toggleItemSelected(item.product.id as number)}
                                className="item-selection-checkbox"
                            />

                            <img src={item.product.imageUrl} alt={item.product.name} className="item-image" />

                            <div className="item-info">
                                <div className="item-name">{item.product.name}</div>
                                <div className="item-price">{item.product.price.toLocaleString('vi-VN')} VNĐ</div>
                            </div>

                            <div className="item-total-price">
                                {(item.product.price * item.quantity).toLocaleString('vi-VN')}
                            </div>

                            <div className="quantity-controls">
                                <button onClick={() => handleDecrease(item)} disabled={item.quantity <= 1}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleIncrease(item)}>+</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-footer-actions">
                <div className="cart-summary">
                    Tổng tiền hàng: <span>{totalSelectedPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                <button
                    className="checkout-button"
                    disabled={selectedItemIds.length === 0}
                >
                    Thanh toán ({selectedItemIds.length})
                </button>
            </div>
        </div>
    );
};

export default Cart;