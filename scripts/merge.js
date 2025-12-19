// 
const fs = require('fs');
const path = require('path');

const mockDataDir = path.join(__dirname, '../src/mock-data');
const dbFile = path.join(__dirname, '../db.json');

const db = {
  products: [], 
  
};

if (!fs.existsSync(mockDataDir)) {
  console.error(` Thư mục ${mockDataDir} không tồn tại!`);
  process.exit(1);
}

// 3. Hàm đọc file JSON an toàn
const readJsonFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (!fileContent.trim()) return []; // Trả về mảng rỗng nếu file trống
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(` Lỗi cú pháp trong file "${path.basename(filePath)}". Bỏ qua.`);
    return [];
  }
};

// 4. Quét và Merge dữ liệu
const items = fs.readdirSync(mockDataDir);

items.forEach(item => {
  const itemPath = path.join(mockDataDir, item);
  const stat = fs.statSync(itemPath);

  // === TRƯỜNG HỢP A: Xử lý thư mục "products" ===
  // Gom tất cả file trong folder này vào mảng db.products
  if (stat.isDirectory() && item === 'products') {
    console.log(' Đang quét thư mục products...');
    const productFiles = fs.readdirSync(itemPath);

    productFiles.forEach(file => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(itemPath, file);
        const data = readJsonFile(filePath);
        
        if (Array.isArray(data)) {
          db.products.push(...data); // Nối mảng vào danh sách chung
        }
      }
    });
  }

  // === TRƯỜNG HỢP B: Xử lý các file lẻ (users.json, categories.json...) ===
  // Giữ nguyên tên file làm endpoint (VD: users.json -> /users)
  else if (stat.isFile() && path.extname(item) === '.json') {
    const resourceName = path.basename(item, '.json');
    const data = readJsonFile(itemPath);
    db[resourceName] = data;
  }
});

// 5. Ghi file db.json (Chỉ ghi nếu có thay đổi)
let oldData = null;
if (fs.existsSync(dbFile)) {
  try {
    oldData = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  } catch (e) { oldData = null; }
}

// So sánh sơ bộ (độ chính xác tương đối để tránh ghi liên tục)
if (JSON.stringify(db) !== JSON.stringify(oldData)) {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    console.log(` Merge thành công!`);
    console.log(`   - Tổng sản phẩm: ${db.products.length}`);
    console.log(`   - Các endpoints: /products, ${Object.keys(db).filter(k => k !== 'products').map(k => '/' + k).join(', ')}`);
    console.log(`   - Thời gian: ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error(' Lỗi khi ghi file db.json:', error);
  }
} else {
  console.log(`ℹ Dữ liệu không thay đổi.`);
}