const fs = require('fs');
const path = require('path');

const mockDataDir = path.join(__dirname, '../src/mock-data');
const dbFile = path.join(__dirname, '../db.json');

const db = {};

// Kiểm tra thư mục mock-data
if (!fs.existsSync(mockDataDir)) {
  console.error(`❌ Thư mục ${mockDataDir} không tồn tại!`);
  process.exit(1);
}

// Đọc các file JSON trong mock-data
fs.readdirSync(mockDataDir).forEach(file => {
  if (path.extname(file) === '.json') {
    const resourceName = path.basename(file, '.json');
    const filePath = path.join(mockDataDir, file);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      if (!fileContent.trim()) {
        console.warn(`⚠️  File "${file}" trống. Khởi tạo mảng rỗng cho "/${resourceName}".`);
        db[resourceName] = [];
        return;
      }

      db[resourceName] = JSON.parse(fileContent);

    } catch (error) {
      console.error(`❌ Lỗi cú pháp trong file "${file}". Khởi tạo mảng rỗng.`);
      db[resourceName] = [];
    }
  }
});

// Kiểm tra dữ liệu cũ nếu db.json tồn tại
let oldData = null;
if (fs.existsSync(dbFile)) {
  try {
    oldData = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  } catch (error) {
    oldData = null;
  }
}

// So sánh dữ liệu mới và cũ
const isDataChanged = JSON.stringify(db) !== JSON.stringify(oldData);

if (isDataChanged) {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    console.log(`✅ Merge thành công! Dữ liệu đã được cập nhật vào db.json lúc ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error('❌ Lỗi khi ghi file db.json:', error);
  }
} else {
  console.log(`ℹ️ Dữ liệu không thay đổi. Không ghi lại db.json.`);
}
