import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../../services/postService';

// Định nghĩa địa chỉ cổng Backend của bạn để nạp hình ảnh bài viết
const IMAGE_BASE_URL = "https://localhost:7053";

function BlogDetail() {
    // 1. Lấy biến ID động từ URL (Ví dụ: /blog/1002 -> id là 1002)
    const { id } = useParams();

    // 2. Khai báo trạng thái dữ liệu
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // 3. Gọi API lấy dữ liệu chi tiết khi ID thay đổi
    useEffect(() => {
        const fetchPostDetailData = async () => {
            try {
                setLoading(true);
                const data = await postService.getPostById(id);
                setPost(data.data || data); 
            } catch (error) {
                console.error("Lỗi lấy chi tiết bài viết từ API:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetailData();
    }, [id]);

    // 4. Các kịch bản chặn xử lý giao diện (UX Guard)
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2 font-italic small">Hệ thống đang mở thư viện cẩm nang, vui lòng chờ...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container py-5 text-center">
                <h5 className="text-danger font-weight-bold">⛔ BÀI VIẾT KHÔNG TỒN TẠI TRÊN HỆ THỐNG</h5>
                <Link to="/blog" className="btn btn-primary btn-sm mt-3">Quay lại danh sách Blog</Link>
            </div>
        );
    }

    return (
        <div className="blog-detail-page bg-light py-4">
            <div className="container mt-3">
                
                {/* Thanh Điều hướng Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent p-0 small">
                        <li className="breadcrumb-item"><Link to="/">Trang Chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/blog">Tin tức / Blog</Link></li>
                        <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '300px' }}>
                            {post.title}
                        </li>
                    </ol>
                </nav>

                {/* Khối Nội dung Bài viết */}
                <div className="row justify-content-center mt-4">
                    <article className="col-lg-9 col-md-11 bg-white p-4 p-md-5 rounded shadow-sm" style={{ borderTop: '4px solid #005088' }}>
                        
                        {/* 4.1 Tiêu đề bài viết */}
                        <h1 className="font-weight-bold text-dark mb-3" style={{ fontSize: '32px', lineHeight: '1.4' }}>
                            {post.title}
                        </h1>

                        {/* 4.2 Metadata thông tin bài viết */}
                        <div className="d-flex align-items-center flex-wrap text-muted small pb-3 mb-4 border-bottom" style={{ gap: '15px' }}>
                            <span>
                                <i className="fa-regular fa-calendar-alt mr-1"></i>
                                {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                            </span>
                            <span><i className="fa-regular fa-user mr-1"></i>Tác giả: Biên tập viên Admin</span>
                        </div>

                        {/* 4.3 HIỂN THỊ ẢNH BÌA LỚN (MỚI BỔ SUNG) */}
                        {post.imageUrl && (
                            <div className="text-center mb-4 overflow-hidden rounded shadow-sm">
                                <img 
                                    src={`${IMAGE_BASE_URL}${post.imageUrl}`} 
                                    alt={post.title} 
                                    className="img-fluid w-100"
                                    style={{ maxHeight: '450px', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        {/* 4.4 Tóm tắt Sapo (Nếu có) */}
                        {post.summary && (
                            <div className="p-3 bg-light border-left border-primary mb-4 font-italic text-secondary" style={{ borderWidth: '4px', borderRadius: '0 8px 8px 0', fontSize: '15.5px' }}>
                                {post.summary}
                            </div>
                        )}

                        {/* 4.5 NỘI DUNG CHI TIẾT RENDER TỪ CKEDITOR */}
                        <div 
                            className="blog-main-render-content text-justify text-secondary mt-4"
                            style={{ fontSize: '16.5px', lineHeight: '1.8', letterSpacing: '0.1px' }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* 4.6 Nút quay lại danh sách bài viết */}
                        <div className="border-top mt-5 pt-4 d-flex justify-content-between align-items-center">
                            <Link to="/blog" className="btn btn-light btn-sm font-weight-bold text-secondary border">
                                <i className="fa-solid fa-chevron-left mr-1"></i> Quay lại mục Tin tức
                            </Link>
                        </div>

                    </article>
                </div>
            </div>
        </div>
    );
}

export default BlogDetail;