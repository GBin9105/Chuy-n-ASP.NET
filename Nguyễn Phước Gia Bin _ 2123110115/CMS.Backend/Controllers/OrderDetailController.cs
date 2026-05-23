using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
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

        public IActionResult Index(int id)
        {
            // Nếu không truyền id, hệ thống tự động tìm đơn hàng số 3 bạn vừa tạo thành công
            if (id == 0) id = 3;

            // Lấy chi tiết hóa đơn dựa theo OrderId, kết nối sang bảng Product để lấy tên sản phẩm
            var orderDetails = _context.OrderDetails
                                       .Include(od => od.Product)
                                       .Where(od => od.OrderId == id)
                                       .ToList();

            // Tính tổng tiền của hóa đơn
            decimal totalOrderPrice = orderDetails.Sum(item => item.Quantity * item.UnitPrice);

            ViewData["OrderId"] = id;
            ViewData["TotalOrderPrice"] = totalOrderPrice;

            return View(orderDetails);
        }
    }
}