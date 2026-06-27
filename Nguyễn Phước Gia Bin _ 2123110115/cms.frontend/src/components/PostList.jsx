import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center my-4">Đang tải tin tức...</div>;

    return (
        <div className="mt-5">
            <h4 className="mb-4 text-uppercase text-secondary font-weight-bold border-bottom pb-2">
                <i className="fa-solid fa-newspaper text-info mr-2"></i> Tin Tức
            </h4>

            {posts.length === 0 ? (
                <p className="text-muted">Chưa có bài viết tin tức nào.</p>
            ) : (
                <div className="row">
                    {posts.map((post) => (
                        <div className="col-md-4 mb-4" key={post.id}>
                            <div className="card shadow-sm border-light h-100">
                                {/* Xử lý link ảnh bài viết */}
                                <img 
                                    src={post.imageUrl ? `https://localhost:7053${post.imageUrl}` : 'https://via.placeholder.com/300x150'} 
                                    className="card-img-top" 
                                    alt={post.title} 
                                    style={{ height: '180px', objectFit: 'cover' }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title font-weight-bold text-dark">
                                        {post.title}
                                    </h5>
                                    <p className="card-text text-muted small flex-grow-1">
                                        {/* Hiển thị một đoạn ngắn của nội dung để làm tóm tắt */}
                                        {post.content ? post.content.substring(0, 100) + '...' : 'Đang cập nhật nội dung...'}
                                    </p>
                                    
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="text-secondary small">
                                            <i className="fa-regular fa-calendar mr-1"></i>
                                            {/* Định dạng ngày tháng chuẩn Việt Nam */}
                                            {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : '13/06/2026'}
                                        </span>
                                        <button className="btn btn-sm btn-info text-white">Xem thêm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;