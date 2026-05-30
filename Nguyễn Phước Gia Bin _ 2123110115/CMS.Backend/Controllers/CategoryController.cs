using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. READ - HIỂN THỊ DANH SÁCH
        // ==========================================
        public IActionResult Index()
        {
            var data = _context.Categories.ToList();
            return View(data);
        }

        // ==========================================
        // 2. CREATE - THÊM MỚI DANH MỤC
        // ==========================================
        // Hàm GET: Mở giao diện Form nhập liệu
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // Hàm POST: Đón dữ liệu từ Form gửi lên và lưu vào SQL Server
        [HttpPost]
        public IActionResult Create(Category model)
        {
            _context.Categories.Add(model); // Thêm vào bộ nhớ tạm
            _context.SaveChanges();         // Lưu xuống SQL Server
            return RedirectToAction("Index"); // Quay về trang danh sách
        }

        // ==========================================
        // 3. UPDATE - SỬA DANH MỤC
        // ==========================================
        // Hàm GET: Tìm danh mục theo ID và đổ dữ liệu cũ ra Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null)
            {
                return NotFound();
            }
            return View(category);
        }

        // Hàm POST: Nhận dữ liệu mới từ Form và cập nhật vào SQL Server
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            _context.Categories.Update(model); // Cập nhật đối tượng
            _context.SaveChanges();            // Lưu thay đổi
            return RedirectToAction("Index");
        }

        // ==========================================
        // 4. DELETE - XÓA DANH MỤC
        // ==========================================
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng cần xóa
            var category = _context.Categories.Find(id);

            // Bước 2 & 3: Lệnh xóa và chốt phiên làm việc
            if (category != null)
            {
                _context.Categories.Remove(category);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}