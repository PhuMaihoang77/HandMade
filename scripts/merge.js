const fs = require('fs');
const path = require('path');

const mockDataDir = path.join(__dirname, '../src/mock-data');
const dbFile = path.join(__dirname, '../db.json');

// --- 1. Đọc dữ liệu cũ từ db.json (Nơi chứa Wishlist và Reviews thật) ---
let oldDbData = { products: [], messages: [], faq: [], reviews: [], users: [] };
if (fs.existsSync(dbFile)) {
  try {
    oldDbData = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  } catch (e) {
    console.warn("⚠️ Không thể đọc db.json cũ.");
  }
}

const db = {
  ...oldDbData, // Mặc định giữ lại tất cả (Reviews, Users kèm Wishlist)
  products: [], // Reset để nạp sản phẩm mới từ mock-data
};

if (!fs.existsSync(mockDataDir)) {
  console.error(`❌ Thư mục ${mockDataDir} không tồn tại!`);
  process.exit(1);
}

const readJsonFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (!fileContent.trim()) return [];
    const data = JSON.parse(fileContent);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    return [];
  }
};

// 2. Quét thư mục mock-data
const items = fs.readdirSync(mockDataDir);

items.forEach(item => {
  const itemPath = path.join(mockDataDir, item);
  const stat = fs.statSync(itemPath);

  if (stat.isDirectory() && item === 'products') {
    const productFiles = fs.readdirSync(itemPath);
    productFiles.forEach(file => {
      if (path.extname(file) === '.json') {
        db.products.push(...readJsonFile(path.join(itemPath, file)));
      }
    });
  } 
  else if (stat.isFile() && path.extname(item) === '.json') {
    const resourceName = path.basename(item, '.json');
    const finalKey = resourceName === 'massage' ? 'messages' : resourceName;

    // QUAN TRỌNG: Logic để không làm mất Yêu thích (Wishlist)
    if (finalKey === 'users') {
      const mockUsers = readJsonFile(itemPath);
      
      // So khớp: Giữ lại wishlist từ db.json cũ cho từng user
      db.users = mockUsers.map(mUser => {
        const existingUser = oldDbData.users?.find(u => u.id === mUser.id || u.email === mUser.email);
        return {
          ...mUser,
          wishlist: existingUser?.wishlist || mUser.wishlist || [] // Ưu tiên wishlist cũ
        };
      });
    } 
    // Không ghi đè reviews từ mock-data nếu db.json đã có reviews
    else if (finalKey === 'reviews') {
      db.reviews = oldDbData.reviews && oldDbData.reviews.length > 0 
                   ? oldDbData.reviews 
                   : readJsonFile(itemPath);
    }
    else {
      db[finalKey] = readJsonFile(itemPath);
    }
  }
});

// 3. Ghi lại file db.json
if (JSON.stringify(db) !== JSON.stringify(oldDbData)) {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    console.log(`✅ Đã đồng bộ thành công!`);
    console.log(`   - Bảo toàn Wishlist cho ${db.users.length} người dùng.`);
    console.log(`   - Bảo toàn ${db.reviews.length} đánh giá.`);
  } catch (error) {
    console.error('❌ Lỗi ghi file:', error);
  }
} else {
  console.log(`ℹ️ Không có thay đổi dữ liệu.`);
}