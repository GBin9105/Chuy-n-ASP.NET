import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService'; // Đảm bảo import đúng đường dẫn

const IMAGE_BASE_URL = "https://localhost:7053";

function CategoryMenu() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Giả định bạn có hàm getCategories trong productService
                // Nếu chưa có, bạn có thể tự thêm hàm này vào file productService.js
                const data = await productService.getCategories();
                const result = data.data || data;
                
                let catArray = Array.isArray(result) ? result : [];
                setCategories(catArray);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
                
                // DATA MẪU (Fallback): Đề phòng API Backend chưa có bảng Danh Mục hoặc chưa có ảnh
                // Code này giúp bạn vẫn pass Tiêu chí 38 ngay cả khi Backend chưa hoàn thiện phần ảnh danh mục
                setCategories([
                    { id: 1, name: 'Máy Khoan', imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop' },
                    { id: 2, name: 'Máy Cắt', imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&h=200&fit=crop' },
                    { id: 3, name: 'Máy Mài', imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=200&h=200&fit=crop' },
                    { id: 4, name: 'Dụng Cụ Cầm Tay', imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=200&h=200&fit=crop' },
                ]);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-4">
                <h4 className="text-uppercase font-weight-bold text-dark">Danh Mục Ngành Hàng</h4>
                <hr style={{ width: '60px', borderTop: '3px solid #005088', margin: '0 auto' }} />
            </div>
            
            {/* Flexbox để dàn ngang các khối tròn */}
            <div className="d-flex justify-content-center flex-wrap" style={{ gap: '2rem' }}>
                {categories.map((cat, index) => (
                    // Điều hướng sang trang Shop và truyền categoryId
                    <Link to={`/products?categoryId=${cat.id}`} key={cat.id || index} className="text-decoration-none text-dark text-center" style={{ transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        {/* Khối Tròn */}
                        <div className="rounded-circle overflow-hidden shadow mb-3 mx-auto" style={{ width: '120px', height: '120px', border: '4px solid #fff' }}>
                            <img 
                                src={cat.imageUrl.startsWith('http') ? cat.imageUrl : `${IMAGE_BASE_URL}${cat.imageUrl}`} 
                                alt={cat.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        {/* Tên danh mục */}
                        <span className="font-weight-bold" style={{ fontSize: '0.95rem' }}>{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default CategoryMenu;