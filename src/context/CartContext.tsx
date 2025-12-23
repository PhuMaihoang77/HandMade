import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/model';
import api from '../services/api';

interface CartContextType {
    cartCount: number;
    refreshCart: () => Promise<void>;
    addToCart: (product: any, currentUser: User | null) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children, currentUser }: { children: ReactNode, currentUser: User | null }) => {
    const [cartCount, setCartCount] = useState(0);

    const refreshCart = async () => {
        if (!currentUser) {
            setCartCount(0);
            return;
        }
        try {
            const res = await api.get(`/carts?userId=${currentUser.id}`);
            const data = res.data;
            if (data && data.length > 0) {
                setCartCount(data[0].items?.length || 0);
            } else {
                setCartCount(0);
            }
        } catch (err) {
            console.error("Lỗi cập nhật Badge:", err);
        }
    };

    const addToCart = async (product: any, user: User | null) => {
        if (!user) return alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        if (!product || product.inventory <= 0) return alert("Sản phẩm đã hết hàng!");

        try {
            const res = await api.get(`/carts?userId=${user.id}`);
            let userCart = res.data[0];

            if (!userCart) {
                const newCart = { userId: user.id, items: [] };
                const createRes = await api.post('/carts', newCart);
                userCart = createRes.data;
            }

            const existingItem = userCart.items.find((i: any) => i.productId === product.id);
            const newItems = existingItem
                ? userCart.items.map((i: any) =>
                    i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
                )
                : [...userCart.items, { productId: product.id, quantity: 1 }];

            await api.patch(`/carts/${userCart.id}`, { items: newItems });

            await refreshCart();
            alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
        } catch (error) {
            console.error("Lỗi thêm vào giỏ:", error);
            alert("Không thể thêm vào giỏ hàng!");
        }
    };

    useEffect(() => {
        void refreshCart();
    }, [currentUser]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};