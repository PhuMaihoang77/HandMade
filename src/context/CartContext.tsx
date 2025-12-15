import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product, Cart, CartItem } from '../types/model';

interface CartContextType {
    cart: Cart;
    addToCart: (product: Product) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
}

const initialCart: Cart = {
    items: [],
    totalPrice: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotalPrice = (currentItems: CartItem[]): number => {
    return currentItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart>(initialCart);

    const addToCart = useCallback((productToAdd: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.items.find(item => item.product.id === productToAdd.id);
            let newItems: CartItem[];

            if (existingItem) {
                newItems = prevCart.items.map(item =>
                    item.product.id === productToAdd.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                const newItem: CartItem = { product: productToAdd, quantity: 1 };
                newItems = [...prevCart.items, newItem];
            }

            return {
                items: newItems,
                totalPrice: calculateTotalPrice(newItems),
            };
        });
    }, []);

    const updateQuantity = useCallback((productId: number, newQuantity: number) => {
        setCart(prevCart => {
            let newItems: CartItem[];

            if (newQuantity <= 0) {
                newItems = prevCart.items.filter(item => item.product.id !== productId);
            } else {
                newItems = prevCart.items.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }

            return {
                items: newItems,
                totalPrice: calculateTotalPrice(newItems),
            };
        });
    }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};