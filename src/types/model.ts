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
export interface Message {
    id?: number;
    userId: number | string;
    content: string;
    sender: 'user' | 'admin' | 'bot';
    createdAt: string;
}
export interface ProductGridProps {
    products: any[];
    totalCount: number;
    sortOption: string;
    onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    title: string;
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
}
 export interface FAQItem {
    id: string;
    keywords: string[];
    action: string;
    responseText: string;
    targetCategory?: string; // Có dấu ? vì không phải mục nào cũng có
    categoryId?: string;     // Có dấu ? vì không phải mục nào cũng có
}

