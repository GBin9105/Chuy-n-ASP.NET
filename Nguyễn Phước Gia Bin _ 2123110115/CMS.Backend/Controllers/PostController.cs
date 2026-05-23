using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        // 1. Khai báo "người quản kho"
        private readonly ApplicationDbContext _context;

        // 2. Tiêm DbContext vào Controller
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 3. Action lấy danh sách bài viết THẬT
        public IActionResult Index()
        {
            var posts = _context.Posts.ToList(); // Hút data từ SQL
            return View(posts); // Đẩy ra giao diện
        }

        // Action xem chi tiết (Giữ lại cấu trúc cơ bản)
        public IActionResult Details(int id)
        {
            // Tìm đúng bài viết có Id được truyền vào
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound(); // Báo lỗi 404 nếu không tìm thấy
            }

            return View(post);
        }
    }
}