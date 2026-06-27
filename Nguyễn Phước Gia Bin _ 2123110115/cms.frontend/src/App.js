import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import productService from './services/productService';
import postService from './services/postService';

// Import các trang chức năng chính
import Shop from './pages/shop/index';
import Cart from './pages/cart/index';
import Checkout from './pages/checkout/index';
import ProductDetail from './pages/product-detail/index';
import Blog from './pages/blog/index';
import BlogDetail from './pages/blog-detail/index';
import SearchBar from './components/SearchBar';

import './App.css';

// Định nghĩa cổng kết nối Backend C# để nạp hình ảnh
const IMAGE_BASE_URL = "https://localhost:7053";

function App() {
  // Khai báo state lưu trữ dữ liệu hiển thị ngoài Trang Chủ
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Gọi API đồng bộ dữ liệu ngay khi vừa tải Trang Chủ
  useEffect(() => {
    // 1. Lấy sản phẩm nổi bật (Giới hạn hiển thị sản phẩm mới nhất)
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await productService.getAllProducts();
        // Lấy tối đa 4 sản phẩm hiển thị hàng đầu ngoài trang chủ
        setFeaturedProducts((data.data || data).slice(0, 4));
      } catch (error) {
        console.error("Lỗi nạp sản phẩm nổi bật ngoài Trang Chủ:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    // 2. Lấy danh sách bài viết tin tức mới nhất
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const data = await postService.getAllPosts();
        // Lấy tối đa 3 bài viết mới nhất
        setLatestPosts((data.data || data).slice(0, 3));
      } catch (error) {
        console.error("Lỗi nạp tin tức ngoài Trang Chủ:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchProducts();
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

              <div className="col-md-3 text-right">
                <Link to="/cart" className="btn btn-outline-dark position-relative">
                  <i className="fa-solid fa-cart-shopping fa-lg"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white" style={{ top: '-5px', right: '-10px' }}>
                    
                  </span>
                </Link>
              </div>
            </div>
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

        {/* ================= BANNER HERO ================= */}
        <div className="position-relative text-center mb-5 shadow-sm" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1581147036324-c17228a01103?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', top: 0, left: 0 }}></div>
          <div className="position-relative text-white px-3">
            <h1 className="display-4 font-weight-bold text-uppercase mb-3" style={{ letterSpacing: '2px' }}>
              Sức Mạnh <span className="text-warning">Vượt Trội</span>
            </h1>
            <h4 className="font-weight-light mb-4">Không gian trải nghiệm dụng cụ điện cầm tay chính hãng</h4>
            <Link to="/products" className="btn btn-warning btn-lg font-weight-bold px-5 py-3 rounded-pill transition-all">
              KHÁM PHÁ NGAY <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-grow-1 container mb-5">
          <Routes>
            {/* 1. ĐƯỜNG DẪN TRANG CHỦ MỚI VẬN HÀNH BẰNG API BIẾN ĐỘNG */}
            <Route path="/" element={
              <>
                {/* KHU VỰC 1: SẢN PHẨM NỔI BẬT */}
                <div className="text-center mb-5">
                  <h3 className="text-uppercase font-weight-bold text-dark">Sản Phẩm Nổi Bật</h3>
                  <p className="text-muted small">Khám phá các dòng máy công cụ mạnh mẽ bán chạy nhất</p>
                  <hr style={{ width: '60px', borderTop: '3px solid #ffc107', margin: '0 auto' }} />
                </div>
                
                <div className="row mb-5">
                  {loadingProducts ? (
                    <div className="text-center col-100 py-4 w-100">
                      <div className="spinner-border text-warning" role="status"></div>
                    </div>
                  ) : featuredProducts.length === 0 ? (
                    <p className="text-center text-muted w-100 font-italic">Hiện chưa có sản phẩm nổi bật nào.</p>
                  ) : (
                    featuredProducts.map(prod => (
                      <div className="col-lg-3 col-md-6 mb-4" key={prod.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden text-center p-3">
                          <img 
                            src={prod.imageUrl ? `${IMAGE_BASE_URL}${prod.imageUrl}` : '/placeholder-product.png'} 
                            alt={prod.name}
                            style={{ height: '180px', objectFit: 'contain' }}
                            className="card-img-top mx-auto mt-2"
                          />
                          <div className="card-body d-flex flex-column p-2">
                            <h6 className="card-title font-weight-bold text-dark text-truncate mt-2">{prod.name}</h6>
                            <p className="card-text text-danger font-weight-bold mb-3">
                              {prod.price ? prod.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}
                            </p>
                            <Link to={`/product/${prod.id}`} className="btn btn-outline-dark btn-sm mt-auto font-weight-bold rounded-pill">
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* KHU VỰC 2: TIN TỨC MỚI NHẤT */}
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
}

export default App;