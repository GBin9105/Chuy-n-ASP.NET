import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../services/productService';

const ProductDetail = () => {
    const { id } = useParams(); // Lấy ID từ đường dẫn
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await productService.getProductById(id); // Bạn cần đảm bảo hàm này đã có trong productService
            setProduct(data);
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div className="text-center py-5">Đang tải...</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={`https://localhost:7053${product.imageUrl}`} className="img-fluid" alt={product.name} />
                </div>
                <div className="col-md-6">
                    <h2>{product.name}</h2>
                    <h3 className="text-danger">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</h3>
                    <p>{product.description}</p>
                    <button className="btn btn-warning">Thêm vào giỏ hàng</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;