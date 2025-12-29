// src/hooks/useProductDetail.ts
import { useState, useEffect } from 'react';
import { Product, Review } from '../types/model';
import { getProductById, getReviewsByProductId, postReview } from '../services/ProductService';

export const useProductDetail = (id: string | undefined) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const productId = Number(id);
                // Chạy song song cả lấy sản phẩm và lấy review để tối ưu tốc độ
                const [productData, reviewsData] = await Promise.all([
                    getProductById(productId),
                    getReviewsByProductId(productId)
                ]);

                if (productData) {
                    setProduct(productData);
                    setReviews(reviewsData);
                } else {
                    setError("Không tìm thấy sản phẩm.");
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const addReview = async (reviewData: { userName: string; rating: number; comment: string }) => {
        const newReview: Omit<Review, 'id'> = {
            productId: Number(id),
            userName: reviewData.userName,
            rating: reviewData.rating,
            comment: reviewData.comment,
            createdAt: new Date().toLocaleString('vi-VN'),
        };

        const result = await postReview(newReview);
        if (result) {
            setReviews(prev => [result, ...prev]); // Cập nhật UI ngay lập tức
        }
    };

    return { product, reviews, loading, error, addReview };
};