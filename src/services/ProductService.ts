
import { Product } from '../Pages/ProductCard';

// Nếu bạn dùng create-react-app hoặc Vite, import trực tiếp JSON cũng được:
import productsData from '../mock-data/products/tui_vi.json';

export const getProducts = async (): Promise<Product[]> => {
    // Nếu muốn giả lập fetch từ API
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(productsData);
        }, 300); // mô phỏng delay 300ms
    });
};
