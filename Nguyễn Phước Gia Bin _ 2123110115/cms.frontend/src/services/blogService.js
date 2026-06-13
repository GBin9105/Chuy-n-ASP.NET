import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm cũ: Lấy toàn bộ bài viết tin tức
    getAllPosts: () => {
        const url = '/Posts'; 
        return axiosClient.get(url);
    },

    // 2. THÊM MỚI CHO BUỔI 8: Lấy danh sách các Chủ đề bài viết (Category)
    getBlogCategories: () => {
        const url = '/Categories'; // Đảm bảo API này khớp với Backend của bạn
        return axiosClient.get(url);
    }
};

export default blogService;