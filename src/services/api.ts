// src/services/api.ts
import axios from 'axios';

// Tạo một instance axios với cấu hình mặc định
const api = axios.create({
    baseURL: 'http://localhost:5000',//port 5000
    timeout: 10000, // Quá 10s thì báo lỗi
    headers: {
        'Content-Type': 'application/json',
    },
});

// (Tùy chọn) Interceptor để xử lý lỗi mạng chung
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message === "Network Error") {
            console.error("❌ Không kết nối được json-server!");
        }
        return Promise.reject(error);
    }
);

export default api;