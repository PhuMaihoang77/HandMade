import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
// Import các Interfaces từ file model của bạn
import { Product, Cart, CartItem } from '../types/model';

// 1. Định nghĩa Kiểu dữ liệu cho Context
interface CartContextType {
    cart: Cart;
    addToCart: (product: Product) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
    // Thêm hàm quản lý sidebar để mở/đóng Giỏ hàng overlay
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

// 2. Trạng thái Giỏ hàng Mặc định
const initialCart: Cart = {
    items: [],
    totalPrice: 0,
};

// 3. Tạo Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hàm phụ trợ: Tính lại Tổng giá
const calculateTotalPrice = (currentItems: CartItem[]): number => {
    // Dùng reduce để tính tổng giá trị (giá * số lượng)
    return currentItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

// 4. Component CartProvider
interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart>(initialCart);
    const [isCartOpen, setIsCartOpen] = useState(false); // Trạng thái mở/đóng sidebar

    // Logic THÊM SẢN PHẨM VÀO GIỎ
    const addToCart = useCallback((productToAdd: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.items.find(item => item.product.id === productToAdd.id);
            let newItems: CartItem[];

            if (existingItem) {
                // Tăng số lượng nếu sản phẩm đã có
                newItems = prevCart.items.map(item =>
                    item.product.id === productToAdd.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Thêm mới nếu chưa có
                const newItem: CartItem = { product: productToAdd, quantity: 1 };
                newItems = [...prevCart.items, newItem];
            }

            // Mở sidebar khi thêm sản phẩm
            setIsCartOpen(true);

            return {
                items: newItems,
                totalPrice: calculateTotalPrice(newItems),
            };
        });
    }, []);

    // Logic CẬP NHẬT SỐ LƯỢNG (Dùng để tăng/giảm từ CartSidebar)
    const updateQuantity = useCallback((productId: number, newQuantity: number) => {
        setCart(prevCart => {
            let newItems: CartItem[];

            if (newQuantity <= 0) {
                // Xóa sản phẩm nếu số lượng <= 0
                newItems = prevCart.items.filter(item => item.product.id !== productId);
            } else {
                // Cập nhật số lượng
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
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, isCartOpen, setIsCartOpen }}>
            {children}
        </CartContext.Provider>
    );
};

// 5. Custom Hook để sử dụng Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};