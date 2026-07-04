import React, { createContext, useState, useEffect } from 'react';

// 1. Khởi tạo Context
export const CartContext = createContext();

// 2. Tạo Provider để bọc ứng dụng
export const CartProvider = ({ children }) => {
    // Khởi tạo State giỏ hàng (ĐÃ ĐỔI: Lấy đúng từ khóa POWER_TOOLS_CART của dự án bạn)
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('POWER_TOOLS_CART');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Tự động đồng bộ hóa và lưu lại vào localStorage mỗi khi giỏ hàng có biến động
    useEffect(() => {
        localStorage.setItem('POWER_TOOLS_CART', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hàm thêm nhanh sản phẩm vào giỏ (Dùng cho các nút "Thêm vào giỏ" ở trang Shop/Home)
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.productId === product.productId);
            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, tự động tăng số lượng lên 1
                return prevItems.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Nếu là sản phẩm mới, thêm vào danh sách và gán số lượng mặc định là 1
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    return (
        // ĐÃ BỔ SUNG: Truyền thêm hàm setCartItems để trang Cart có thể can thiệp tăng/giảm/xóa
        <CartContext.Provider value={{ cartItems, addToCart, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};