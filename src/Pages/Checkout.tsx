import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/checkout.css';  // Giữ import CSS

interface CartItem {
    id: string | number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
}

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'vnpay'>('cod');

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(cart);
    }, []);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleConfirmOrder = async () => {
        const fullName = (document.querySelector('input[placeholder="Họ và tên *"]') as HTMLInputElement)?.value.trim();
        const phone = (document.querySelector('input[placeholder="Số điện thoại *"]') as HTMLInputElement)?.value.trim();
        const address = (document.querySelector('textarea') as HTMLTextAreaElement)?.value.trim();

        if (!fullName || !phone || !address) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        if (paymentMethod === 'vnpay') {
            try {
                const response = await fetch('http://localhost:5000/api/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: totalPrice,
                        orderInfo: `Thanh toan don hang HandMade - ${fullName} - ${phone}`,
                        orderId: Date.now().toString(),
                    }),
                });

                const data = await response.json();
                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl;
                } else {
                    alert('Lỗi tạo thanh toán!');
                }
            } catch (err) {
                alert('Không kết nối được server thanh toán. Hãy chọn COD hoặc chuyển khoản.');
            }
        } else {
            alert(`Đơn hàng đã đặt thành công với phương thức: ${paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản ngân hàng'}!\nChúng tôi sẽ liên hệ xác nhận sớm.`);
            localStorage.removeItem('cart');
            navigate('/');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-content">
                <h2>Giỏ hàng trống</h2>
                <p>Hãy chọn sản phẩm để tiếp tục mua sắm nhé!</p>
                <button onClick={() => navigate('/')} className="btn-back">
                    Quay lại mua sắm
                </button>
            </div>
        );
    }

    return (
        <main className="checkout-main">
            <h1 className="page-title">Thanh Toán Đơn Hàng</h1>

            <div className="checkout-layout">
                {/* Bên trái: Thông tin giao hàng */}
                <div className="delivery-section">
                    <h2 className="section-title">Thông tin giao hàng</h2>
                    <form className="delivery-form">
                        <input type="text" placeholder="Họ và tên *" required />
                        <input type="tel" placeholder="Số điện thoại *" required />
                        <input type="email" placeholder="Email (tùy chọn)" />
                        <textarea
                            placeholder="Địa chỉ giao hàng chi tiết (số nhà, đường, phường/xã...) *"
                            required
                            rows={4}
                        />
                    </form>
                </div>

                {/* Bên phải: Đơn hàng + Thanh toán */}
                <div className="order-section">
                    <h2 className="section-title">Đơn hàng ({cartItems.length} sản phẩm)</h2>

                    <div className="product-list">
                        {cartItems.map(item => (
                            <div key={item.id} className="product-row">
                                <img src={item.imageUrl} alt={item.name} className="product-img" />
                                <div className="product-detail">
                                    <p className="product-name">{item.name}</p>
                                    <p className="product-qty">Số lượng: {item.quantity}</p>
                                </div>
                                <p className="product-total">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</p>
                            </div>
                        ))}
                    </div>

                    <div className="payment-section">
                        <h3 className="payment-title">Phương thức thanh toán</h3>
                        <label className="payment-item">
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                            />
                            Thanh toán khi nhận hàng (COD)
                        </label>
                        <label className="payment-item">
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'bank_transfer'}
                                onChange={() => setPaymentMethod('bank_transfer')}
                            />
                            Chuyển khoản ngân hàng
                        </label>
                        <label className="payment-item">
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'vnpay'}
                                onChange={() => setPaymentMethod('vnpay')}
                            />
                            <strong>Thanh toán online (VNPAY)</strong><br />
                            <small>Hỗ trợ BIDV, Vietcombank, Techcombank, MB Bank và 40+ ngân hàng khác</small>
                        </label>
                    </div>

                    <div className="total-row">
                        <span>Tổng cộng:</span>
                        <span className="total-price">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                    </div>

                    <button onClick={handleConfirmOrder} className="confirm-button">
                        XÁC NHẬN ĐẶT HÀNG
                    </button>

                    <p className="support-note">
                        Hỗ trợ: COD • Chuyển khoản • Thanh toán online
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Checkout;