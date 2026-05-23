using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
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

        public IActionResult Index()
        {
            // Lấy danh sách đơn hàng và kết nối sang bảng Customer để lấy tên khách hàng
            var orders = _context.Orders.Include(o => o.Customer).ToList();
            return View(orders);
        }
    }
}