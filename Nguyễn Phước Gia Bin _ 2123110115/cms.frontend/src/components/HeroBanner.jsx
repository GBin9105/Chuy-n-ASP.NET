import React from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = "https://localhost:7053";

function HeroBanner({ banners }) {
    // Nếu chưa load xong API hoặc không có bài viết, hiển thị banner tĩnh làm fallback
    if (!banners || banners.length === 0) {
        return (
            <div className="position-relative text-center mb-5 shadow-sm" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1581147036324-c17228a01103?q=80&w=1920&auto=format&fit=crop')",
                backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', top: 0, left: 0 }}></div>
                <div className="position-relative text-white px-3">
                    <div className="spinner-border text-warning mb-3" role="status"></div>
                    <h4 className="font-weight-light mb-4">Đang tải không gian trải nghiệm...</h4>
                </div>
            </div>
        );
    }

    return (
        // Slider động bằng Bootstrap
        <div id="homeHeroCarousel" className="carousel slide mb-5 shadow-sm" data-ride="carousel" data-bs-ride="carousel">
            
            {/* Thanh gạch ngang (Indicators) */}
            <div className="carousel-indicators">
                {banners.map((_, index) => (
                    <button 
                        key={index} 
                        type="button" 
                        data-bs-target="#homeHeroCarousel" 
                        data-target="#homeHeroCarousel" 
                        data-bs-slide-to={index} 
                        data-slide-to={index} 
                        className={index === 0 ? "active" : ""} 
                        aria-current={index === 0 ? "true" : "false"}
                    ></button>
                ))}
            </div>

            {/* Khung hiển thị Slide */}
            <div className="carousel-inner">
                {banners.map((item, index) => (
                    <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        {/* Ảnh nền */}
                        <img 
                            src={item.imageUrl ? `${IMAGE_BASE_URL}${item.imageUrl}` : '/placeholder-blog.png'} 
                            className="d-block w-100" 
                            alt={item.title} 
                            style={{ height: '500px', objectFit: 'cover' }} 
                        />
                        {/* Phủ một lớp đen mờ lên ảnh để chữ dễ đọc hơn */}
                        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', top: 0, left: 0 }}></div>
                        
                        {/* Text hiển thị */}
                        <div className="carousel-caption d-none d-md-block p-4" style={{ bottom: '15%', zIndex: 2 }}>
                            <h2 className="display-5 font-weight-bold text-warning text-uppercase mb-3" style={{ letterSpacing: '1px' }}>
                                {item.title}
                            </h2>
                            <p className="text-light lead mb-4 d-none d-lg-block">
                                {item.content ? item.content.substring(0, 150).replace(/<[^>]+>/g, '') + '...' : 'Khám phá giải pháp tối ưu cho công việc của bạn.'}
                            </p>
                            <Link to={`/blog/${item.id}`} className="btn btn-warning font-weight-bold px-5 py-3 rounded-pill transition-all">
                                KHÁM PHÁ NGAY <i className="fa-solid fa-arrow-right ml-2"></i>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mũi tên điều hướng trái/phải */}
            <button className="carousel-control-prev" type="button" data-bs-target="#homeHeroCarousel" data-target="#homeHeroCarousel" data-bs-slide="prev" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#homeHeroCarousel" data-target="#homeHeroCarousel" data-bs-slide="next" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </button>
        </div>
    );
}

export default HeroBanner;