// Đảm bảo đường dẫn import axiosClient đúng với cấu trúc của bạn
import axiosClient from '../api/axiosClient'; 

const postService = {
    // 1. Lấy danh sách bài viết (Có hỗ trợ truyền tham số lọc)
    getAllPosts: async (filters = {}) => {
        try {
            const response = await axiosClient.get('/Posts', { params: filters });
            return response.data ? response.data : response;
        } catch(error) {
            console.error("Lỗi API getAllPosts:", error);
            throw error;
        }
    },

    // 2. Lấy chi tiết 1 bài viết theo ID
    getPostById: async (id) => {
        try {
            const response = await axiosClient.get(`/Posts/${id}`);
            return response.data ? response.data : response;
        } catch(error) {
            console.error(`Lỗi API getPostById với ID ${id}:`, error);
            throw error;
        }
    },

    // 3. Lấy toàn bộ danh mục bài viết tin tức
    getAllCategories: async () => {
        try {
            // Nhớ khớp với API CategoryPostsController bên C#
            const response = await axiosClient.get('/CategoryPosts');
            return response.data ? response.data : response;
        } catch(error) {
            console.error("Lỗi API getAllCategories:", error);
            throw error;
        }
    }
};

export default postService;