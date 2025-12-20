// Định nghĩa Model Product dùng chung cho toàn dự án
export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    categoryId: number;
    imageUrl: string;
    description: string;
    inventory: number;
    rating?: number; 
    commentCount?: number;
}

// Bạn cũng nên chuyển User interface vào đây luôn
export interface User {
    id: number;
    email: string;
    username: string;
    password?: string;
}
export interface CartItem {
    product: Product;
    quantity: number;
}
export interface Cart{
    items: CartItem[];
    totalPrice: number;
}
export interface Category {
    id: number;
    name: string;
}
export interface PriceRange {
    id: string;
    label: string;
}
export interface Review {
    id: number;
    productId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}