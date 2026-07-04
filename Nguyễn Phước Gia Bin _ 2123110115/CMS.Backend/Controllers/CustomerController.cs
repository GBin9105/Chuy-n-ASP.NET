using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Bổ sung thư viện này để dùng AsNoTracking()
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. DANH SÁCH KHÁCH HÀNG
        // ==========================================
        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();
            return View(customers);
        }

        // ==========================================
        // 2. THÊM MỚI KHÁCH HÀNG
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer customer)
        {
            if (ModelState.IsValid)
            {
                // TIÊU CHÍ 33: Mã hóa mật khẩu khi Admin tạo mới khách hàng
                if (!string.IsNullOrEmpty(customer.Password))
                {
                    customer.Password = BCrypt.Net.BCrypt.HashPassword(customer.Password);
                }

                _context.Customers.Add(customer);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(customer);
        }

        // ==========================================
        // 3. SỬA THÔNG TIN KHÁCH HÀNG
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            // Làm rỗng ô mật khẩu khi load View Edit (để Admin không nhìn thấy mã băm loằng ngoằng)
            // Nếu Admin muốn đổi mật khẩu thì nhập mới, không thì cứ để trống.
            customer.Password = "";

            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer customer)
        {
            if (ModelState.IsValid)
            {
                // 1. Tìm bản ghi khách hàng gốc trong Database (Dùng AsNoTracking để tránh xung đột Entity)
                var existingCustomer = _context.Customers.AsNoTracking().FirstOrDefault(c => c.Id == customer.Id);
                if (existingCustomer == null) return NotFound();

                // 2. Xử lý mật khẩu
                if (!string.IsNullOrEmpty(customer.Password))
                {
                    // Nếu Admin có gõ chữ vào ô Mật khẩu -> Băm mật khẩu mới đó ra
                    customer.Password = BCrypt.Net.BCrypt.HashPassword(customer.Password);
                }
                else
                {
                    // Nếu Admin để trống ô Mật khẩu -> Lấy lại mật khẩu cũ đã mã hóa trong DB đắp vào
                    customer.Password = existingCustomer.Password;
                }

                // 3. Cập nhật thông tin
                _context.Customers.Update(customer);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(customer);
        }
    }
}