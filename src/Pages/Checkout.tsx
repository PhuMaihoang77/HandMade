import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { getProducts } from '../services/ProductService';
import { User } from '../types/model';
import { useCart } from '../context/CartContext';
import { generateVNPayUrl } from '../services/vnpayService';
import DeliveryInfo from './DeliveryInfo'; // Đảm bảo đúng đường dẫn file
import '../Styles/checkout.css';

interface CheckoutProps { currentUser: User | null; }

const Checkout: React.FC<CheckoutProps> = ({ currentUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshCart } = useCart();

    // State nhận dữ liệu từ DeliveryInfo con
    const [shippingDetails, setShippingDetails] = useState<any>(null);

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
                if (buyNowItem && buyNowItem.id) {
                    setDisplayItems([{ product: buyNowItem, quantity: 1 }]);
                    setFinalTotal(Number(buyNowItem.price));
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

        // Kiểm tra dữ liệu từ component con DeliveryInfo gửi lên
        if (!shippingDetails ||
            !shippingDetails.fullName ||
            !shippingDetails.phone ||
            !shippingDetails.province ||
            !shippingDetails.district ||
            !shippingDetails.ward ||
            !shippingDetails.detailAddress) {
            return alert('Vui lòng nhập đầy đủ thông tin giao hàng!');
        }

        const orderId = 'ORD-' + Date.now();
        const isVNPay = paymentMethod === 'vnpay';

        const fullAddress = `${shippingDetails.detailAddress}, ${shippingDetails.ward}, ${shippingDetails.district}, ${shippingDetails.province}`;

        const newOrder = {
            id: orderId,
            userId: currentUser.id,
            fullName: shippingDetails.fullName,
            phone: shippingDetails.phone,
            address: fullAddress,
            date: new Date().toLocaleString('vi-VN'),
            items: displayItems,
            totalAmount: finalTotal,
            paymentMethod: paymentMethod.toUpperCase(),
            status: isVNPay ? 'Chờ thanh toán' : 'Đang xử lý',
            checkoutType: buyNowItem ? 'buy_now' : 'cart',
            selectedIds: selectedIds
        };

        try {
            await api.post('/orders', newOrder);

            if (isVNPay) {
                const paymentUrl = generateVNPayUrl(finalTotal, orderId);
                window.location.href = paymentUrl;
            } else {
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
                        <h3>Thông tin nhận hàng</h3>
                        {/* Nhúng component con và hứng data qua callback */}
                        <DeliveryInfo onAddressChange={(data) => setShippingDetails(data)} />
                    </div>

                    <div className="checkout-card" style={{ marginTop: '20px' }}>
                        <h3>Sản phẩm thanh toán</h3>
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
                        <h3>Phương thức thanh toán</h3>
                        <div className="payment-methods">
                            <label className={`method-item ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                COD (Thanh toán khi nhận hàng)
                            </label>
                            <label className={`method-item ${paymentMethod === 'vnpay' ? 'active' : ''}`}>
                                <input type="radio" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
                                <b>Thanh toán qua VNPay</b>
                            </label>
                        </div>
                        <div className="checkout-total">
                            <span>Tổng tiền thanh toán:</span>
                            <span className="price">₫{finalTotal.toLocaleString('vi-VN')}</span>
                        </div>
                        <button className="btn-order-confirm" onClick={() => void handleConfirmOrder()}>
                            XÁC NHẬN ĐẶT HÀNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;