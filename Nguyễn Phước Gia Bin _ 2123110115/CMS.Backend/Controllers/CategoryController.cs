using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        // 1. Khai báo "người quản kho" DbContext
        private readonly ApplicationDbContext _context;

        // 2. "Tiêm" DbContext vào Controller (Dependency Injection)
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // 3. Lấy toàn bộ dữ liệu THẬT từ bảng Categories trong SQL Server
            var data = _context.Categories.ToList();

            // 4. Đẩy dữ liệu ra giao diện View
            return View(data);
        }
    }
}