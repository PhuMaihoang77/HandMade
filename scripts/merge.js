const fs = require('fs');
const path = require('path');

const mockDataDir = path.join(__dirname, '../src/mock-data');
const dbFile = path.join(__dirname, '../db.json');

// 1. Khởi tạo cấu trúc db mặc định
const db = {
  products: [],
  messages: [], // Sửa: Khởi tạo mảng rỗng thay vì dùng biến chưa định nghĩa
  faq: [] ,
   vouchers: []  ,
   prizes:[]    // Thêm sẵn faq để bot tra cứu
};

if (!fs.existsSync(mockDataDir)) {
  console.error(`❌ Thư mục ${mockDataDir} không tồn tại!`);
  process.exit(1);
}

// 2. Hàm đọc file JSON an toàn
const readJsonFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (!fileContent.trim()) return [];
    const data = JSON.parse(fileContent);
    // Đảm bảo dữ liệu trả về là mảng nếu file chứa mảng
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error(`⚠️ Lỗi cú pháp trong file "${path.basename(filePath)}". Bỏ qua.`);
    return [];
  }
};

// 3. Quét và Merge dữ liệu
const items = fs.readdirSync(mockDataDir);

items.forEach(item => {
  const itemPath = path.join(mockDataDir, item);
  const stat = fs.statSync(itemPath);

  // A: Xử lý thư mục "products" (Gom nhiều file sản phẩm nhỏ)
  if (stat.isDirectory() && item === 'products') {
    console.log('📂 Đang quét thư mục products...');
    const productFiles = fs.readdirSync(itemPath);

    productFiles.forEach(file => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(itemPath, file);
        const data = readJsonFile(filePath);
        db.products.push(...data);
      }
    });
  }
  // B: Xử lý các file lẻ (messages.json, faq.json, users.json...)
  else if (stat.isFile() && path.extname(item) === '.json') {
    const resourceName = path.basename(item, '.json');
    // Đặc biệt xử lý cho messages vì bạn dùng tên massage.json
    const finalKey = resourceName === 'massage' ? 'messages' : resourceName;
    const data = readJsonFile(itemPath);
    db[finalKey] = data;
  }
});

// 4. Ghi file db.json (Chỉ ghi nếu có thay đổi)
let oldData = null;
if (fs.existsSync(dbFile)) {
  try {
    oldData = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  } catch (e) { oldData = null; }
}

if (JSON.stringify(db) !== JSON.stringify(oldData)) {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    console.log(`✅ Merge thành công!`);
    console.log(`   - Tổng sản phẩm: ${db.products.length}`);
    console.log(`   - Endpoints: ${Object.keys(db).map(k => '/' + k).join(', ')}`);
  } catch (error) {
    console.error('❌ Lỗi khi ghi file db.json:', error);
  }
} else {
  console.log(`ℹ️ Dữ liệu không thay đổi.`);
}