import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const IMAGE_BASE_URL = "https://localhost:7053"; // Điều chỉnh lại cổng nếu cần

function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: ''
    });

    // 1. Lấy dữ liệu giỏ hàng
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('POWER_TOOLS_CART')) || [];
        setCartItems(storedCart);
    }, []);

    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const formatVND = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 2. Xử lý logic khi bấm Đặt Hàng
    const handlePlaceOrder = (e) => {
        e.preventDefault(); // Ngăn trình duyệt reload lại trang

        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        // Ở dự án thực tế: Chỗ này sẽ gọi API (axios.post) gửi formData và cartItems về Backend C#
        
        // Mô phỏng đặt hàng thành công
        alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\nCảm ơn anh/chị ${formData.fullName} đã mua sắm tại PowerTools.\nChúng tôi sẽ giao hàng đến: ${formData.address}`);
        
        // Xóa giỏ hàng trong LocalStorage
        localStorage.removeItem('POWER_TOOLS_CART');
        
        // Chuyển hướng người dùng về trang chủ
        navigate('/');
    };

    if (cartItems.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h4 className="mb-4">Bạn chưa có sản phẩm nào để thanh toán!</h4>
                <Link to="/products" className="btn btn-warning font-weight-bold px-4 py-2">
                    QUAY LẠI CỬA HÀNG
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="font-weight-bold text-uppercase mb-4">Thanh toán đơn hàng</h2>
            
            <form onSubmit={handlePlaceOrder}>
                <div className="row">
                    {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
                    <div className="col-lg-7 mb-4">
                        <div className="card border-0 shadow-sm p-4">
                            <h5 className="font-weight-bold mb-4 border-bottom pb-3">Thông tin nhận hàng</h5>
                            
                            <div className="form-group mb-3">
                                <label className="font-weight-bold">Họ và tên <span className="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required 
                                    placeholder="Nhập họ tên người nhận"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="font-weight-bold">Số điện thoại <span className="text-danger">*</span></label>
                                <input 
                                    type="tel" 
                                    className="form-control" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required 
                                    placeholder="Nhập số điện thoại liên hệ"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="font-weight-bold">Địa chỉ nhận hàng <span className="text-danger">*</span></label>
                                <textarea 
                                    className="form-control" 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required 
                                    rows="3" 
                                    placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã, quận/huyện...)"
                                ></textarea>
                            </div>

                            <div className="form-group mb-3">
                                <label className="font-weight-bold">Ghi chú thêm (Tùy chọn)</label>
                                <textarea 
                                    className="form-control" 
                                    name="note"
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    rows="2" 
                                    placeholder="Ví dụ: Giao hàng giờ hành chính..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm p-4 bg-light">
                            <h5 className="font-weight-bold mb-4 border-bottom pb-3">Đơn hàng của bạn</h5>
                            
                            <div className="order-items-list mb-4">
                                {cartItems.map(item => (
                                    <div key={item.productId} className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={`${IMAGE_BASE_URL}${item.imageUrl}`} 
                                                alt={item.name} 
                                                style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
                                                className="rounded bg-white border p-1 mr-3"
                                            />
                                            <div>
                                                <h6 className="mb-0 text-truncate" style={{ maxWidth: '180px' }}>{item.name}</h6>
                                                <small className="text-muted">SL: {item.quantity}</small>
                                            </div>
                                        </div>
                                        <span className="font-weight-bold">{formatVND(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-top pt-3 mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tạm tính:</span>
                                    <strong>{formatVND(totalPrice)}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Phí vận chuyển:</span>
                                    <strong>Miễn phí</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <span className="font-weight-bold" style={{ fontSize: '1.1rem' }}>TỔNG TIỀN:</span>
                                    <h4 className="text-danger font-weight-bold mb-0">{formatVND(totalPrice)}</h4>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-warning btn-lg btn-block font-weight-bold py-3">
                                XÁC NHẬN ĐẶT HÀNG
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Checkout;