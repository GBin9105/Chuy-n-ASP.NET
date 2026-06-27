using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;
using System;

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

        // =======================================================
        // 1. API Lấy danh sách bài viết (CÓ HỖ TRỢ LỌC THEO DANH MỤC)
        // =======================================================
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? categoryId)
        {
            try
            {
                // Bước 1: Khởi tạo câu truy vấn
                var query = _context.Posts.AsQueryable();

                // Bước 2: Nếu React có gửi ID danh mục xuống thì tiến hành lọc
                if (categoryId.HasValue)
                {
                    query = query.Where(p => p.CategoryId == categoryId.Value);
                }

                // Bước 3: Sắp xếp và "gọt tỉa" dữ liệu trả về (Đã bỏ Summary bị lỗi đỏ)
                var posts = await query
                    .OrderByDescending(p => p.Id) // Sắp xếp mới nhất lên đầu
                    .Select(p => new {
                        p.Id,
                        p.Title,
                        p.ImageUrl,
                        p.Content,       // Lấy nội dung (Frontend sẽ tự rút gọn làm mô tả)
                        p.CreatedDate,
                        CategoryName = p.Category != null ? p.Category.Name : null
                    })
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống SQL Server: {ex.Message}");
            }
        }

        // =======================================================
        // 2. API Lấy chi tiết 1 bài viết (GIẢI QUYẾT LỖI 404 NOT FOUND)
        // =======================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            try
            {
                // Tìm bài viết có ID khớp với URL
                var post = await _context.Posts.FindAsync(id);

                // Nếu không tìm thấy trong Database
                if (post == null)
                {
                    return NotFound(new { message = "Bài viết này không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống." });
                }

                // Trả về toàn bộ thông tin bài viết (bao gồm cả mã HTML của nội dung)
                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống SQL Server: {ex.Message}");
            }
        }
    }
}