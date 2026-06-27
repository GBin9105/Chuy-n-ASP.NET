import axiosClient from '../api/axiosClient';

const productService = {
    // ========================================================
    // 1. LẤY DANH SÁCH SẢN PHẨM (CÓ HỖ TRỢ BỘ LỌC)
    // Nhận vào biến filters (ví dụ: { categoryProductId: 1, minPrice: 500000 })
    // ========================================================
    getAllProducts: async (filters = {}) => {
        try {
            // Truyền filters vào mục params để Axios tự băm thành Query String (?categoryProductId=1...)
            const response = await axiosClient.get('/Products', { params: filters });
            
            // Trả về dữ liệu (tùy thuộc vào cấu hình interceptor của axiosClient mà lấy .data hay không)
            return response.data ? response.data : response;
        } catch (error) {
            console.error("Lỗi API getAllProducts:", error);
            throw error;
        }
    },

    // ========================================================
    // 2. LẤY CHI TIẾT MỘT SẢN PHẨM THEO ID
    // Dùng cho trang ProductDetail để hiển thị thông tin và chặn mua vượt kho
    // ========================================================
    getProductById: async (id) => {
        try {
            const response = await axiosClient.get(`/Products/${id}`);
            return response.data ? response.data : response;
        } catch (error) {
            console.error(`Lỗi API getProductById với ID ${id}:`, error);
            throw error;
        }
    }
};

export default productService;