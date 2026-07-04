import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';

const IMAGE_BASE_URL = "https://localhost:7053";

function LatestProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                
                // Xử lý dữ liệu JSON linh hoạt
                let productsArray = [];
                const result = data.data || data;
                if (Array.isArray(result)) productsArray = result;
                else if (result.data && Array.isArray(result.data)) productsArray = result.data;
                else if (result.Data && Array.isArray(result.Data)) productsArray = result.Data;

                // TIÊU CHÍ 36: Cắt lấy đúng 3 sản phẩm mới nhất
                setProducts(productsArray.slice(0, 3));
            } catch (error) {
                console.error("Lỗi nạp sản phẩm mới:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) return <div className="text-center py-4"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mb-5 mt-5">
            <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
                <h3 className="text-uppercase font-weight-bold text-dark m-0">Hàng Mới Về</h3>
                <Link to="/products" className="text-primary text-decoration-none small font-weight-bold">
                    Xem tất cả <i className="fa-solid fa-angle-right"></i>
                </Link>
            </div>
            <div className="row">
                {products.map(prod => (
                    // Col-md-4 chia màn hình làm 3 cột, chứa đúng 3 sản phẩm
                    <div className="col-md-4 mb-4" key={prod.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden text-center p-3">
                            <img 
                                src={prod.imageUrl ? `${IMAGE_BASE_URL}${prod.imageUrl}` : '/placeholder-product.png'} 
                                alt={prod.name}
                                style={{ height: '220px', objectFit: 'contain' }}
                                className="card-img-top mx-auto mt-2"
                            />
                            <div className="card-body d-flex flex-column p-2">
                                <h5 className="card-title font-weight-bold text-dark text-truncate mt-2">{prod.name}</h5>
                                <p className="card-text text-danger h5 font-weight-bold mb-3">
                                    {prod.price ? prod.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}
                                </p>
                                <Link to={`/product/${prod.id}`} className="btn btn-outline-dark mt-auto font-weight-bold rounded-pill">
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LatestProducts;