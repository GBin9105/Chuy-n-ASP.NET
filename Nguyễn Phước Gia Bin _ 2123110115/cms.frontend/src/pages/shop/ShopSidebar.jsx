import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

function ShopSidebar({ activeCategory, minPrice, maxPrice, onFilterChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cục bộ cho ô nhập giá để không gọi API liên tục khi đang gõ
    const [localMin, setLocalMin] = useState(minPrice || '');
    const [localMax, setLocalMax] = useState(maxPrice || '');

    // Cập nhật lại ô nhập nếu người dùng bấm "Xóa bộ lọc" từ bên ngoài
    useEffect(() => {
        setLocalMin(minPrice || '');
        setLocalMax(maxPrice || '');
    }, [minPrice, maxPrice]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await categoryProductService.getAllCategoryProducts();
                setCategories(response.data || response);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Hàm chỉ gọi API khi người dùng thực sự bấm nút Lọc
    const handleApplyPrice = () => {
        onFilterChange({ minPrice: localMin, maxPrice: localMax });
    };

    return (
        <div className="card p-3 shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <h6 className="font-weight-bold text-uppercase mb-3" style={{ color: '#005088', letterSpacing: '1px' }}>
                <i className="fas fa-filter mr-2"></i>Danh Mục
            </h6>

            <div className="list-group list-group-flush mb-4">
                <button 
                    className={`list-group-item list-group-item-action border-0 px-2 d-flex align-items-center ${activeCategory === null ? 'text-primary font-weight-bold bg-light' : 'text-secondary'}`}
                    onClick={() => onFilterChange({ categoryProductId: null })}
                    style={{ borderRadius: '8px', transition: 'all 0.2s' }}
                >
                    <i className={`fas fa-chevron-right mr-2 small ${activeCategory === null ? 'opacity-100' : 'opacity-0'}`}></i>
                    Tất cả sản phẩm
                </button>

                {loading ? (
                    <div className="text-center py-3">Đang tải...</div>
                ) : (
                    categories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`list-group-item list-group-item-action border-0 px-2 d-flex align-items-center ${activeCategory === cat.id ? 'text-primary font-weight-bold bg-light' : 'text-secondary'}`}
                            onClick={() => onFilterChange({ categoryProductId: cat.id })}
                            style={{ borderRadius: '8px', transition: 'all 0.2s' }}
                        >
                            <i className={`fas fa-chevron-right mr-2 small ${activeCategory === cat.id ? 'opacity-100' : 'opacity-0'}`}></i>
                            {cat.name}
                        </button>
                    ))
                )}
            </div>

            <h6 className="font-weight-bold text-uppercase mb-3" style={{ color: '#005088', letterSpacing: '1px' }}>
                Khoảng Giá (đ)
            </h6>
            <div className="price-filter-inputs">
                <input 
                    type="number" 
                    className="form-control mb-2" 
                    placeholder="Từ..." 
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                />
                <input 
                    type="number" 
                    className="form-control mb-3" 
                    placeholder="Đến..." 
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                />
                
                {/* NÚT LỌC GIÁ */}
                <button 
                    className="btn btn-sm btn-primary btn-block font-weight-bold mb-2"
                    onClick={handleApplyPrice}
                >
                    Lọc Giá
                </button>

                <button 
                    className="btn btn-sm btn-outline-secondary btn-block"
                    onClick={() => {
                        setLocalMin('');
                        setLocalMax('');
                        onFilterChange({ categoryProductId: null, minPrice: '', maxPrice: '', keyword: '' });
                    }}
                >
                    Xóa bộ lọc
                </button>
            </div>
        </div>
    );
}

export default ShopSidebar;