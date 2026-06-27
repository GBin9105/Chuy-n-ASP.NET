import React from 'react';

function ShopHeader({ total, keyword, onSearchChange }) {
    return (
        <div className="card p-3 mb-4 shadow-sm border-0">
            <div className="row align-items-center">
                <div className="col-md-4">
                    <span className="font-weight-bold text-secondary">
                        Tìm thấy <span className="text-primary">{total}</span> sản phẩm
                    </span>
                </div>
                <div className="col-md-8">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Gõ từ khóa tìm máy khoan, máy mài..." 
                        value={keyword}
                        onChange={(e) => onSearchChange({ keyword: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}

export default ShopHeader;