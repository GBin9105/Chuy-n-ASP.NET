using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.IO; // Thư viện để xử lý File
using System;
using System.Linq;
using Microsoft.AspNetCore.Http; // Thư viện cho IFormFile

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var posts = _context.Posts.Include(p => p.Category).ToList();
            return View(posts);
        }

        // ==========================================
        // CREATE - THÊM BÀI VIẾT (CÓ UPLOAD ẢNH)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.Categories.ToList(), "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            // 1. Xử lý Upload Ảnh
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // Xác định đường dẫn lưu file vào wwwroot/uploads
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                // Tạo tên file ngẫu nhiên để không bị trùng (vd: abc123_anh1.jpg)
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                // Copy file vào server
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                // Lưu đường dẫn vào Database
                model.ImageUrl = "/uploads/" + fileName;
            }

            // 2. Lưu bài viết vào Database
            _context.Posts.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ==========================================
        // EDIT - SỬA BÀI VIẾT (CÓ UPLOAD ẢNH MỚI)
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            ViewBag.CategoryList = new SelectList(_context.Categories.ToList(), "Id", "Name", post.CategoryId);
            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            // 1. Xử lý Upload Ảnh Mới (Nếu người dùng có chọn ảnh)
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // Nếu KHÔNG tải ảnh mới, phải tìm lại bài viết cũ để giữ nguyên link ảnh cũ
                var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldPost != null && !string.IsNullOrEmpty(oldPost.ImageUrl))
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
            }

            // 2. Cập nhật vào Database
            _context.Posts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ==========================================
        // DELETE - XÓA BÀI VIẾT
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