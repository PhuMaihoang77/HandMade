// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { getProducts } from '../services/ProductService';
import { Product } from '../types/model';

// Hook này chịu trách nhiệm: Gọi API, Quản lý Loading, Quản lý Lỗi
export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // Thêm state lỗi để chuyên nghiệp hơn

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error("Lỗi tải sản phẩm:", err);
                setError("Không thể tải danh sách sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Trả về dữ liệu cần thiết cho Component dùng
    return { products, loading, error };
};
export const getTimeRemaining = (targetDate: Date) => {
    const total = targetDate.getTime() - new Date().getTime();

    const seconds = Math.max(Math.floor((total / 1000) % 60), 0);
    const minutes = Math.max(Math.floor((total / 1000 / 60) % 60), 0);
    const hours = Math.max(Math.floor((total / (1000 * 60 * 60)) % 24), 0);
    const days = Math.max(Math.floor(total / (1000 * 60 * 60 * 24)), 0);

    return { total, days, hours, minutes, seconds };
};