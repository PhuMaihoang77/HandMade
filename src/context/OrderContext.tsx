import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Order {
    id: string;
    date: string;
    items: any[];
    totalAmount: number;
    paymentMethod: string;
    status: 'Đang xử lý' | 'Đã giao' | 'Đã hủy';
}

interface OrderContextType {
    orders: Order[];
    addOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('order_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('order_history', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]); // Đơn hàng mới nhất lên đầu
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrders must be used within OrderProvider');
    return context;
};