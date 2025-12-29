import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const VNPayReturn: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshCart } = useCart();
    const isProcessed = useRef(false); // Tránh React StrictMode chạy 2 lần

    useEffect(() => {
        if (isProcessed.current) return;

        const handleResult = async () => {
            const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
            const orderId = searchParams.get('vnp_TxnRef');

            try {
                const orderRes = await api.get(`/orders/${orderId}`);
                const orderData = orderRes.data;

                if (vnp_ResponseCode === '00') {
                    // --- TRƯỜNG HỢP THÀNH CÔNG ---
                    // A. Cập nhật trạng thái đơn hàng
                    await api.patch(`/orders/${orderId}`, { status: 'Đã thanh toán' });
                    // B. Thực hiện trừ giỏ hàng (Chỉ trừ khi thanh toán thành công)
                    const cartRes = await api.get(`/carts?userId=${orderData.userId}`);
                    const userCart = cartRes.data[0];

                    if (userCart) {
                        let remaining = [];
                        if (orderData.checkoutType === 'buy_now') {
                            // Mua ngay thì tìm món đó trong giỏ để xóa (nếu có)
                            remaining = userCart.items.filter((i: any) => i.productId !== orderData.items[0].product.id);
                        } else {
                            // Mua từ giỏ thì xóa theo list IDs đã lưu trong đơn hàng
                            remaining = userCart.items.filter((i: any) => !orderData.selectedIds.includes(i.productId));
                        }
                        await api.patch(`/carts/${userCart.id}`, { items: remaining });
                        await refreshCart();
                    }
                    alert("Thanh toán thành công!");
                } else {
                    // --- TRƯỜNG HỢP THẤT BẠI/HỦY ---
                    await api.patch(`/orders/${orderId}`, { status: 'Thanh toán thất bại' });
                    alert("Thanh toán không thành công. Bạn thử lại xem!");
                }
            } catch (err) {
                console.error("Lỗi xử lý kết quả VNPay:", err);
            } finally {
                isProcessed.current = true;
                navigate('/profile'); // Về trang cá nhân để xem danh sách đơn
            }
        };

        void handleResult();
    }, []);

    return <div className="loading">Đang xác nhận giao dịch...</div>;
};

export default VNPayReturn;