using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối Database vào để sử dụng
        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API Lấy toàn bộ danh sách bài viết (GET)
        [HttpGet]
        public IActionResult GetAll()
        {
            // Lấy dữ liệu từ Database, sắp xếp mới nhất lên đầu
            var posts = _context.Posts
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    // "Gọt tỉa" dữ liệu: chỉ lấy những thông tin Frontend cần để load nhanh hơn
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name // Lấy tên danh mục
                })
                .ToList();

            // Trả về JSON kèm mã 200 (Thành công)
            return Ok(posts);
        }
    }
}