import React, { useState, useEffect } from 'react';
import postService from '../../services/postService';
import BlogSidebar from './BlogSidebar';
import BlogList from './BlogList';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State quản lý phân trang hiển thị
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Thêm page và pageSize vào bộ lọc mặc định
    const [filters, setFilters] = useState({
        categoryId: null,
        keyword: '',
        page: 1,      // Trang bắt đầu là 1
        pageSize: 6   // Mỗi trang lấy 6 bài
    });

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                // Truyền toàn bộ filters (bao gồm cả page và pageSize) xuống API
                const response = await postService.getAllPosts(filters);
                
                // Lấy kết quả thô từ Backend
                const result = response.data || response;
                
                // CODE FIX LỖI: Tìm mảng bài viết thông minh
                let postsArray = [];
                if (Array.isArray(result)) {
                    // Trường hợp Backend trả về mảng trực tiếp
                    postsArray = result; 
                } else if (result.data && Array.isArray(result.data)) {
                    // Trường hợp Backend trả về { data: [...] } (Chữ d thường)
                    postsArray = result.data;
                } else if (result.Data && Array.isArray(result.Data)) {
                    // Trường hợp Backend trả về { Data: [...] } (Chữ D hoa)
                    postsArray = result.Data;
                }
                
                // Cập nhật state với mảng đã tìm được
                setPosts(postsArray);
                setCurrentPage(result.currentPage || result.CurrentPage || 1);
                setTotalPages(result.totalPages || result.TotalPages || 1);

            } catch (error) {
                console.error("Lỗi nạp dữ liệu phân hệ Blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogData();
    }, [filters]); // Theo dõi filters để tự động gọi lại API khi đổi trang hoặc đổi danh mục

    // Xử lý khi người dùng bấm chọn số trang
    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Hàm callback truyền xuống Sidebar
    const handleFilterUpdate = (newCategoryId) => {
        setFilters(prev => ({
            ...prev,
            categoryId: newCategoryId,
            page: 1 // QUAN TRỌNG: Khi chọn danh mục mới, luôn đưa người dùng về trang 1
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
                        // TRUYỀN DỮ LIỆU PHÂN TRANG XUỐNG BLOGLIST
                        <BlogList 
                            posts={posts} 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </main>
            </div>

            {/* <Footer /> */}
        </div>
    );
}

export default Blog;