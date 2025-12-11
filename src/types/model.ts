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
}

// Bạn cũng nên chuyển User interface vào đây luôn
export interface User {
    id: number;
    email: string;
    username: string;
    password?: string;
}