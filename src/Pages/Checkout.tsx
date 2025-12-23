import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { getProducts } from '../services/ProductService';
import { User, Product } from '../types/model';
import { useCart } from '../context/CartContext';
import '../Styles/checkout.css';

interface CheckoutProps { currentUser: User | null; }

const Checkout: React.FC<CheckoutProps> = ({ currentUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshCart } = useCart();

    const [displayItems, setDisplayItems] = useState<any[]>([]);
    const [finalTotal, setFinalTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'vnpay'>('cod');
    const [loading, setLoading] = useState(true);

    const buyNowItem = location.state?.buyNowItem;
    const selectedIds = location.state?.selectedIds || [];

    useEffect(() => {
        const loadCheckoutData = async () => {
            if (!currentUser) return;

            try {
                if (buyNowItem && buyNowItem.id) {
                    setDisplayItems([{ product: buyNowItem, quantity: 1 }]);
                    setFinalTotal(buyNowItem.price);
                    setLoading(false);
                    return;
                }

                if (selectedIds.length > 0) {
                    const [allProducts, cartRes] = await Promise.all([
                        getProducts(),
                        api.get(`/carts?userId=${currentUser.id}`)
                    ]);

                    if (cartRes.data.length > 0) {
                        const userCart = cartRes.data[0];
                        const itemsToPay = userCart.items
                            .filter((item: any) => selectedIds.includes(item.productId))
                            .map((item: any) => ({
                                product: allProducts.find(p => p.id === item.productId),
                                quantity: item.quantity
                            }))
                            .filter((i: any) => i.product);

                        setDisplayItems(itemsToPay);
                        setFinalTotal(itemsToPay.reduce((sum: number, i: any) => sum + (i.product.price * i.quantity), 0));
                    }
                }
            } catch (err) {
                console.error("Lỗi load dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        void loadCheckoutData();
    }, [currentUser?.id, buyNowItem?.id, selectedIds.length]);

    const handleConfirmOrder = async () => {
        // Sử dụng optional chaining để tránh lỗi nếu không tìm thấy element
        const fullName = (document.querySelector('input[name="fullname"]') as HTMLInputElement)?.value;
        const phone = (document.querySelector('input[name="phone"]') as HTMLInputElement)?.value;
        const address = (document.querySelector('textarea[name="address"]') as HTMLTextAreaElement)?.value;

        if (!fullName || !phone || !address) return alert('Vui lòng nhập đủ thông tin!');

        const newOrder = {
            id: 'ORD-' + Date.now(),
            userId: currentUser?.id,
            fullName, phone, address,
            date: new Date().toLocaleString('vi-VN'),
            items: displayItems,
            totalAmount: finalTotal,
            paymentMethod: paymentMethod.toUpperCase(),
            status: 'Đang xử lý'
        };

        try {
            // 1. Tạo đơn hàng
            await api.post('/orders', newOrder);

            // 2. Dọn dẹp giỏ hàng (Không được để phần này chặn navigate)
            try {
                const res = await api.get(`/carts?userId=${currentUser?.id}`);
                const userCart = res.data[0];

                if (userCart) {
                    let remaining = [];
                    if (buyNowItem) {
                        // Nếu mua ngay, xóa chính nó nếu nó đang nằm trong giỏ
                        remaining = userCart.items.filter((i: any) => i.productId !== buyNowItem.id);
                    } else {
                        // Nếu mua từ giỏ, xóa các ID đã chọn
                        remaining = userCart.items.filter((i: any) => !selectedIds.includes(i.productId));
                    }
                    await api.patch(`/carts/${userCart.id}`, { items: remaining });
                    await refreshCart();
                }
            } catch (err) {
                console.warn("Lỗi dọn giỏ hàng, đơn vẫn được tạo:", err);
            }

            // 3. Thông báo và CHẮC CHẮN chuyển trang
            alert("Đặt hàng thành công!");
            navigate('/home');
        } catch (err) {
            console.error("Lỗi đặt hàng chính:", err);
            alert("Lỗi đặt hàng!");
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="checkout-container">
            <h1>Thanh Toán</h1>
            <div className="checkout-grid">
                <div className="checkout-left">
                    <div className="checkout-card">
                        <h3>Sản phẩm</h3>
                        {displayItems.map((item, idx) => (
                            <div key={idx} className="checkout-product-item">
                                {/* Check kỹ item.product để tránh lỗi hiển thị */}
                                {item.product && (
                                    <>
                                        <img src={item.product.imageUrl} width={50} alt={item.product.name} />
                                        <span>{item.product.name} (x{item.quantity})</span>
                                        <span>₫{(item.product.price * item.quantity).toLocaleString('vi-VN')}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* ... (Phần bên phải giữ nguyên) */}
                <div className="checkout-right">
                    <div className="checkout-card">
                        <h3>Thông tin nhận hàng</h3>
                        <div className="checkout-form">
                            <input name="fullname" placeholder="Họ tên *" required />
                            <input name="phone" placeholder="Số điện thoại *" required />
                            <textarea name="address" placeholder="Địa chỉ *" required />
                        </div>
                        <h3>Phương thức thanh toán</h3>
                        <div className="payment-methods">
                            <label><input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> COD</label>
                            <label><input type="radio" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} /> Chuyển khoản</label>
                        </div>
                        <div className="checkout-total">Tổng: ₫{finalTotal.toLocaleString('vi-VN')}</div>
                        <button className="btn-order-confirm" onClick={() => void handleConfirmOrder()}>XÁC NHẬN</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Checkout;