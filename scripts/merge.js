
const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục data gốc
const dataDir = path.join(__dirname, '../mock-data');
const outputFile = path.join(__dirname, '../db.json');

// Hàm đọc file json
const readJson = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Lỗi đọc file ${filePath}:`, err);
        return [];
    }
};

// 1. Gộp Products từ nhiều file con (laptops, phones...)
const productDir = path.join(dataDir, 'products');
let allProducts = [];
fs.readdirSync(productDir).forEach(file => {
    if (file.endsWith('.json')) {
        const products = readJson(path.join(productDir, file));
        allProducts = [...allProducts, ...products];
    }
});

// 2. Đọc các file đơn lẻ khác
const users = readJson(path.join(dataDir, 'users.json'));
const categories = readJson(path.join(dataDir, 'categories.json'));
const orders = readJson(path.join(dataDir, 'orders.json'));

// 3. Tạo object tổng
const dbData = {
    users: users,
    products: allProducts, // Đã gộp tất cả sản phẩm vào 1 endpoint /products
    categories: categories,
    orders: orders
};

// 4. Ghi ra file db.json
fs.writeFileSync(outputFile, JSON.stringify(dbData, null, 2));

console.log(`🎉 Đã merge dữ liệu thành công! Tổng: ${allProducts.length} sản phẩm.`);
console.log(`📌 Truy cập API tại: http://localhost:5000`);
