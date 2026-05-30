using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Bắt buộc để dùng lệnh Include()
using CMS.Data; // Bắt buộc để dùng ApplicationDbContext
using System.Diagnostics;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        // 1. Khai báo quyền truy cập Database
        private readonly ApplicationDbContext _context;

        // 2. Tiêm DbContext vào Controller
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // 3. Dùng LINQ: Lấy đúng 3 bài viết mới nhất kèm theo Tên Danh Mục
            var latestPosts = _context.Posts
                                      .Include(p => p.Category)
                                      .OrderByDescending(p => p.CreatedDate)
                                      .Take(3)
                                      .ToList();

            // 4. Trả dữ liệu 3 bài viết này ra giao diện Trang chủ
            return View(latestPosts);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}