import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';

const IMAGE_BASE_URL = "https://localhost:7053";

function HotProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHot = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                
                let productsArray = [];
                const result = data.data || data;
                if (Array.isArray(result)) productsArray = result;
                else if (result.data && Array.isArray(result.data)) productsArray = result.data;
                else if (result.Data && Array.isArray(result.Data)) productsArray = result.Data;

                // TIÊU CHÍ 37: Lấy 3 sản phẩm (ở đây tạm đảo ngược mảng để tạo sự khác biệt)
                setProducts([...productsArray].reverse().slice(0, 3));
            } catch (error) {
                console.error("Lỗi nạp sản phẩm Hot:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHot();
    }, []);

    if (loading) return <div className="text-center py-4"><div className="spinner-border text-danger"></div></div>;

    return (
        <div className="container mb-5">
            <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
                <h3 className="text-uppercase font-weight-bold text-danger m-0">
                    <i className="fa-solid fa-fire mr-2"></i> Sản Phẩm Hot
                </h3>
            </div>
            <div className="row">
                {products.map(prod => (
                    <div className="col-md-4 mb-4" key={prod.id}>
                        <div className="card h-100 shadow border-danger rounded-lg overflow-hidden text-center p-3" style={{ borderWidth: '2px' }}>
                            <div className="position-absolute bg-danger text-white px-3 py-1 font-weight-bold rounded-br" style={{ top: 0, left: 0, zIndex: 1 }}>
                                HOT
                            </div>
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
                                <Link to={`/product/${prod.id}`} className="btn btn-danger mt-auto font-weight-bold rounded-pill">
                                    Mua Ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HotProducts;