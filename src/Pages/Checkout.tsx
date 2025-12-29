import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { getProducts } from '../services/ProductService';
import { User } from '../types/model';
import { useCart } from '../context/CartContext';
import { generateVNPayUrl } from '../services/vnpayService';
import '../Styles/checkout.css';

interface CheckoutProps { currentUser: User | null; }

const Checkout: React.FC<CheckoutProps> = ({ currentUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshCart } = useCart();

    const [displayItems, setDisplayItems] = useState<any[]>([]);
    const [finalTotal, setFinalTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod');
    const [loading, setLoading] = useState(true);

    const buyNowItem = location.state?.buyNowItem;
    const selectedIds = location.state?.selectedIds || [];

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const loadCheckoutData = async () => {
            setLoading(true);
            try {
                // TRƯỜNG HỢP 1: MUA NGAY (Kiểm tra dữ liệu từ trang Chi tiết sản phẩm)
                if (buyNowItem && buyNowItem.id) {
                    setDisplayItems([{ product: buyNowItem, quantity: 1 }]);
                    setFinalTotal(Number(buyNowItem.price));
                    setLoading(false);
                    return; // Thoát sớm, không chạy xuống phần Cart
                }

                // TRƯỜNG HỢP 2: THANH TOÁN GIỎ HÀNG (Dữ liệu từ trang Cart)
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
                                product: allProducts.find((p: any) => p.id === item.productId),
                                quantity: item.quantity
                            }))
                            .filter((i: any) => i.product);

                        if (itemsToPay.length > 0) {
                            setDisplayItems(itemsToPay);
                            const total = itemsToPay.reduce((sum: number, i: any) => sum + (i.product.price * i.quantity), 0);
                            setFinalTotal(total);
                            setLoading(false);
                            return;
                        }
                    }
                }

                // Nếu không rơi vào 2 trường hợp trên (F5 trang hoặc dữ liệu trống)
                navigate('/home');
            } catch (err) {
                console.error("Lỗi load checkout:", err);
            } finally {
                setLoading(false);
            }
        };

        void loadCheckoutData();
    }, [currentUser?.id, buyNowItem?.id, selectedIds.length]);

    const handleConfirmOrder = async () => {
        if (!currentUser) return;

        const fullName = (document.querySelector('input[name="fullname"]') as HTMLInputElement)?.value;
        const phone = (document.querySelector('input[name="phone"]') as HTMLInputElement)?.value;
        const address = (document.querySelector('textarea[name="address"]') as HTMLTextAreaElement)?.value;

        if (!fullName || !phone || !address) return alert('Vui lòng nhập đủ thông tin!');

        const orderId = 'ORD-' + Date.now();
        const isVNPay = paymentMethod === 'vnpay';

        const newOrder = {
            id: orderId,
            userId: currentUser.id,
            fullName, phone, address,
            date: new Date().toLocaleString('vi-VN'),
            items: displayItems,
            totalAmount: finalTotal,
            paymentMethod: paymentMethod.toUpperCase(),
            status: isVNPay ? 'Chờ thanh toán' : 'Đang xử lý',
            // Lưu meta-data để trang Return xử lý dọn giỏ sau này
            checkoutType: buyNowItem ? 'buy_now' : 'cart',
            selectedIds: selectedIds
        };

        try {
            // 1. Tạo đơn hàng vào database
            await api.post('/orders', newOrder);

            if (isVNPay) {
                // Luồng VNPay: Chỉ tạo đơn, dọn giỏ sẽ làm ở trang vnpay-return nếu thành công
                const paymentUrl = generateVNPayUrl(finalTotal, orderId);
                window.location.href = paymentUrl;
            } else {
                // Luồng COD: Dọn giỏ ngay vì giao dịch coi như xong bước đặt
                await cleanCartLocally();
                alert("Đặt hàng thành công!");
                navigate('/home');
            }
        } catch (err) {
            console.error("Lỗi đặt hàng:", err);
            alert("Lỗi đặt hàng!");
        }
    };

    const cleanCartLocally = async () => {
        try {
            const res = await api.get(`/carts?userId=${currentUser?.id}`);
            const userCart = res.data[0];
            if (userCart) {
                let remaining = [];
                if (buyNowItem) {
                    remaining = userCart.items.filter((i: any) => i.productId !== buyNowItem.id);
                } else {
                    remaining = userCart.items.filter((i: any) => !selectedIds.includes(i.productId));
                }
                await api.patch(`/carts/${userCart.id}`, { items: remaining });
                await refreshCart();
            }
        } catch (err) {
            console.warn("Lỗi dọn giỏ hàng:", err);
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="checkout-container">
            <h1>Thanh Toán</h1>
            <div className="checkout-grid">
                <div className="checkout-left">
                    <div className="checkout-card">
                        <h3>Sản phẩm</h3>
                        {displayItems.map((item, idx) => (
                            <div key={idx} className="checkout-product-item">
                                {item.product && (
                                    <>
                                        <img src={item.product.imageUrl} width={50} alt={item.product.name} />
                                        <div className="item-detail">
                                            <span>{item.product.name} (x{item.quantity})</span>
                                            <span className="item-subtotal">
                                                ₫{(item.product.price * item.quantity).toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="checkout-right">
                    <div className="checkout-card">
                        <h3>Thông tin nhận hàng</h3>
                        <div className="checkout-form">
                            <input name="fullname" placeholder="Họ tên *" required />
                            <input name="phone" placeholder="Số điện thoại *" required />
                            <textarea name="address" placeholder="Địa chia *" required />
                        </div>
                        <h3>Phương thức thanh toán</h3>
                        <div className="payment-methods">
                            <label>
                                <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                COD (Thanh toán khi nhận hàng)
                            </label>
                            <label>
                                <input type="radio" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
                                <b>Thanh toán qua VNPay</b>
                            </label>
                        </div>
                        <div className="checkout-total">
                            <span>Tổng cộng:</span>
                            <span className="price">₫{finalTotal.toLocaleString('vi-VN')}</span>
                        </div>
                        <button className="btn-order-confirm" onClick={() => void handleConfirmOrder()}>
                            XÁC NHẬN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;