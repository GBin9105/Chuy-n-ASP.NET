import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = () => {
    // 1. Khai báo state để chứa dữ liệu và trạng thái loading
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. useEffect chạy ngay khi Component vừa hiển thị để gọi API
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                // Gọi API từ Backend
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data); // Đưa dữ liệu nhận được vào state
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, []); // Mảng rỗng giúp hàm chỉ chạy 1 lần duy nhất

    // 3. Nếu đang tải dữ liệu thì hiện chữ chờ
    if (loading) {
        return <div className="text-center my-4">Đang tải danh mục...</div>;
    }

    // 4. Vẽ giao diện HTML (dùng Bootstrap)
    return (
        <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-toolbox text-warning mr-2" style={{ fontSize: '1.3rem' }}></i> DANH MỤC
                </h5>
            </div>
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {categories.length === 0 ? (
                        <div className="p-4 text-center text-muted">Không có danh mục nào.</div>
                    ) : (
                        categories.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 transition-all"
                                style={{ fontSize: '0.95rem', color: '#495057' }}
                            >
                                {/* LƯU Ý: Frontend nhận JSON sẽ tự đổi chữ cái đầu thành viết thường (camelCase) */}
                                <span className="font-weight-normal text-start">{item.name}</span>
                                <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;