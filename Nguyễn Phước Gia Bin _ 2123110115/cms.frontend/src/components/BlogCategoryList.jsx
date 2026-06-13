import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const BlogCategoryList = () => {
    const [blogCategories, setBlogCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBlogCategories();
                setBlogCategories(data); // Đẩy dữ liệu vào State
            } catch (error) {
                console.error("Lỗi hệ thống khi gọi API chuyên mục tin tức:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogCategories();
    }, []); // Mảng rỗng đảm bảo chỉ gọi API 1 lần

    if (loading) {
        return <div className="text-center my-3 text-muted small">Đang nạp các chuyên mục...</div>;
    }

    return (
        <div className="card shadow-sm border-0 rounded-lg mt-4">
            <div className="card-header bg-light border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-secondary d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1rem' }}>
                    <i className="fa-solid fa-tags text-success mr-2"></i> Chủ đề bài viết
                </h5>
            </div>
            <div className="card-body p-0">
                <div className="list-group list-group-flush mt-2">
                    {blogCategories.length === 0 ? (
                        <p className="text-muted small p-3 text-center">Chưa có chủ đề tin tức nào.</p>
                    ) : (
                        blogCategories.map((cate) => (
                            <a
                                key={cate.id}
                                href={`/blog/category/${cate.id}`}
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 transition-all text-dark text-decoration-none"
                                style={{ fontSize: '0.9rem' }}
                            >
                                <span>
                                    <i className="fa-regular fa-hashtag mr-2 text-muted"></i>
                                    {cate.name}
                                </span>
                                <span className="badge badge-light border text-muted">Đọc</span>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogCategoryList;