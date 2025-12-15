import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Product, Cart, CartItem } from '../types/model';

interface CartContextType {
    cart: Cart;
    addToCart: (product: Product) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;

    selectedItemIds: number[];
    toggleItemSelected: (productId: number) => void;
    toggleSelectAll: () => void;
    totalSelectedPrice: number;
}

const initialCart: Cart = {
    items: [],
    totalPrice: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotalPrice = (currentItems: CartItem[]): number => {
    return currentItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const calculateSelectedTotalPrice = (currentItems: CartItem[], selectedIds: number[]): number => {
    return currentItems.reduce((total, item) => {
        if (selectedIds.includes(item.product.id as number)) {
            return total + item.product.price * item.quantity;
        }
        return total;
    }, 0);
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart>(initialCart);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

    const toggleItemSelected = useCallback((productId: number) => {
        setSelectedItemIds(prevIds => {
            if (prevIds.includes(productId)) {
                return prevIds.filter(id => id !== productId);
            } else {
                return [...prevIds, productId];
            }
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        setSelectedItemIds(prevIds => {
            if (prevIds.length === cart.items.length && cart.items.length > 0) {
                return [];
            } else {
                return cart.items.map(item => item.product.id as number);
            }
        });
    }, [cart.items.length]);

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

                setSelectedItemIds(prevIds => [...prevIds, productToAdd.id as number]);
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

                setSelectedItemIds(prevIds => prevIds.filter(id => id !== productId));
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

    const totalSelectedPrice = useMemo(() => {
        return calculateSelectedTotalPrice(cart.items, selectedItemIds);
    }, [cart.items, selectedItemIds]);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            selectedItemIds,
            toggleItemSelected,
            toggleSelectAll,
            totalSelectedPrice
        }}>
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