import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { getProducts } from '../services/ProductService';
import { User } from '../types/model';
import { useCart } from '../context/CartContext';
import { generateVNPayUrl } from '../services/vnpayService';
import DeliveryInfo from './DeliveryInfo';
import '../Styles/checkout.css';

interface CheckoutProps { currentUser: User | null; }

const Checkout: React.FC<CheckoutProps> = ({ currentUser }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const { refreshCart } = useCart();

    const [shippingDetails, setShippingDetails] = useState<any>(null);
    const [displayItems, setDisplayItems] = useState<any[]>([]);
    const [finalTotal, setFinalTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod');
    const [loading, setLoading] = useState(true);

    const buyNowItem = location.state?.buyNowItem;
    const selectedIds = location.state?.selectedIds || [];
    const rePayOrder = location.state?.rePayOrder;

    useEffect(() => {
        if (rePayOrder && !shippingDetails) {
            setShippingDetails({
                fullName: rePayOrder.fullName,
                phone: rePayOrder.phone,
                isFromOldOrder: true
            });
        }
    }, [rePayOrder]);

    useEffect(() => {
        if (!currentUser) { navigate('/login'); return; }

        const loadCheckoutData = async () => {
            setLoading(true);
            try {
                if (rePayOrder) {
                    setDisplayItems(rePayOrder.items);
                    setFinalTotal(rePayOrder.totalAmount);
                    setPaymentMethod(rePayOrder.paymentMethod.toLowerCase() === 'vnpay' ? 'vnpay' : 'cod');
                } else if (buyNowItem?.id) {
                    setDisplayItems([{ product: buyNowItem, quantity: 1 }]);
                    setFinalTotal(Number(buyNowItem.price));
                } else if (selectedIds.length > 0) {
                    const [allProducts, cartRes] = await Promise.all([getProducts(), api.get(`/carts?userId=${currentUser.id}`)]);
                    const userCart = cartRes.data[0];
                    if (userCart) {
                        const itemsToPay = userCart.items
                            .filter((item: any) => selectedIds.includes(item.productId))
                            .map((item: any) => ({
                                product: allProducts.find((p: any) => p.id === item.productId),
                                quantity: item.quantity
                            })).filter((i: any) => i.product);
                        setDisplayItems(itemsToPay);
                        setFinalTotal(itemsToPay.reduce((sum: number, i: any) => sum + (i.product.price * i.quantity), 0));
                    }
                } else { navigate('/home'); }
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        void loadCheckoutData();
    }, [currentUser?.id, buyNowItem?.id, selectedIds.length, rePayOrder]);

    const prepareOrderData = (status: string) => {
        const hasFormAddress = shippingDetails?.detailAddress && shippingDetails?.province;

        let fullAddress = "";
        if (hasFormAddress) {
            fullAddress = `${shippingDetails.detailAddress}, ${shippingDetails.ward}, ${shippingDetails.district}, ${shippingDetails.province}`;
        } else {
            fullAddress = rePayOrder?.address || ", , , ";
        }

        return {
            id: rePayOrder ? rePayOrder.id : 'ORD-' + Date.now(),
            userId: currentUser?.id,
            fullName: shippingDetails?.fullName || rePayOrder?.fullName || "",
            phone: shippingDetails?.phone || rePayOrder?.phone || "",
            address: fullAddress,
            items: displayItems,
            totalAmount: finalTotal,
            paymentMethod: paymentMethod.toUpperCase(),
            status: status,
            date: rePayOrder ? rePayOrder.date : new Date().toLocaleString('vi-VN')
        };
    };

    const updateProductStock = async () => {
        try {
            const updatePromises = displayItems.map(item => {
                const newStock = item.product.stock - item.quantity;
                return api.patch(`/products/${item.product.id}`, { stock: newStock });
            });
            await Promise.all(updatePromises);
        } catch (err) {
            console.error("Lỗi cập nhật kho hàng:", err);
        }
    };

    const handleConfirmOrder = async () => {
        if (!currentUser) return;
        if (!rePayOrder && (!shippingDetails?.fullName || !shippingDetails?.phone)) {
            return alert('Vui lòng điền thông tin để đặt hàng!');
        }

        const isVNPay = paymentMethod === 'vnpay';
        const statusText = isVNPay ? 'Chờ thanh toán' : 'Thanh toán khi nhận hàng';
        const orderData = prepareOrderData(statusText);

        try {
            if (rePayOrder) {
                await api.put(`/orders/${rePayOrder.id}`, orderData);
            } else {
                await api.post('/orders', orderData);
                if (!buyNowItem) await cleanCartLocally();
            }

            if (isVNPay) {
                window.location.href = generateVNPayUrl(finalTotal, orderData.id);
            } else {
                await updateProductStock();
                alert("Xác nhận thành công!");
                navigate('/order-history');
            }
        } catch (err) {
            alert("Lỗi hệ thống!");
        }
    };

    const handleCancelOrder = async () => {
        const orderData = prepareOrderData('Đã hủy');
        try {
            if (rePayOrder) {
                await api.put(`/orders/${rePayOrder.id}`, orderData);
            } else {
                await api.post('/orders', orderData);
                if (!buyNowItem) await cleanCartLocally();
            }
            navigate('/order-history');
        } catch (err) { navigate('/order-history'); }
    };

    const cleanCartLocally = async () => {
        try {
            const res = await api.get(`/carts?userId=${currentUser?.id}`);
            if (res.data[0]) {
                let remaining = res.data[0].items.filter((i: any) => !displayItems.some(di => di.product.id === i.productId));
                await api.patch(`/carts/${res.data[0].id}`, { items: remaining });
                await refreshCart();
            }
        } catch (err) { }
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="checkout-container">
            <h1>Thanh Toán</h1>
            <div className="checkout-grid">
                <div className="checkout-left">
                    <div className="checkout-card">
                        <h3>Sản phẩm thanh toán</h3>
                        {displayItems.map((item, idx) => (
                            <div key={idx} className="checkout-product-item">
                                <img src={item.product?.imageUrl} width={50} alt="" />
                                <div className="item-detail">
                                    <span>{item.product?.name} (x{item.quantity})</span>
                                    <span className="item-subtotal">₫{(item.product?.price * item.quantity).toLocaleString('vi-VN')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-card" style={{ marginTop: '20px' }}>
                        <h3>Thông tin nhận hàng</h3>
                        <DeliveryInfo
                            initialData={rePayOrder}
                            onAddressChange={(data) => setShippingDetails(data)}
                        />
                    </div>
                </div>
                <div className="checkout-right">
                    <div className="checkout-card">
                        <h3>Phương thức thanh toán</h3>
                        <div className="payment-methods">
                            <label className={`method-item ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> COD
                            </label>
                            <label className={`method-item ${paymentMethod === 'vnpay' ? 'active' : ''}`}>
                                <input type="radio" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} /> <b>VNPay</b>
                            </label>
                        </div>
                        <div className="checkout-total"><span>Tổng tiền:</span><span className="price">₫{finalTotal.toLocaleString('vi-VN')}</span></div>
                        <div className="checkout-actions">
                            <button className="btn-order-confirm" onClick={() => void handleConfirmOrder()}>XÁC NHẬN</button>
                            <button className="btn-order-cancel" onClick={() => void handleCancelOrder()}>HỦY ĐƠN</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;