import React from 'react';
import { useOrders } from '../context/OrderContext';
import '../Styles/orders.css';

const OrderHistory: React.FC = () => {
    const { orders } = useOrders();

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
                                {order.items.map((item, index) => (
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
                                <span className="order-total">
                                    Tổng tiền: ₫{order.totalAmount.toLocaleString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;