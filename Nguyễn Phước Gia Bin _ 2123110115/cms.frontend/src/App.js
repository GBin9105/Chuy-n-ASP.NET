import React from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import BlogCategoryList from './components/BlogCategoryList'; // 1. IMPORT THÊM Ở ĐÂY
import './App.css';

function App() {
  return (
    <div className="container mt-5">
      {/* HEADER */}
      <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center">
        <span className="fs-4 font-weight-bold text-dark text-uppercase">
          🛒 HỆ THỐNG CỬA HÀNG POWER TOOLS
        </span>
        <span className="badge badge-success px-3 py-2">Buổi 8: ReactJS + ASP.NET API</span>
      </header>

      {/* KHU VỰC 1: CẤU TRÚC SONG SONG */}
      <div className="row">
        {/* CỘT TRÁI: BỘ LỌC PHÂN LOẠI DỮ LIỆU */}
        <div className="col-md-3">
            {/* Phân loại phục vụ bán hàng */}
            <CategoryProductList />
            
            {/* Phân loại phục vụ tin tức (VỪA LẮP VÀO) */}
            <BlogCategoryList />
        </div>

        {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
        <div className="col-md-9">
          <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">Máy công cụ mới nhất</h4>
          <ProductList />
        </div>
      </div>

      {/* KHU VỰC 2: TIN TỨC & BLOG */}
      <div className="row mt-5 mb-5">
        <div className="col-12">
          <PostList />
        </div>
      </div>
      
      {/* FOOTER */}
      <footer className="pt-3 mt-5 text-muted border-top text-center small pb-4">
        <p>© 2026 - Hệ thống Thương mại điện tử Power Tools</p>
      </footer>
    </div>
  );
}

export default App;