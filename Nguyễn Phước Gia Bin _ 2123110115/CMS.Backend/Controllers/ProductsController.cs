using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối Database vào để sử dụng
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 1. API LẤY TOÀN BỘ DANH SÁCH SẢN PHẨM (GET)
        // Đường dẫn: GET /api/products
        // Sử dụng ở FE: Đổ dữ liệu vào lưới sản phẩm tổng quát (ProductGrid)
        // ========================================================
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderByDescending(p => p.Id) // Sản phẩm mới nhập về lên đầu
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl
                })
                .ToList();

            return Ok(products);
        }

        // ========================================================
        // 2. API LẤY SẢN PHẨM THEO DANH MỤC (GET)
        // Đường dẫn: GET /api/products/category/{categoryProductId}
        // Sử dụng ở FE: Chạy khi chọn một danh mục trên thanh menu lọc
        // ========================================================
        [HttpGet("category/{categoryProductId}")]
        public IActionResult GetByCategory(int categoryProductId)
        {
            // Mẹo: Hãy kiểm tra lại tên thuộc tính khóa ngoại trong thực thể Product của bạn 
            // (có thể là ProductCategoryId hoặc CategoryProductId) để sửa lại cho khớp nhé.
            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl
                })
                .ToList();

            return Ok(products);
        }

        // ========================================================
        // 3. API LẤY CHI TIẾT MỘT SẢN PHẨM (GET BY ID)
        // Đường dẫn: GET /api/products/{id}
        // Sử dụng ở FE: Phục vụ hiển thị thông tin trang ProductDetail.jsx
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);

            // Nếu không tìm thấy sản phẩm có ID tương ứng
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin sản phẩm này!" });
            }

            // Đối với trang chi tiết, trả về toàn bộ thực thể (gồm Description, StockQuantity...)
            return Ok(product);
        }
    }
}