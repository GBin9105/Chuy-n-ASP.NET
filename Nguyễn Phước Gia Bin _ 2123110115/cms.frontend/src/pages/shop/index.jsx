import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';

function Shop() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Bộ lọc chung
    const [filters, setFilters] = useState({
        categoryProductId: null,
        minPrice: '',
        maxPrice: '',
        keyword: ''
    });

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                setIsLoading(true);
                const response = await productService.getAllProducts(filters);
                setProducts(response);
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