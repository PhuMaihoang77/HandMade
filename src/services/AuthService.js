import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

// === ĐĂNG KÝ ===
export const registerUser = async (userData) => {
    try {
        // Kiểm tra email trùng
        const exist = await axios.get(`${API_URL}?email=${encodeURIComponent(userData.email)}`);

        if (exist.data.length > 0) {
            throw new Error("Email đã tồn tại!");
        }

        // Nếu không trùng → tạo mới
        const response = await axios.post(API_URL, userData);
        return response.data;

    } catch (error) {
        if (error.message === "Network Error") {
            throw new Error("Không kết nối được server. Hãy kiểm tra json-server.");
        }
        throw error;
    }
};

// === ĐĂNG NHẬP ===
export const loginUser = async (email, password) => {
    try {
        const response = await axios.get(
            `${API_URL}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        );

        if (response.data.length > 0) {
            return response.data[0]; // Đăng nhập thành công
        }
        throw new Error("Email hoặc mật khẩu không chính xác.");

    } catch (error) {
        if (error.message === "Network Error") {
            throw new Error("Không thể kết nối server!");
        }
        throw error;
    }
};

// === QUÊN MẬT KHẨU (Fake) ===
export const forgotPassword = async (email) => {
    console.log(`[Fake] Đã gửi email reset cho: ${email}`);
    await new Promise(res => setTimeout(res, 1500));
    return true;
};
