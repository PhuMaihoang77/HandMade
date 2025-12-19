import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/model';
import '../Styles/cart.css';

const Cart: FC = () => {
    const navigate = useNavigate();
    const {
        cart,
        updateQuantity,
        selectedItemIds,
        toggleItemSelected,
        toggleSelectAll,
        totalSelectedPrice
    } = useCart();

    useEffect(() => {
        document.title = "Handmade | Cart";
    }, []);

    const handleIncrease = (item: CartItem) => {
        updateQuantity(item.product.id as number, item.quantity + 1);
    };

    const handleDecrease = (item: CartItem) => {
        updateQuantity(item.product.id as number, item.quantity - 1);
    };

    const handleDeleteSelected = () => {
        if (window.confirm(`Xóa ${selectedItemIds.length} sản phẩm đã chọn khỏi giỏ hàng?`)) {
            selectedItemIds.forEach(id => updateQuantity(id, 0));
        }
    };

    const isAllSelected = cart.items.length > 0 && selectedItemIds.length === cart.items.length;

    return (
        <div className="cart-page-container">
            <div className="cart-header-sticky">
                <div className="cart-column-headers">
                    <div className="col-product">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={toggleSelectAll}
                                disabled={cart.items.length === 0}
                            />
                            Sản Phẩm
                        </label>
                    </div>
                    <div className="col-category">Danh Mục</div>
                    <div className="col-unit-price">Đơn Giá</div>
                    <div className="col-quantity">Số Lượng</div>
                    <div className="col-amount">Số Tiền</div>
                    <div className="col-action">Thao Tác</div>
                </div>
            </div>

            <div className="cart-items-container">
                {cart.items.length === 0 ? (
                    <div className="empty-cart" style={{ padding: '100px', textAlign: 'center', color: '#888' }}>
                        Giỏ hàng của bạn đang trống.
                    </div>
                ) : (
                    cart.items.map((item) => (
                        <div key={item.product.id} className="cart-item">
                            <div className="col-product">
                                <input
                                    type="checkbox"
                                    checked={selectedItemIds.includes(item.product.id as number)}
                                    onChange={() => toggleItemSelected(item.product.id as number)}
                                    className="item-selection-checkbox"
                                />
                                <img src={item.product.imageUrl} alt={item.product.name} className="item-image" />
                                <div className="item-name">{item.product.name}</div>
                            </div>

                            <div className="col-category">
                                <span className="category-tag">{item.product.category}</span>
                            </div>

                            <div className="col-unit-price">
                                ₫{item.product.price.toLocaleString('vi-VN')}
                            </div>

                            <div className="col-quantity">
                                <div className="quantity-controls">
                                    <button onClick={() => handleDecrease(item)} disabled={item.quantity <= 1}>-</button>
                                    <input type="text" value={item.quantity} readOnly />
                                    <button onClick={() => handleIncrease(item)}>+</button>
                                </div>
                            </div>

                            <div className="col-amount highlight">
                                ₫{(item.product.price * item.quantity).toLocaleString('vi-VN')}
                            </div>

                            <div className="col-action">
                                <button
                                    className="delete-btn"
                                    onClick={() => updateQuantity(item.product.id as number, 0)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-footer-sticky">
                <div className="footer-left">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                        />
                        Chọn Tất Cả ({cart.items.length})
                    </label>
                    <button
                        className="delete-selected-btn"
                        onClick={handleDeleteSelected}
                        disabled={selectedItemIds.length === 0}
                    >
                        Xóa mục đã chọn
                    </button>
                </div>

                <div className="footer-right">
                    <div className="cart-summary">
                        Tổng thanh toán ({selectedItemIds.length} sản phẩm): <span className="total-price">₫{totalSelectedPrice.toLocaleString('vi-VN')}</span>
                    </div>
                    <button
                        className="checkout-button"
                        disabled={selectedItemIds.length === 0}
                        onClick={() => navigate('/checkout')}
                    >
                        Mua Hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;