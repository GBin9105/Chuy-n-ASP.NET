import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center my-4">Đang tải danh sách máy móc...</div>;

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12"><p className="text-muted">Chưa có sản phẩm nào trong hệ thống.</p></div>
            ) : (
                products.map((item) => (
                    <div className="col-md-4 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border">
                            {/* Gắn cứng domain backend vào link ảnh */}
                            <img 
                                src={item.imageUrl ? `https://localhost:7053${item.imageUrl}` : 'https://via.placeholder.com/150'} 
                                className="card-img-top" 
                                alt={item.name} 
                                style={{ height: '200px', objectFit: 'contain', padding: '10px' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold text-dark">{item.name}</h5>
                                <p className="card-text text-danger font-weight-bold">
                                    {/* Tự động định dạng tiền tệ VNĐ */}
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </p>
                                <p className="card-text small text-muted">Số lượng tồn: {item.stockQuantity}</p>
                            </div>
                            <div className="card-footer bg-transparent border-top-0">
                                <button className="btn btn-outline-primary btn-block btn-sm">
                                    <i className="fa-solid fa-cart-plus mr-1"></i> Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;