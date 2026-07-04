import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

// 1. IMPORT TỔNG ĐÀI CONTEXT GIỎ HÀNG
import { CartContext } from '../../context/CartContext'; // Căn chỉnh lại dấu ../ nếu thư mục của bạn sâu hơn

const IMAGE_BASE_URL = "https://localhost:7053"; 

function Cart() {
    // 2. LẤY DỮ LIỆU VÀ CÁC HÀM XỬ LÝ TỪ CONTEXT DÙNG CHUNG
    const { cartItems, setCartItems } = useContext(CartContext);

    // 3. Hàm xóa sản phẩm khỏi giỏ hàng (Đồng bộ thẳng lên Context)
    const handleRemoveItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('POWER_TOOLS_CART', JSON.stringify(updatedCart));
    };

    // 4. Hàm tăng/giảm số lượng có check tồn kho (Đồng bộ thẳng lên Context)
    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return; // Không cho giảm dưới 1
        
        const updatedCart = cartItems.map(item => {
            if (item.productId === productId) {
                if (newQuantity > item.stockQuantity) {
                    alert(`⚠️ Kho hàng hiện chỉ còn ${item.stockQuantity} chiếc!`);
                    return item; 
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        
        setCartItems(updatedCart);
        localStorage.setItem('POWER_TOOLS_CART', JSON.stringify(updatedCart));
    };

    // Tính tổng tiền thanh toán
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Format tiền tệ VNĐ
    const formatVND = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };

    return (
        <div className="container py-5">
            <h2 className="font-weight-bold text-uppercase mb-4">Giỏ hàng của bạn</h2>
            
            {cartItems.length === 0 ? (
                <div className="text-center py-5 bg-white shadow-sm rounded">
                    <h5 className="text-secondary mb-4">Giỏ hàng đang trống</h5>
                    <Link to="/products" className="btn btn-warning font-weight-bold px-4 py-2">
                        <i className="fa-solid fa-arrow-left mr-2"></i> TIẾP TỤC MUA SẮM
                    </Link>
                </div>
            ) : (
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle text-center">
                                        <thead className="bg-light">
                                            <tr>
                                                <th scope="col" className="border-0">Sản phẩm</th>
                                                <th scope="col" className="border-0">Đơn giá</th>
                                                <th scope="col" className="border-0" style={{ width: '150px' }}>Số lượng</th>
                                                <th scope="col" className="border-0">Thành tiền</th>
                                                <th scope="col" className="border-0">Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item) => (
                                                <tr key={item.productId}>
                                                    <td className="text-left d-flex align-items-center">
                                                        <img 
                                                            src={`${IMAGE_BASE_URL}${item.imageUrl}`} 
                                                            alt={item.name} 
                                                            style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
                                                            className="rounded mr-3 border p-1"
                                                        />
                                                        <span className="font-weight-bold">{item.name}</span>
                                                    </td>
                                                    <td className="align-middle text-danger font-weight-bold">
                                                        {formatVND(item.price)}
                                                    </td>
                                                    <td className="align-middle">
                                                        <input 
                                                            type="number" 
                                                            className="form-control text-center mx-auto" 
                                                            value={item.quantity}
                                                            onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                                                        />
                                                    </td>
                                                    <td className="align-middle font-weight-bold">
                                                        {formatVND(item.price * item.quantity)}
                                                    </td>
                                                    <td className="align-middle">
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger" 
                                                            onClick={() => handleRemoveItem(item.productId)}
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bảng tóm tắt đơn hàng */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4">
                            <h5 className="font-weight-bold mb-4 border-bottom pb-3">Tóm tắt đơn hàng</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Tổng số lượng:</span>
                                <strong>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} sản phẩm</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <span className="text-muted">Tạm tính:</span>
                                <h4 className="text-danger font-weight-bold">{formatVND(totalPrice)}</h4>
                            </div>
                            <Link to="/checkout" className="btn btn-warning btn-block font-weight-bold py-3 mb-2">
                                TIẾN HÀNH THANH TOÁN
                            </Link>
                            <Link to="/products" className="btn btn-outline-secondary btn-block font-weight-bold">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;