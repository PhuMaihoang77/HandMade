// src/hooks/useProductFeatures.ts
import { useState, useMemo } from 'react';
import { Product } from '../types/model';

interface UseProductFeaturesProps {
    products: Product[] | null;
    itemsPerPage?: number;
}

// --- THÊM "export" VÀO ĐÂY ---
export const PRICE_RANGES = [
    { id: 'under-100', label: 'Dưới 100k', min: 0, max: 100000 },
    { id: '100-500', label: '100k - 500k', min: 100000, max: 500000 },
    { id: 'over-500', label: 'Trên 500k', min: 500000, max: Infinity },
];

export const useProductFeatures = ({ products, itemsPerPage = 9 }: UseProductFeaturesProps) => {
    // ... (Giữ nguyên phần logic bên trong) ...
    const [sortOption, setSortOption] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);

    // Logic Filter & Sort giữ nguyên như code của bạn
    const filteredProducts = useMemo(() => {
        let result = products ?? [];

        // Lọc Category
        if (selectedCategoryId !== 'all') {
            result = result.filter(p => p.categoryId === selectedCategoryId);
        }

        // Lọc Price
        if (selectedPriceRange.length > 0) {
            result = result.filter(product =>
                selectedPriceRange.some(rangeId => {
                    const range = PRICE_RANGES.find(r => r.id === rangeId);
                    if (!range) return false;
                    return product.price >= range.min && product.price < range.max;
                })
            );
        }
        return result;
    }, [products, selectedCategoryId, selectedPriceRange]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];
        switch (sortOption) {
            case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
            case 'name-asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
            default: return sorted;
        }
    }, [filteredProducts, sortOption]);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedProducts.slice(start, start + itemsPerPage);
    }, [sortedProducts, currentPage, itemsPerPage]);

    const handleCategoryChange = (categoryId: number | 'all') => {
        setSelectedCategoryId(categoryId);
        setCurrentPage(1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
        setCurrentPage(1);
    };

    const handlePriceChange = (rangeId: string) => {
        setCurrentPage(1);
        setSelectedPriceRange(prev =>
            prev.includes(rangeId)
                ? prev.filter(id => id !== rangeId)
                : [...prev, rangeId]
        );
    };

    return {
        currentProducts: paginatedProducts,
        totalCount: filteredProducts.length,
        currentPage,
        totalPages,
        sortOption,
        selectedCategoryId,
        selectedPriceRange, // Đã return đúng
        handleCategoryChange,
        handleSortChange,
        handlePriceChange,  // Đã return đúng
        setCurrentPage,
    };
};