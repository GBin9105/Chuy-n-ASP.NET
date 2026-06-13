using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment; // Bổ sung môi trường để lưu file

        // Tiêm cả DbContext và WebHostEnvironment vào
        public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // ==========================================
        // HIỂN THỊ TRANG DANH SÁCH SẢN PHẨM
        // ==========================================
        public IActionResult Index()
        {
            var products = _context.Products.ToList();
            return View(products);
        }

        // ==========================================
        // 1. CHỨC NĂNG THÊM MỚI (CREATE)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.Categories = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name");
            return View();
        }

        [HttpPost]
        // Bổ sung tham số IFormFile imageFile để nhận file ảnh
        public async Task<IActionResult> Create(Product product, IFormFile imageFile)
        {
            if (ModelState.IsValid)
            {
                // XỬ LÝ LƯU FILE ẢNH
                if (imageFile != null && imageFile.Length > 0)
                {
                    // Tạo thư mục uploads nếu chưa có
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    // Tạo tên file độc nhất để không bị trùng (Guid)
                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    // Copy file vào thư mục
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    // Lưu đường dẫn tương đối vào Database
                    product.ImageUrl = "/uploads/" + uniqueFileName;
                }

                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.Categories = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // ==========================================
        // 2. CHỨC NĂNG SỬA (EDIT)
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }
            ViewBag.Categories = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Product product, IFormFile imageFile)
        {
            if (ModelState.IsValid)
            {
                // NẾU ADMIN CHỌN ẢNH MỚI THÌ XỬ LÝ LƯU, KHÔNG THÌ GIỮ NGUYÊN ẢNH CŨ
                if (imageFile != null && imageFile.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    product.ImageUrl = "/uploads/" + uniqueFileName;
                }

                _context.Products.Update(product);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.Categories = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", product.CategoryProductId);
            return View(product);
        }
    }
}