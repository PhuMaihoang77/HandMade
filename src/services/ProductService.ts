// src/services/ProductService.ts
import api from './api';
import { Product } from '../types/model';
// 1. Lấy tất cả sản phẩm
export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error("Lỗi fetch products:", error);
        return []; // Trả về mảng rỗng nếu lỗi để không crash App
    }
};

// 2. Lấy sản phẩm theo ID (API thực thụ)
export const getProductById = async (id: number): Promise<Product | null> => {
    try {
        // json-server hỗ trợ: /products/123
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        // Nếu API trả về 404 (Không tìm thấy)
        return null;
    }
};

// 3. (Mở rộng) Lấy sản phẩm theo Category
export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
    try {
        const response = await api.get(`/products?categoryId=${categoryId}`);
        return response.data;
    } catch (error) {
        return [];
    }
};