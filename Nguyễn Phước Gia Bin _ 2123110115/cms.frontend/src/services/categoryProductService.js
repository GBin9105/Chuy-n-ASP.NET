import axiosClient from '../api/axiosClient';

const categoryProductService = {
    // Hàm gọi API lấy toàn bộ danh mục sản phẩm (Khoan pin, Máy mài...)
    getAllCategoryProducts: () => {
        const url = '/CategoriesProducts'; // Tên này phải khớp với Controller bên Backend
        return axiosClient.get(url);
    }
};

export default categoryProductService;