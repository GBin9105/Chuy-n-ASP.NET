import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogService';

const PostDetail = () => {
    const { id } = useParams(); // Lấy ID bài viết từ URL
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            // Gọi API lấy chi tiết 1 bài viết theo ID
            const data = await blogService.getPostById(id);
            setPost(data);
        };
        fetchPost();
    }, [id]);

    if (!post) return <div className="text-center py-5">Đang tải nội dung...</div>;

    return (
        <div className="container mt-5">
            <article className="blog-post">
                <h1 className="mb-3">{post.title}</h1>
                <p className="text-muted small">Ngày đăng: {new Date(post.createdDate).toLocaleDateString('vi-VN')}</p>
                <hr />
                <div className="content py-3">
                    {/* Dùng dangerouslySetInnerHTML nếu nội dung bài viết có định dạng HTML */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
            </article>
        </div>
    );
};

export default PostDetail;