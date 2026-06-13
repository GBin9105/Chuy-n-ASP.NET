import axiosClient from '../api/axiosClient';

const productService = {
    // Lấy toàn bộ sản phẩm
    getAllProducts: () => {
        return axiosClient.get('/Products');
    }
};

export default productService;