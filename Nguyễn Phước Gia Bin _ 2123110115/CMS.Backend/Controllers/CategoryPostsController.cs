using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; // Thay bằng namespace chứa ApplicationDbContext của bạn
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryPostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryPostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API Endpoint: GET https://localhost:7111/api/CategoryPosts
        /// Lấy toàn bộ danh mục bài viết tin tức từ SQL Server
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.Categories.ToListAsync(); // Đảm bảo gọi đúng bảng Categories bài viết
                return Ok(categories); // Trả về HTTP 200 kèm mảng JSON
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống SQL Server: {ex.Message}");
            }
        }
    }
}