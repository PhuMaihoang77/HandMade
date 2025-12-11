// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

/**
 * Đăng ký người dùng mới
 * Gửi yêu cầu POST tới json-server
 */
export const registerUser = async (userData) => {
    try {
        // json-server tự động tạo ID
        const response = await axios.post(API_URL, userData);
        return response.data;
    } catch (error) {
        console.error("Đăng ký thất bại:", error);
        // Trong môi trường fake, ta giả định lỗi do trùng lặp hoặc lỗi server
        throw new Error('Đăng ký không thành công. Email có thể đã tồn tại.');
    }
};

/**
 * Đăng nhập người dùng
 * Gửi yêu cầu GET với tham số lọc (email và password)
 */
export const loginUser = async (email, password) => {
    try {
        // Lọc người dùng theo cả email và password
        const response = await axios.get(`${API_URL}?email=${email}&password=${password}`);

        if (response.data.length > 0) {
            // Đăng nhập thành công, trả về thông tin người dùng đầu tiên tìm được
            return response.data[0];
        } else {
            // Không tìm thấy người dùng nào khớp
            throw new Error('Email hoặc mật khẩu không chính xác.');
        }
    } catch (error) {
        console.error("Đăng nhập thất bại:", error);
        throw error;
    }
};

/**
 * Quên Mật khẩu (Chỉ mô phỏng)
 */
export const forgotPassword = async (email) => {
    // Hàm này chỉ mô phỏng thành công việc gửi email đặt lại
    console.log(`[Mô phỏng] Đã gửi yêu cầu đặt lại mật khẩu cho email: ${email}`);
    // Giả lập độ trễ
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
};