import React from 'react';
import ProductCard, { Product } from './ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Styles/layout.css';
import '../Styles/product.css';

const emptyProducts: Product[] = [
    { id: 1, name: "Tên Sản Phẩm Handmade", price: 100000, imageUrl: "", description: "Mô tả ngắn gọn về sản phẩm thủ công." },
    { id: 2, name: "Tên Sản Phẩm Handmade", price: 100000, imageUrl: "", description: "Mô tả ngắn gọn về sản phẩm thủ công." },
    { id: 3, name: "Tên Sản Phẩm Handmade", price: 100000, imageUrl: "", description: "Mô tả ngắn gọn về sản phẩm thủ công." },
];

interface HomeProps {
    currentUser: { username: string } | null;
    onSwitchToLogin: () => void;
    onSwitchToRegister: () => void;
    onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({
    currentUser,
    onSwitchToLogin,
    onSwitchToRegister,
    onLogout
}) => {

    return (
        <div className="app-layout">

            {/* ⭐ Header tách riêng */}
            <Header
                currentUser={currentUser}
                onSwitchToLogin={onSwitchToLogin}
                onLogout={onLogout}
            />

            <main className="product-grid">
                <h2>Khung Bố Cục Sản Phẩm</h2>

                <div className="product-list-wrapper">
                    {emptyProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>

            {/* ⭐ Footer tách riêng */}
            <Footer />
        </div>
    );
};

export default Home;
