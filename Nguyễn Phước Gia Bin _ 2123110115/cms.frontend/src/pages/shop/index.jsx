import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // 1. Bổ sung useLocation
import productService from '../../services/productService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';

function Shop() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sử dụng useLocation để đọc tham số URL
    const location = useLocation();

    // Bộ lọc chung
    const [filters, setFilters] = useState({
        categoryProductId: null,
        minPrice: '',
        maxPrice: '',
        keyword: ''
    });

    // 2. BẮT TỪ KHÓA TRÊN URL (TIÊU CHÍ 40)
    // useEffect này sẽ chạy mỗi khi URL thay đổi (Ví dụ: từ Header khách gõ tìm kiếm chuyển sang /products?keyword=Khoan)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const keywordUrl = searchParams.get('keyword') || '';
        
        // Cập nhật từ khóa vào state filters để kích hoạt gọi lại API
        setFilters(prev => ({
            ...prev,
            keyword: keywordUrl
        }));
    }, [location.search]);

    // Lắng nghe filters thay đổi để gọi API
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                setIsLoading(true);
                const response = await productService.getAllProducts(filters);
                
                // CODE FIX: Đảm bảo lấy đúng mảng dữ liệu dù Backend có trả về kèm Phân trang hay không
                const result = response.data || response;
                let prodArray = [];
                if (Array.isArray(result)) prodArray = result;
                else if (result.data && Array.isArray(result.data)) prodArray = result.data;
                else if (result.Data && Array.isArray(result.Data)) prodArray = result.Data;

                setProducts(prodArray);
            } catch (error) {
                console.error("Lỗi gọi API lọc sản phẩm", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFilteredProducts();
    }, [filters]);

    const handleFilterUpdate = (newFields) => {
        setFilters(prev => ({ ...prev, ...newFields }));
    };

    return (
        <div className="container py-4">
            <div className="row">
                {/* CỘT TRÁI (Sidebar) */}
                <aside className="col-md-3 mb-4">
                    <ShopSidebar 
                        activeCategory={filters.categoryProductId}
                        minPrice={filters.minPrice}
                        maxPrice={filters.maxPrice}
                        onFilterChange={handleFilterUpdate}
                    />
                </aside>

                {/* CỘT PHẢI (Main Content) */}
                <main className="col-md-9">
                    <ShopHeader 
                        total={products.length}
                        keyword={filters.keyword}
                        onSearchChange={handleFilterUpdate}
                    />
                    
                    <LoadingOrEmpty isLoading={isLoading} totalItems={products.length}>
                        <ProductList products={products} />
                    </LoadingOrEmpty>
                </main>
            </div>
        </div>
    );
}

export default Shop;