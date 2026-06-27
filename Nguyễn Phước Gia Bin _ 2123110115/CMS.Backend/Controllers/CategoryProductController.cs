using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities; // Thay đổi nếu namespace chứa model CategoryProduct của bạn khác
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bắt buộc phải đăng nhập tài khoản Admin mới được vào
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // INDEX - HIỂN THỊ DANH SÁCH DANH MỤC
        // ==========================================
        public IActionResult Index()
        {
            // Lấy toàn bộ dữ liệu từ bảng CategoriesProducts đẩy sang View
            var categories = _context.CategoriesProducts.ToList();
            return View(categories);
        }

        // ==========================================
        // CREATE - FORM THÊM MỚI DANH MỤC
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index"); // Thêm thành công thì quay về trang danh sách
            }
            return View(model);
        }

        // ==========================================
        // EDIT - FORM SỬA DANH MỤC
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null)
            {
                return NotFound();
            }

            // Tìm thấy thì ném dữ liệu cũ sang form để hiển thị
            return View(category);
        }

        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index"); // Sửa thành công thì quay về trang danh sách
            }
            return View(model);
        }

        // ==========================================
        // DELETE - XÓA DANH MỤC
        // ==========================================
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}