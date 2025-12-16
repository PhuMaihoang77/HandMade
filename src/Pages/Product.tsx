// src/Pages/Product.tsx
import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/model';
import { useProducts } from '../hooks/useProducts';
// 1. Import thêm PRICE_RANGES
import { useProductFeatures, PRICE_RANGES } from '../hooks/useProductFeatures';
import categories from '../mock-data/categories.json';
import '../Styles/layout.css';
import '../Styles/product.css';

interface ProductProps {
    currentUser: User | null;
}

const Product: React.FC<ProductProps> = ({ currentUser }) => {
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();
    
    // 2. Lấy thêm selectedPriceRange và handlePriceChange ở đây
    const { 
        currentProducts, totalCount, currentPage, totalPages, sortOption, selectedCategoryId,
        selectedPriceRange, // <--- THÊM VÀO
        handleCategoryChange, handleSortChange, handlePriceChange, // <--- THÊM VÀO
        setCurrentPage 
    } = useProductFeatures({ products, itemsPerPage: 9 });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    return (
        <div className="shop-container">
            {/* ... Phần Header giữ nguyên ... */}
            <div className="shop-header">
                <div className="shop-breadcrumb">
                    <span onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Trang chủ</span> 
                    {' / '} 
                    <span style={{color: '#333'}}>Sản phẩm</span>
                </div>
                {currentUser && (
                    <div className="user-welcome">
                        Xin chào, {currentUser.username}
                    </div>
                )}
            </div>

            <div className="shop-layout">
                <aside className="shop-sidebar">
                    {/* ... Phần Danh Mục giữ nguyên ... */}
                    <div className="filter-group">
                        <h3>Danh Mục</h3>
                        <ul className="category-list">
                            <li>
                                <button
                                    className={selectedCategoryId === 'all' ? 'active' : ''}
                                    onClick={() => handleCategoryChange('all')}
                                >
                                    Tất cả sản phẩm
                                </button>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        className={selectedCategoryId === cat.id ? 'active' : ''}
                                        onClick={() => handleCategoryChange(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Phần Khoảng Giá */}
                    <div className="filter-group">
                        <h3>Khoảng Giá</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* Bây giờ PRICE_RANGES đã được import nên sẽ không lỗi */}
                            {PRICE_RANGES.map(range => (
                                <label
                                    key={range.id}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#555'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        // selectedPriceRange và handlePriceChange đã được khai báo
                                        checked={selectedPriceRange.includes(range.id)}
                                        onChange={() => handlePriceChange(range.id)}
                                    />
                                    {range.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="shop-main">
                    {/* ... Phần Main Content giữ nguyên ... */}
                    <div className="shop-toolbar">
                       <h1>
                            {selectedCategoryId === 'all'
                                ? 'Bộ Sưu Tập'
                                : categories.find(c => c.id === selectedCategoryId)?.name}
                        </h1>

                        <div className="toolbar-actions">
                            <span className="count-label">Tìm thấy {totalCount} sp</span>
                            <select value={sortOption} onChange={handleSortChange} className="sort-select">
                                <option value="default">Sắp xếp: Mặc định</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao đến Thấp</option>
                                <option value="name-asc">Tên: A - Z</option>
                            </select>
                        </div>
                    </div>

                    {loading && <div className="loading-spinner">Đang tải...</div>}
                    {error && <div className="error-message">{error}</div>}
                    
                    {!loading && !error && (
                        <>
                            <div className="pro-product-grid">
                                {currentProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            
                            {/* ... Phần Pagination giữ nguyên ... */}
                            {totalPages > 1 && (
                                <div className="pro-pagination">
                                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&larr;</button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                        <button key={num} className={currentPage === num ? 'active' : ''} onClick={() => setCurrentPage(num)}>{num}</button>
                                    ))}
                                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>&rarr;</button>
                                </div>
                            )}

                            {currentProducts.length === 0 && (
                                <div className="empty-state">
                                    <p>Không tìm thấy sản phẩm nào.</p>
                                    <button onClick={() => { handleCategoryChange('all'); handlePriceChange(''); }} className="view-all-btn">Xóa bộ lọc</button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Product;