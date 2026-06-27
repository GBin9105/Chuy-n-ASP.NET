import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import blogService from '../services/blogService';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [results, setResults] = useState({ products: [], posts: [] });
    const [showDropdown, setShowDropdown] = useState(false);

    // 1. Kéo toàn bộ dữ liệu về sẵn 1 lần khi web vừa mở để tìm kiếm siêu tốc
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const pData = await productService.getAllProducts();
                const bData = await blogService.getAllPosts();
                setProducts(pData);
                setPosts(bData);
            } catch (error) {
                console.error("Lỗi tải dữ liệu tìm kiếm:", error);
            }
        };
        fetchAllData();
    }, []);

    // 2. Hàm xử lý mỗi khi khách hàng gõ phím
    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        // Nếu xóa trắng ô tìm kiếm thì ẩn menu xổ xuống
        if (value.trim() === '') {
            setShowDropdown(false);
            return;
        }

        // Chuyển chữ về chữ thường để so sánh (Ví dụ: "Khoan" hay "khoan" đều tìm được)
        const lowerCaseValue = value.toLowerCase();

        // Lọc Sản phẩm có chứa từ khóa
        const filteredProducts = products.filter(p => 
            p.name && p.name.toLowerCase().includes(lowerCaseValue)
        );

        // Lọc Bài viết có chứa từ khóa
        const filteredPosts = posts.filter(p => 
            p.title && p.title.toLowerCase().includes(lowerCaseValue)
        );

        setResults({ products: filteredProducts, posts: filteredPosts });
        setShowDropdown(true);
    };

    // 3. Hàm đóng menu khi click vào một kết quả
    const handleItemClick = () => {
        setShowDropdown(false);
        setQuery(''); // Có thể xóa từ khóa hoặc giữ lại tùy ý
    };

    return (
        <div className="position-relative w-100">
            {/* Ô Nhập từ khóa */}
            <div className="input-group">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Tìm kiếm máy khoan, máy mài, mẹo vặt..." 
                    value={query}
                    onChange={handleSearch}
                />
                <div className="input-group-append">
                    <button className="btn btn-dark" type="button">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>

            {/* Menu xổ xuống (Dropdown) */}
            {showDropdown && (
                <div 
                    className="position-absolute w-100 bg-white border rounded shadow-lg" 
                    style={{ top: '110%', left: 0, zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}
                >
                    {/* Hiển thị danh sách Sản Phẩm */}
                    {results.products.length > 0 && (
                        <div>
                            <div className="bg-light px-3 py-2 font-weight-bold text-secondary small text-uppercase">Sản Phẩm</div>
                            {results.products.map(product => (
                                <Link 
                                    key={`prod-${product.id}`} 
                                    to={`/product/${product.id}`} // Đường dẫn tới trang chi tiết máy sau này
                                    className="dropdown-item d-flex align-items-center py-2 border-bottom"
                                    onClick={handleItemClick}
                                >
                                    <img 
                                        src={product.imageUrl ? `https://localhost:7053${product.imageUrl}` : 'https://via.placeholder.com/40'} 
                                        alt={product.name} 
                                        style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
                                        className="mr-3"
                                    />
                                    <div>
                                        <div className="text-dark font-weight-bold" style={{ whiteSpace: 'normal', fontSize: '0.9rem' }}>{product.name}</div>
                                        <div className="text-danger small font-weight-bold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Hiển thị danh sách Bài viết Tin tức */}
                    {results.posts.length > 0 && (
                        <div>
                            <div className="bg-light px-3 py-2 font-weight-bold text-secondary small text-uppercase">Tin Tức / Bài Viết</div>
                            {results.posts.map(post => (
                                <Link 
                                    key={`post-${post.id}`} 
                                    to={`/blog/${post.id}`} 
                                    className="dropdown-item d-flex align-items-center py-2 border-bottom"
                                    onClick={handleItemClick}
                                >
                                    <i className="fa-regular fa-file-lines text-muted mr-3" style={{ fontSize: '1.2rem' }}></i>
                                    <div className="text-dark" style={{ whiteSpace: 'normal', fontSize: '0.9rem' }}>{post.title}</div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Báo lỗi nếu không tìm thấy gì */}
                    {results.products.length === 0 && results.posts.length === 0 && (
                        <div className="p-3 text-center text-muted small">
                            Không tìm thấy kết quả nào cho "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;