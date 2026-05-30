using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. READ - HIỂN THỊ DANH SÁCH
        // ==========================================
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // ==========================================
        // 2. CREATE - THÊM MỚI THÀNH VIÊN
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(User model)
        {
            _context.Users.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ==========================================
        // 3. UPDATE - SỬA THÀNH VIÊN
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User model)
        {
            _context.Users.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ==========================================
        // 4. DELETE - XÓA THÀNH VIÊN
        // ==========================================
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}