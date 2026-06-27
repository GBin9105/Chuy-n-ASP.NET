import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';

const IMAGE_BASE_URL = "https://localhost:7053"; // Sửa lại cổng của bạn nếu khác

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductById();
    }, [id]);

    const handleAddToCartSubmit = () => {
        // 1. Kiểm tra tồn kho cơ bản trên giao diện
        if (quantity > product.stockQuantity) {
            alert(`⚠️ LỖI NGHIỆP VỤ KHO: Số lượng đặt mua (${quantity}) vượt quá số lượng hiện có trong kho hàng (${product.stockQuantity} chiếc). Vui lòng điều chỉnh lại số lượng!`);
            return;
        }

        // 2. Lấy giỏ hàng hiện tại từ LocalStorage (Nếu chưa có thì tạo mảng rỗng)
        let cart = JSON.parse(localStorage.getItem('POWER_TOOLS_CART')) || [];

        // 3. Kiểm tra xem sản phẩm này đã có trong giỏ hàng trước đó chưa
        const existingItemIndex = cart.findIndex(item => item.productId === product.id);

        if (existingItemIndex !== -1) {
            // Nếu máy này đã có trong giỏ, tiến hành cộng dồn số lượng
            const newTotalQuantity = cart[existingItemIndex].quantity + quantity;
            
            // Kiểm tra lại lần nữa xem sau khi cộng dồn có bị vượt kho không
            if (newTotalQuantity > product.stockQuantity) {
                alert(`⚠️ LỖI: Bạn đã có sẵn ${cart[existingItemIndex].quantity} chiếc trong giỏ. Thêm ${quantity} chiếc nữa sẽ vượt quá tổng tồn kho (${product.stockQuantity}).`);
                return;
            }
            // Cập nhật số lượng mới
            cart[existingItemIndex].quantity = newTotalQuantity;
        } else {
            // Nếu là sản phẩm mới tinh, thêm một cục dữ liệu mới vào mảng giỏ hàng
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: quantity,
                stockQuantity: product.stockQuantity // Lưu lại tồn kho để sang trang Giỏ hàng vẫn kiểm soát được
            });
        }

        // 4. Lưu ngược mảng dữ liệu đã cập nhật vào lại LocalStorage
        localStorage.setItem('POWER_TOOLS_CART', JSON.stringify(cart));

        // 5. Thông báo thành công
        alert(`🛒 THÀNH CÔNG: Đã lưu ${quantity} chiếc "${product.name}" vào giỏ hàng cá nhân!`);
    };

    if (loading) return <div className="text-center py-5">Đang truy vấn kho dữ liệu mẫu mới...</div>;
    if (!product) return <div className="text-center py-5 text-danger font-weight-bold">Sản phẩm này không tồn tại trên hệ thống!</div>;

    return (
        <div className="container py-5">
            <div className="row mt-3 bg-white p-4 rounded shadow-sm">
                {/* ẢNH SẢN PHẨM */}
                <div className="col-md-5">
                    <img 
                        src={`${IMAGE_BASE_URL}${product.imageUrl}`} 
                        alt={product.name} 
                        className="w-100" 
                        style={{ objectFit: 'contain', height: '400px' }} 
                    />
                </div>

                {/* THÔNG TIN & MUA HÀNG */}
                <div className="col-md-7">
                    <h2 className="font-weight-bold text-dark mb-3">{product.name}</h2>
                    <h3 className="text-danger font-weight-bold mb-4">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </h3>

                    <div className="mb-4">
                        <span className="badge badge-light py-2 px-3 border border-secondary text-dark">
                            <i className="fa-solid fa-warehouse mr-2"></i>
                            Số lượng tồn kho thực tế: <strong>{product.stockQuantity}</strong> chiếc
                        </span>
                    </div>

                    <p className="text-secondary mb-4 text-justify" style={{ fontSize: '15px', lineHeight: '1.8' }}>
                        {product.description || "Mô tả sản phẩm đang được cập nhật."}
                    </p>

                    <hr className="my-4"/>

                    {/* HÀNH ĐỘNG MUA HÀNG */}
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: '15px' }}>
                        <div className="quantity-select-wrapper">
                            <label className="small text-muted font-weight-bold d-block">SỐ LƯỢNG MUA:</label>
                            <input 
                                type="number" 
                                className="form-control text-center font-weight-bold" 
                                value={quantity} 
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                style={{ width: '100px' }}
                            />
                        </div>
                        
                        <div className="btn-action-wrapper flex-grow-1 pt-4">
                            <button className="btn btn-warning btn-lg font-weight-bold w-100" onClick={handleAddToCartSubmit}>
                                <i className="fa-solid fa-cart-plus mr-2"></i> THÊM VÀO GIỎ HÀNG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;