import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { User } from '../types/model';
import '../Styles/orders.css';

interface OrderHistoryProps {
    currentUser: User | null;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ currentUser }) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/orders?userId=${currentUser.id}`);
                // Sắp xếp đơn hàng mới nhất lên đầu
                setOrders(res.data.sort((a: any, b: any) => b.id.split('-')[1] - a.id.split('-')[1]));
            } catch (err) {
                console.error("Lỗi tải đơn hàng:", err);
            } finally {
                setLoading(false);
            }
        };
        void fetchOrders();
    }, [currentUser]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải...</div>;
    if (!currentUser) return <div style={{ padding: '50px', textAlign: 'center' }}>Vui lòng đăng nhập!</div>;

    return (
        <div className="orders-page">
            <h1>Lịch sử đơn hàng</h1>
            {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <span>Mã đơn: <strong>{order.id}</strong></span>
                                <span>Ngày đặt: {order.date}</span>
                                <span className="order-status">{order.status}</span>
                            </div>
                            <div className="order-body">
                                {order.items.map((item: any, index: number) => (
                                    <div key={index} className="order-item-mini">
                                        <img src={item.product.imageUrl} alt="" />
                                        <div className="item-info">
                                            <p>{item.product.name}</p>
                                            <p>x{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <span>Phương thức: {order.paymentMethod}</span>
                                <span className="order-total">Tổng tiền: ₫{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;