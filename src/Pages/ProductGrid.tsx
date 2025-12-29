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
    pagination: any;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
    products, totalCount, currentUser, sortOption, onSortChange, title, loading, error, pagination 
}) => {
    if (loading) return <div>Đang tải...</div>;

    return (
        <main className="shop-main">
            {/* ... toolbar ... */}
            <div className="pro-product-grid">
                {products.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        currentUser={currentUser??null} // TRUYỀN DỮ LIỆU VÀO ĐÂY
                    />
                ))}
            </div>
            {/* ... pagination ... */}
        </main>
    );
};
export default ProductGrid;