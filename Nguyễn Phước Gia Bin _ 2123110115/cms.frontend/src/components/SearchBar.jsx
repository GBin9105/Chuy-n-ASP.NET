import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // BỔ SUNG useNavigate
import productService from '../services/productService';
import blogService from '../services/blogService';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [results, setResults] = useState({ products: [], posts: [] });
    const [showDropdown, setShowDropdown] = useState(false);
    
    // TIÊU CHÍ 40: Hook dùng để điều hướng trang
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const pData = await productService.getAllProducts();
                const bData = await blogService.getAllPosts();
                
                // Xử lý json an toàn
                const pResult = pData.data || pData;
                const bResult = bData.data || bData;

                setProducts(Array.isArray(pResult) ? pResult : (pResult.data || pResult.Data || []));
                setPosts(Array.isArray(bResult) ? bResult : (bResult.data || bResult.Data || []));
            } catch (error) {
                console.error("Lỗi tải dữ liệu tìm kiếm:", error);
            }
        };
        fetchAllData();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            setShowDropdown(false);
            return;
        }

        const lowerCaseValue = value.toLowerCase();

        const filteredProducts = products.filter(p => 
            p.name && p.name.toLowerCase().includes(lowerCaseValue)
        );

        const filteredPosts = posts.filter(p => 
            p.title && p.title.toLowerCase().includes(lowerCaseValue)
        );

        setResults({ products: filteredProducts, posts: filteredPosts });
        setShowDropdown(true);
    };

    const handleItemClick = () => {
        setShowDropdown(false);
        setQuery(''); 
    };

    // TIÊU CHÍ 40: Xử lý khi khách bấm nút Kính Lúp hoặc phím Enter
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Ngăn trang web bị reload
        if (query.trim() !== '') {
            setShowDropdown(false);
            // Điều hướng sang trang Shop kèm từ khóa trên URL
            navigate(`/products?keyword=${encodeURIComponent(query)}`);
            setQuery(''); // Reset ô tìm kiếm
        }
    };

    return (
        <div className="position-relative w-100">
            {/* ĐỔI <div> THÀNH <form> ĐỂ BẮT SỰ KIỆN ENTER */}
            <form className="input-group" onSubmit={handleSearchSubmit}>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Tìm kiếm máy khoan, máy mài, mẹo vặt..." 
                    value={query}
                    onChange={handleSearch}
                />
                <div className="input-group-append">
                    <button className="btn btn-dark" type="submit">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </form>

            {/* Menu xổ xuống (Dropdown) giữ nguyên */}
            {showDropdown && (
                <div 
                    className="position-absolute w-100 bg-white border rounded shadow-lg" 
                    style={{ top: '110%', left: 0, zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}
                >
                    {results.products.length > 0 && (
                        <div>
                            <div className="bg-light px-3 py-2 font-weight-bold text-secondary small text-uppercase">Sản Phẩm</div>
                            {results.products.map(product => (
                                <Link 
                                    key={`prod-${product.id}`} 
                                    to={`/product/${product.id}`}
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