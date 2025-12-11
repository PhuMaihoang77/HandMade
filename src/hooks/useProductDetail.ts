// src/hooks/useProductDetail.ts
import { useState, useEffect } from 'react';
import { Product } from '../Pages/ProductCard';
import { getProductById } from '../services/ProductService'; // Import hàm mới

export const useProductDetail = (id: string | undefined) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) {
                setError("ID sản phẩm không hợp lệ");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Ép kiểu ID từ string sang number để so sánh
                const data = await getProductById(Number(id));
                if (data) {
                    setProduct(data);
                } else {
                    setError("Không tìm thấy sản phẩm này.");
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải thông tin sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    return { product, loading, error };
};