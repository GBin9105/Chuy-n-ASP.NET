import React from 'react';
import { Link } from 'react-router-dom';

// Định nghĩa cổng Backend của bạn ở đây để nối vào đường dẫn ảnh
const IMAGE_BASE_URL = "https://localhost:7053";

function BlogList({ posts }) {
    return (
        <div className="blog-list-grid">
            <div className="row">
                {posts.map((item) => (
                    <div className="col-md-6 col-sm-12 mb-4" key={item.id}>
                        {/* Giao diện Card Bài Viết */}
                        <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden">
                            {item.imageUrl ? (
                                <img 
                                    // Đã nối IMAGE_BASE_URL vào trước item.imageUrl
                                    src={`${IMAGE_BASE_URL}${item.imageUrl}`} 
                                    className="card-img-top" 
                                    alt={item.title}
                                    style={{ height: '220px', objectFit: 'cover' }} 
                                />
                            ) : (
                                <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
                                    <i className="fa-regular fa-image fa-3x text-secondary"></i>
                                </div>
                            )}
                            
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title font-weight-bold" style={{ fontSize: '1.15rem' }}>
                                    {item.title}
                                </h5>
                                
                                {/* Tóm tắt nội dung */}
                                <p className="card-text text-muted small mb-3 flex-grow-1">
                                    {item.summary ? item.summary : (item.content ? item.content.substring(0, 100).replace(/<[^>]+>/g, '') + '...' : '')}
                                </p>
                                
                                {/* Dưới đáy Card: Ngày & Nút Đọc tiếp */}
                                <div className="mt-auto d-flex justify-content-between align-items-center border-top pt-3">
                                    <span className="text-muted small">
                                        <i className="fa-regular fa-calendar-alt mr-1"></i>
                                        {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                                    </span>
                                    
                                    <Link to={`/blog/${item.id}`} className="btn text-primary font-weight-bold p-0">
                                        Đọc tiếp <i className="fa-solid fa-arrow-right-long ml-1"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BlogList;