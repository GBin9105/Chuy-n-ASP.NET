using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering; // Bắt buộc phải có để làm Menu xổ xuống (Dropdown)
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. READ - HIỂN THỊ DANH SÁCH & CHI TIẾT
        // ==========================================
        public IActionResult Index(int? id)
        {
            var query = _context.Posts.Include(p => p.Category).AsQueryable();
            if (id.HasValue) query = query.Where(p => p.CategoryId == id.Value);

            var posts = query.OrderByDescending(p => p.CreatedDate).ToList();
            return View(posts);
        }

        public IActionResult Details(int id)
        {
            var post = _context.Posts.Include(p => p.Category).FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // ==========================================
        // 2. CREATE - THÊM MỚI BÀI VIẾT
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            // Lấy danh sách Category từ Database, đóng gói vào ViewBag để gửi ra giao diện làm Menu xổ xuống
            ViewBag.CategoryList = new SelectList(_context.Categories.ToList(), "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model)
        {
            model.CreatedDate = DateTime.Now; // Tự động lấy giờ hệ thống hiện tại gán vào ngày đăng
            _context.Posts.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ==========================================
        // 3. UPDATE - SỬA BÀI VIẾT
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            // Lấy danh sách Category và chọn sẵn danh mục cũ của bài viết
            ViewBag.CategoryList = new SelectList(_context.Categories.ToList(), "Id", "Name", post.CategoryId);
            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post model)
        {
            _context.Posts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ==========================================
        // 4. DELETE - XÓA BÀI VIẾT
        // ==========================================
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}