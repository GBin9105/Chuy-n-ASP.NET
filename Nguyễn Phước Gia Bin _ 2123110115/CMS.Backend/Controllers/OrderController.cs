using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering; // Cần thiết cho Dropdown (SelectList)
using Microsoft.EntityFrameworkCore;      // Cần thiết cho Include()
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. READ - HIỂN THỊ DANH SÁCH ĐƠN HÀNG
        // ==========================================
        public IActionResult Index()
        {
            // Lấy danh sách đơn hàng và kết nối sang bảng Customer để lấy thông tin
            // (Sắp xếp đơn hàng mới nhất lên đầu)
            var orders = _context.Orders
                                 .Include(o => o.Customer)
                                 .OrderByDescending(o => o.Id)
                                 .ToList();
            return View(orders);
        }

        // ==========================================
        // 2. CREATE - TẠO ĐƠN HÀNG MỚI
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            // Lấy danh sách Khách hàng đổ vào Menu xổ xuống
            // (Lưu ý: Thay "Name" hoặc "FullName" cho đúng với cột tên trong bảng Customer của bạn)
            ViewBag.CustomerList = new SelectList(_context.Customers.ToList(), "Id", "FullName");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Order model)
        {
            _context.Orders.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ==========================================
        // 3. UPDATE - SỬA ĐƠN HÀNG
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            // Lấy danh sách Khách hàng và chọn sẵn khách cũ của đơn hàng
            ViewBag.CustomerList = new SelectList(_context.Customers.ToList(), "Id", "FullName", order.CustomerId);
            return View(order);
        }

        [HttpPost]
        public IActionResult Edit(Order model)
        {
            _context.Orders.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ==========================================
        // 4. DELETE - XÓA ĐƠN HÀNG
        // ==========================================
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}