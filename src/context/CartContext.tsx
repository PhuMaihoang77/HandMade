import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { Product, Cart, CartItem, User } from '../types/model';

interface CartContextType {
    cart: Cart;
    addToCart: (product: Product) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
    selectedItemIds: number[];
    toggleItemSelected: (productId: number) => void;
    toggleSelectAll: () => void;
    totalSelectedPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotalPrice = (items: CartItem[]) => items.reduce((t, i) => t + i.product.price * i.quantity, 0);

export const CartProvider: React.FC<{ children: ReactNode; currentUser: User | null }> = ({ children, currentUser }) => {

    const [cart, setCart] = useState<Cart>(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser) as User;
            const savedCart = localStorage.getItem(`cart_user_${user.id}`);
            return savedCart ? JSON.parse(savedCart) : { items: [], totalPrice: 0 };
        }
        return { items: [], totalPrice: 0 };
    });

    const [selectedItemIds, setSelectedItemIds] = useState<number[]>(() => {
        return cart.items.map(i => i.product.id as number);
    });

    useEffect(() => {
        if (currentUser) {
            const savedData = localStorage.getItem(`cart_user_${currentUser.id}`);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                setCart(parsed);
                setSelectedItemIds(parsed.items.map((i: CartItem) => i.product.id));
            } else {
                setCart({ items: [], totalPrice: 0 });
                setSelectedItemIds([]);
            }
        }
    }, [currentUser?.id]);

    useEffect(() => {
        if (currentUser && currentUser.id) {
            localStorage.setItem(`cart_user_${currentUser.id}`, JSON.stringify(cart));
        }
    }, [cart, currentUser?.id]);

    const addToCart = useCallback((product: Product) => {
        setCart(prev => {
            const exist = prev.items.find(i => i.product.id === product.id);
            let newItems;
            if (exist) {
                newItems = prev.items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            } else {
                newItems = [...prev.items, { product, quantity: 1 }];
                setSelectedItemIds(ids => [...ids, product.id as number]);
            }
            return { items: newItems, totalPrice: calculateTotalPrice(newItems) };
        });
    }, []);

    const updateQuantity = useCallback((id: number, qty: number) => {
        setCart(prev => {
            let newItems = qty <= 0
                ? prev.items.filter(i => i.product.id !== id)
                : prev.items.map(i => i.product.id === id ? { ...i, quantity: qty } : i);
            if (qty <= 0) setSelectedItemIds(ids => ids.filter(i => i !== id));
            return { items: newItems, totalPrice: calculateTotalPrice(newItems) };
        });
    }, []);

    const toggleItemSelected = useCallback((id: number) => {
        setSelectedItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }, []);

    const toggleSelectAll = useCallback(() => {
        setSelectedItemIds(prev => prev.length === cart.items.length && cart.items.length > 0 ? [] : cart.items.map(i => i.product.id as number));
    }, [cart.items]);

    const totalSelectedPrice = useMemo(() => {
        return cart.items.filter(i => selectedItemIds.includes(i.product.id as number))
            .reduce((t, i) => t + i.product.price * i.quantity, 0);
    }, [cart.items, selectedItemIds]);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, selectedItemIds, toggleItemSelected, toggleSelectAll, totalSelectedPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};