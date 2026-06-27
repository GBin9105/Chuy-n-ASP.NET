import React, { useState, useEffect } from 'react';
import postService from '../../services/postService';

function BlogSidebar({ activeCategory, onFilterChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy dữ liệu danh mục khi Component vừa load
    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                setLoading(true);
                const response = await postService.getAllCategories();
                setCategories(response.data || response);
            } catch (error) {
                console.error("Thất bại khi lấy danh mục bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoriesData();
    }, []);

    return (
        <div className="card p-3 shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <h6 className="font-weight-bold text-uppercase mb-3" style={{ color: '#005088', letterSpacing: '1px' }}>
                <i className="fa-solid fa-folder-open mr-2"></i>Chủ đề Blog
            </h6>

            <div className="list-group list-group-flush">
                {/* Nút 'Tất cả bản tin' (Mặc định) */}
                <button 
                    className={`list-group-item list-group-item-action border-0 px-2 d-flex align-items-center ${activeCategory === null ? 'text-primary font-weight-bold bg-light' : 'text-secondary'}`}
                    onClick={() => onFilterChange(null)}
                    style={{ borderRadius: '8px', transition: 'all 0.2s' }}
                >
                    <i className={`fa-solid fa-chevron-right mr-2 small ${activeCategory === null ? 'opacity-100' : 'opacity-0'}`}></i>
                    Tất cả bản tin
                </button>

                {/* Vòng lặp hiển thị danh mục */}
                {loading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                    </div>
                ) : (
                    categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`list-group-item list-group-item-action border-0 px-2 d-flex align-items-center ${activeCategory === cat.id ? 'text-primary font-weight-bold bg-light' : 'text-secondary'}`}
                            onClick={() => onFilterChange(cat.id)}
                            style={{ borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px' }}
                        >
                            <i className={`fa-solid fa-chevron-right mr-2 small ${activeCategory === cat.id ? 'opacity-100' : 'opacity-0'}`}></i>
                            {cat.name}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default BlogSidebar;