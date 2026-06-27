import React from 'react';

function LoadingOrEmpty({ isLoading, totalItems, children }) {
    if (isLoading) {
        return <div className="text-center py-5"><h4>Đang tải dữ liệu...</h4></div>;
    }

    if (totalItems === 0) {
        return (
            <div className="text-center py-5 my-4 bg-white rounded shadow-sm">
                <h5 className="font-weight-bold text-secondary mt-3">RẤT TIẾC, KHÔNG CÓ SẢN PHẨM PHÙ HỢP</h5>
                <p className="text-muted small">Vui lòng nới rộng khoảng giá hoặc kiểm tra lại từ khóa tìm kiếm.</p>
            </div>
        );
    }

    return children;
}

export default LoadingOrEmpty;