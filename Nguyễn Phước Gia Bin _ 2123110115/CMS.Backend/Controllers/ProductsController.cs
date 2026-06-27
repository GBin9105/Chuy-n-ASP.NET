using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;

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
        // 1. API LẤY TOÀN BỘ DANH SÁCH & XỬ LÝ LỌC SẢN PHẨM (GET)
        // Đường dẫn: GET /api/products
        // Sử dụng ở FE: Đổ dữ liệu vào lưới và xử lý bộ lọc nâng cao
        // ========================================================
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? categoryProductId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? keyword)
        {
            try
            {
                // Khởi tạo câu truy vấn dạng IQueryable để tối ưu hiệu năng
                var query = _context.Products.AsQueryable();

                // Lọc theo Danh mục
                if (categoryProductId.HasValue)
                {
                    query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
                }

                // Lọc theo Giá tối thiểu
                if (minPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= minPrice.Value);
                }

                // Lọc theo Giá tối đa
                if (maxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= maxPrice.Value);
                }

                // Lọc theo Từ khóa tìm kiếm (Tên sản phẩm)
                if (!string.IsNullOrEmpty(keyword))
                {
                    query = query.Where(p => p.Name.Contains(keyword.Trim()));
                }

                // Sắp xếp sản phẩm mới lên đầu và thực thi câu lệnh SQL
                var products = await query.OrderByDescending(p => p.Id).ToListAsync();

                return Ok(products);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }

        // ========================================================
        // 2. API LẤY SẢN PHẨM THEO DANH MỤC (GET)
        // Đường dẫn: GET /api/products/category/{categoryProductId}
        // ========================================================
        [HttpGet("category/{categoryProductId}")]
        public async Task<IActionResult> GetByCategory(int categoryProductId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl
                })
                .ToListAsync();

            return Ok(products);
        }

        // ========================================================
        // 3. API LẤY CHI TIẾT MỘT SẢN PHẨM (GET BY ID)
        // Đường dẫn: GET /api/products/{id}
        // Sử dụng ở FE: Xử lý hiển thị trang chi tiết và fix lỗi 404
        // ========================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // Truy vấn lấy chi tiết 1 sản phẩm theo ID
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

            // Nếu không tìm thấy sản phẩm có ID tương ứng
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin sản phẩm này!" });
            }

            // Trả về toàn bộ thông tin (gồm Description, StockQuantity...) kèm mã 200 OK
            return Ok(product);
        }
    }
}