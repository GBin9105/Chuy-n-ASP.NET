import axios from 'axios';

// Khởi tạo một thực thể axios với cấu hình chung
const axiosClient = axios.create({
    baseURL: 'https://localhost:7053/api', // Đây chính là cổng Backend Power Tools của bạn!
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Chờ tối đa 10 giây
});

// Interceptor: Xử lý dữ liệu trước khi trả về cho Component
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu thành công, chỉ bóc lấy phần data bên trong
        return response.data;
    },
    (error) => {
        // Xử lý khi có lỗi (ví dụ Backend chưa chạy, lỗi 404, 500)
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;