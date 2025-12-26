// src/hooks/useProductFeatures.ts
import { useState, useMemo, useEffect } from 'react';
import { Product } from '../types/model';

interface UseProductFeaturesProps {
    products: Product[] | null;
    itemsPerPage?: number;
    searchQuery?: string; // Thêm search query
}

// --- THÊM "export" VÀO ĐÂY ---
export const PRICE_RANGES = [
    { id: 'under-100', label: 'Dưới 100k', min: 0, max: 100000 },
    { id: '100-500', label: '100k - 500k', min: 100000, max: 500000 },
    { id: 'over-500', label: 'Trên 500k', min: 500000, max: Infinity },
];

export const useProductFeatures = ({ products, itemsPerPage = 9, searchQuery = '' }: UseProductFeaturesProps) => {
    const [sortOption, setSortOption] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);

    // Logic Filter & Sort
    const filteredProducts = useMemo(() => {
        let result = products ?? [];

        // Lọc theo Search Query - Tìm kiếm trong nhiều trường
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter(p => {
                // Tìm trong tên sản phẩm
                const nameMatch = p.name.toLowerCase().includes(query);
                // Tìm trong mô tả
                const descMatch = p.description.toLowerCase().includes(query);
                // Tìm trong tên danh mục
                const categoryMatch = p.category.toLowerCase().includes(query);
                // Tìm theo giá (nếu query là số)
                const priceMatch = !isNaN(Number(query)) && 
                    p.price.toString().includes(query.replace(/[^\d]/g, ''));
                // Tìm theo ID (nếu query là số)
                const idMatch = !isNaN(Number(query)) && 
                    p.id.toString().includes(query.replace(/[^\d]/g, ''));
                
                return nameMatch || descMatch || categoryMatch || priceMatch || idMatch;
            });
        }

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
    }, [products, searchQuery, selectedCategoryId, selectedPriceRange]);

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

    // Reset về trang 1 khi search query thay đổi
    useEffect(() => {
        if (searchQuery) {
            setCurrentPage(1);
        }
    }, [searchQuery]);

    return {
        currentProducts: paginatedProducts,
        totalCount: filteredProducts.length,
        currentPage,
        totalPages,
        sortOption,
        selectedCategoryId,
        selectedPriceRange,
        searchQuery, // Trả về search query để hiển thị
        handleCategoryChange,
        handleSortChange,
        handlePriceChange,
        setCurrentPage,
    };
};