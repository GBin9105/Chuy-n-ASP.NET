import React, { useState, useEffect } from 'react';
import postService from '../../services/postService';
import BlogSidebar from './BlogSidebar';
import BlogList from './BlogList';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Quản lý state lọc
    const [filters, setFilters] = useState({
        categoryId: null,
        keyword: ''
    });

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                const response = await postService.getAllPosts(filters);
                setPosts(response.data || response);
            } catch (error) {
                console.error("Lỗi nạp dữ liệu phân hệ Blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogData();
    }, [filters]); // Theo dõi filters để tự động gọi lại API

    // Hàm callback truyền xuống Sidebar
    const handleFilterUpdate = (newCategoryId) => {
        setFilters(prev => ({
            ...prev,
            categoryId: newCategoryId
        }));
    };

    return (
        <div className="container py-4">
            {/* <Header /> */}

            <div className="text-center my-4 py-3 bg-white rounded shadow-sm">
                <h3 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088', letterSpacing: '1px' }}>
                    Tạp Chí Thời Trang / Tin Tức
                </h3>
                <p className="text-muted small m-0 font-italic mt-1">Cập nhật cẩm nang phối đồ và xu hướng mới nhất</p>
            </div>

            <div className="row mt-4">
                {/* CỘT TRÁI (3/12) */}
                <aside className="col-md-3 mb-4">
                    <BlogSidebar 
                        activeCategory={filters.categoryId} 
                        onFilterChange={handleFilterUpdate} 
                    />
                </aside>

                {/* CỘT PHẢI (9/12) */}
                <main className="col-md-9">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2 text-muted small font-italic">Đang nạp cẩm nang thời trang...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-5 bg-white border rounded">
                            <i className="fas fa-folder-open fa-2x text-muted mb-2"></i>
                            <p className="text-muted m-0 font-italic small">Chủ đề này hiện chưa có bài viết nào được xuất bản.</p>
                        </div>
                    ) : (
                        <BlogList posts={posts} />
                    )}
                </main>
            </div>

            {/* <Footer /> */}
        </div>
    );
}

export default Blog;