import React from 'react';
import { Link } from 'react-router-dom';

function ProductList({ products }) {
    return (
        <div className="row">
            {products.map(product => (
                <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
                    <div className="card h-100 shadow-sm">
                        <img src={`https://localhost:7053${product.imageUrl}`} className="card-img-top p-3" alt={product.name} style={{ height: '200px', objectFit: 'contain' }}/>
                        <div className="card-body d-flex flex-column text-center">
                            <h6 className="card-title font-weight-bold">{product.name}</h6>
                            <p className="text-danger font-weight-bold mb-3">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </p>
                            <Link to={`/product/${product.id}`} className="btn btn-outline-primary mt-auto rounded-pill">
                                Xem chi tiết
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductList;