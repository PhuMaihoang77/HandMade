import React from 'react';
import ProductCard from './ProductCard';
import { User } from '../types/model';
interface ProductGridProps {
    products: any[];
    totalCount: number;
    currentUser?: User | null;
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

const ProductGrid: React.FC<ProductGridProps> = ({ 
    products, totalCount, sortOption, onSortChange, title, loading, error, pagination 
}) => {
    if (loading) return <div className="loading-spinner">Đang tải...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <main className="shop-main">
            <div className="shop-toolbar">
                <h1>{title}</h1>
                <div className="toolbar-actions">
                    <span className="count-label">Tìm thấy {totalCount} sp</span>
                    <select value={sortOption} onChange={onSortChange} className="sort-select">
                        <option value="default">Sắp xếp: Mặc định</option>
                        <option value="price-asc">Giá: Thấp đến Cao</option>
                        <option value="price-desc">Giá: Cao đến Thấp</option>
                        <option value="name-asc">Tên: A - Z</option>
                    </select>
                </div>
            </div>
            <div className="pro-product-grid">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
            {pagination.totalPages > 1 && (
                <div className="pro-pagination">
                    <button onClick={() => pagination.onPageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>&larr;</button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
                        <button key={num} className={pagination.currentPage === num ? 'active' : ''} onClick={() => pagination.onPageChange(num)}>{num}</button>
                    ))}
                    <button onClick={() => pagination.onPageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>&rarr;</button>
                </div>
            )}
        </main>
    );
};
export default ProductGrid;