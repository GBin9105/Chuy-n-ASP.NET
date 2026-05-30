using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering; // Để làm Menu Dropdown chọn Sản phẩm
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. READ - HIỂN THỊ CHI TIẾT CỦA 1 ĐƠN HÀNG
        // ==========================================
        public IActionResult Index(int id)
        {
            // Nếu không truyền id, hệ thống tự động tìm đơn hàng mặc định
            if (id == 0) id = 3;

            // Lấy chi tiết hóa đơn, kết nối sang bảng Product để lấy Tên sản phẩm
            var orderDetails = _context.OrderDetails
                                       .Include(od => od.Product)
                                       .Where(od => od.OrderId == id)
                                       .ToList();

            // Tính tổng tiền của hóa đơn
            decimal totalOrderPrice = orderDetails.Sum(item => item.Quantity * item.UnitPrice);

            // Truyền dữ liệu ra View
            ViewData["OrderId"] = id;
            ViewData["TotalOrderPrice"] = totalOrderPrice;

            return View(orderDetails);
        }

        // ==========================================
        // 2. CREATE - THÊM SẢN PHẨM VÀO ĐƠN HÀNG
        // ==========================================
        [HttpGet]
        public IActionResult Create(int orderId)
        {
            // Lưu lại OrderId để biết đang thêm cho đơn hàng nào
            ViewBag.OrderId = orderId;

            // Lấy danh sách Sản phẩm để làm Menu xổ xuống
            ViewBag.ProductList = new SelectList(_context.Products.ToList(), "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(OrderDetail model)
        {
            _context.OrderDetails.Add(model);
            _context.SaveChanges();

            // Lưu xong phải quay về đúng trang chi tiết của đơn hàng đó
            return RedirectToAction("Index", new { id = model.OrderId });
        }

        // ==========================================
        // 3. UPDATE - SỬA SỐ LƯỢNG / GIÁ TIỀN
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var orderDetail = _context.OrderDetails.Find(id);
            if (orderDetail == null) return NotFound();

            // Load lại danh sách Sản phẩm, bôi đen sẵn sản phẩm cũ
            ViewBag.ProductList = new SelectList(_context.Products.ToList(), "Id", "Name", orderDetail.ProductId);
            return View(orderDetail);
        }

        [HttpPost]
        public IActionResult Edit(OrderDetail model)
        {
            _context.OrderDetails.Update(model);
            _context.SaveChanges();

            // Lưu xong quay về đúng giỏ hàng
            return RedirectToAction("Index", new { id = model.OrderId });
        }

        // ==========================================
        // 4. DELETE - XÓA SẢN PHẨM KHỎI ĐƠN HÀNG
        // ==========================================
        public IActionResult Delete(int id)
        {
            var orderDetail = _context.OrderDetails.Find(id);
            if (orderDetail != null)
            {
                int currentOrderId = orderDetail.OrderId; // Giữ lại ID giỏ hàng trước khi xóa

                _context.OrderDetails.Remove(orderDetail);
                _context.SaveChanges();

                // Xóa xong quay về đúng giỏ hàng đó
                return RedirectToAction("Index", new { id = currentOrderId });
            }

            // Nếu lỗi, quay tạm về danh sách toàn bộ Order
            return RedirectToAction("Index", "Order");
        }
    }
}