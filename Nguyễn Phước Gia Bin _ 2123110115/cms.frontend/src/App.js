import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import postService from './services/postService';

// IMPORT GIỎ HÀNG (Hãy đảm bảo đường dẫn này khớp với nơi bạn lưu file CartContext.js nhé)
import { CartProvider, CartContext } from './context/CartContext';

// Import các trang chức năng chính
import Shop from './pages/shop/index';
import Cart from './pages/cart/index';
import Checkout from './pages/checkout/index';
import ProductDetail from './pages/product-detail/index';
import Blog from './pages/blog/index';
import BlogDetail from './pages/blog-detail/index';
import SearchBar from './components/SearchBar';
import HeroBanner from './components/HeroBanner';
import CategoryMenu from './components/CategoryMenu';       // COMPONENT TIÊU CHÍ 38
import LatestProducts from './components/LatestProducts'; // COMPONENT TIÊU CHÍ 36
import HotProducts from './components/HotProducts';       // COMPONENT TIÊU CHÍ 37

import './App.css';

// Định nghĩa cổng kết nối Backend C# để nạp hình ảnh
const IMAGE_BASE_URL = "https://localhost:7053";

// =========================================================================
// COMPONENT NỘI DUNG CHÍNH (Được bọc bên trong CartProvider)
// =========================================================================
const MainApp = () => {
  // 1. Gọi Context để lấy Giỏ hàng và tính tổng số lượng cho bong bóng đỏ
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

  // 2. State lưu trữ bài viết cho Banner Hero và Khu vực Tin tức
  const [latestPosts, setLatestPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // 3. Gọi API đồng bộ dữ liệu ngay khi vừa tải Trang Chủ
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const data = await postService.getAllPosts();
        
        // Xử lý dữ liệu JSON
        let postsArray = [];
        const result = data.data || data;
        if (Array.isArray(result)) postsArray = result;
        else if (result.data && Array.isArray(result.data)) postsArray = result.data;
        else if (result.Data && Array.isArray(result.Data)) postsArray = result.Data;

        // Lấy tối đa 3 bài viết mới nhất
        setLatestPosts(postsArray.slice(0, 3));
      } catch (error) {
        console.error("Lỗi nạp tin tức ngoài Trang Chủ:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        
        {/* ================= HEADER TỔNG ================= */}
        <header>
          {/* Topbar: Thông tin liên hệ & Đăng nhập */}
          <div className="bg-dark text-light py-1">
            <div className="container d-flex justify-content-between align-items-center" style={{ fontSize: '0.85rem' }}>
              <div>
                <i className="fa-solid fa-phone mr-1"></i> Hotline: 0363636360 
                <span className="mx-3">|</span>
                <i className="fa-solid fa-envelope mr-1"></i> support@powertools.vn
              </div>
              <div>
                <Link to="/login" className="text-light text-decoration-none mr-3">
                  <i className="fa-solid fa-user mr-1"></i> Đăng nhập
                </Link>
                <Link to="/register" className="text-light text-decoration-none">
                  <i className="fa-solid fa-user-plus mr-1"></i> Đăng ký
                </Link>
              </div>
            </div>
          </div>

          {/* Main Header: Logo, Tìm kiếm, Giỏ hàng */}
          <div className="container py-3 border-bottom">
            <div className="row align-items-center">
              <div className="col-md-3">
                <Link to="/" className="text-decoration-none d-flex align-items-center">
                  <img 
                    src="/powertool.png" 
                    alt="PowerTools Logo" 
                    style={{ height: '70px', objectFit: 'contain' }} 
                  />
                  <span className="h4 mb-0 ml-2 font-weight-bold text-dark">PowerTools</span>
                </Link>
              </div>
              
              <div className="col-md-6">
                <SearchBar />
              </div>

{/* KHU VỰC GIỎ HÀNG CÓ BONG BÓNG ĐỎ */}
<div className="col-md-3 text-right">
  <Link to="/cart" className="btn btn-outline-dark position-relative">
    <i className="fa-solid fa-cart-shopping fa-lg"></i>
    
    {/* SỬA CHỖ NÀY: Đổi totalItems > 0 thành totalItems >= 0 */}
    {totalItems >= 0 && (
      <span 
        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white" 
        style={{ top: '-5px', right: '-10px' }}
      >
        {totalItems}
      </span>
    )}
  </Link>
</div>            </div>
          </div>

          {/* Navigation Bar */}
          <div className="container">
            <nav className="nav py-2 font-weight-bold">
              <Link className="nav-link text-dark px-0 mr-4" to="/">Trang Chủ</Link>
              <Link className="nav-link text-dark px-0 mr-4" to="/products">Sản Phẩm</Link>
              <Link className="nav-link text-dark px-0 mr-4" to="/blog">Tin Tức / Blog</Link>
              <Link className="nav-link text-dark px-0" to="/about">Về Chúng Tôi</Link>
            </nav>
          </div>
        </header>

        {/* ================= BANNER HERO ĐỘNG TỪ COMPONENT ================= */}
        <HeroBanner banners={latestPosts} />

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-grow-1 container mb-5">
          <Routes>
            <Route path="/" element={
              <>
                {/* COMPONENT TIÊU CHÍ 38: DANH MỤC HÌNH TRÒN */}
                <CategoryMenu />

                {/* COMPONENT TIÊU CHÍ 36: SẢN PHẨM MỚI NHẤT */}
                <LatestProducts />

                {/* COMPONENT TIÊU CHÍ 37: SẢN PHẨM HOT */}
                <HotProducts />

                {/* KHU VỰC: TIN TỨC MỚI NHẤT */}
                <div className="text-center mt-5 mb-5">
                  <h3 className="text-uppercase font-weight-bold text-dark">Cẩm Nang & Tin Tức</h3>
                  <p className="text-muted small">Cập nhật xu hướng công nghệ dụng cụ cầm tay mới nhất</p>
                  <hr style={{ width: '60px', borderTop: '3px solid #005088', margin: '0 auto' }} />
                </div>

                <div className="row">
                  {loadingPosts ? (
                    <div className="text-center col-100 py-4 w-100">
                      <div className="spinner-border text-primary" role="status"></div>
                    </div>
                  ) : latestPosts.length === 0 ? (
                    <p className="text-center text-muted w-100 font-italic">Chưa có bài viết tin tức nào được xuất bản.</p>
                  ) : (
                    latestPosts.map(post => (
                      <div className="col-md-4 mb-4" key={post.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden">
                          <img 
                            src={post.imageUrl ? `${IMAGE_BASE_URL}${post.imageUrl}` : '/placeholder-blog.png'} 
                            className="card-img-top" 
                            alt={post.title}
                            style={{ height: '200px', objectFit: 'cover' }} 
                          />
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title font-weight-bold text-dark h6 text-truncate-2" style={{ lineHeight: '1.4', height: '44px', overflow: 'hidden' }}>
                              {post.title}
                            </h5>
                            <p className="card-text text-muted small flex-grow-1">
                              {post.content ? post.content.substring(0, 90).replace(/<[^>]+>/g, '') + '...' : 'Đang cập nhật...'}
                            </p>
                            <div className="mt-auto d-flex justify-content-between align-items-center border-top pt-2">
                              <span className="text-muted small" style={{ fontSize: '0.78rem' }}>
                                <i className="fa-regular fa-calendar-alt mr-1"></i>
                                {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                              </span>
                              <Link to={`/blog/${post.id}`} className="btn btn-link text-primary p-0 font-weight-bold small text-decoration-none">
                                Đọc tiếp <i className="fa-solid fa-arrow-right ml-1"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            } />

            {/* ĐƯỜNG DẪN CÁC TRANG CHỨC NĂNG PHÂN HỆ KHÁC */}
            <Route path="/products" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/about" element={<h2 className="text-center py-5">Trang Giới Thiệu (Đang cập nhật)</h2>} />
            <Route path="/login" element={<h2 className="text-center py-5">Trang Đăng nhập (Đang cập nhật)</h2>} />
            <Route path="/register" element={<h2 className="text-center py-5">Trang Đăng ký (Đang cập nhật)</h2>} />
          </Routes>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-3">
                <h5 className="font-weight-bold text-warning mb-3">PowerTools</h5>
                <p className="small text-muted">Hệ thống phân phối dụng cụ điện cầm tay chính hãng. Cung cấp giải pháp tối ưu cho ngành mộc, cơ khí và xây dựng.</p>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="font-weight-bold mb-3">Chính Sách</h5>
                <ul className="list-unstyled small text-muted">
                  <li className="mb-2"><i className="fa-solid fa-angle-right mr-2"></i>Chính sách giao hàng</li>
                  <li className="mb-2"><i className="fa-solid fa-angle-right mr-2"></i>Chính sách đổi trả 1-1</li>
                  <li className="mb-2"><i className="fa-solid fa-angle-right mr-2"></i>Bảo mật thông tin</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="font-weight-bold mb-3">Liên Hệ</h5>
                <ul className="list-unstyled small text-muted">
                  <li className="mb-2"><i className="fa-solid fa-location-dot mr-2"></i>Cao Đẳng Công Thương, TP. Thủ Đức</li>
                  <li className="mb-2"><i className="fa-solid fa-phone mr-2"></i>Hotline: 0363636360</li>
                  <li className="mb-2"><i className="fa-solid fa-envelope mr-2"></i>support@powertools.vn</li>
                </ul>
              </div>
            </div>
            <div className="border-top border-secondary mt-3 pt-3 text-center small text-muted">
              © 2026 PowerTools Retail. All Rights Reserved.
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
};

// =========================================================================
// COMPONENT ROOT: Cung cấp Context cho toàn bộ ứng dụng
// =========================================================================
function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}

export default App;