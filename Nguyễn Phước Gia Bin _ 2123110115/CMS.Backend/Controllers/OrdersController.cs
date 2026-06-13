using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 1. API ĐẶT HÀNG (POST) - LUỒNG CỐT LÕI CỦA E-COMMERCE
        // Đường dẫn: POST /api/Orders
        // ========================================================
        [HttpPost]
        public IActionResult CreateOrder([FromBody] OrderRequest request)
        {
            if (request.CartItems == null || !request.CartItems.Any())
            {
                return BadRequest(new { message = "Giỏ hàng trống, không thể đặt hàng!" });
            }

            // BƯỚC 1: TẠO BẢN GHI VÀO BẢNG Order (Đơn hàng gốc)
            var order = new Order
            {
                CustomerId = request.CustomerId,
                OrderDate = DateTime.Now,
                Status = 0 // Mặc định 0 là "Chờ duyệt"
            };

            _context.Orders.Add(order);
            _context.SaveChanges(); // Lưu xuống DB để hệ thống sinh ra Order.Id

            // BƯỚC 2 & 3: LẶP QUA GIỎ HÀNG -> LƯU CHI TIẾT & TRỪ TỒN KHO
            foreach (var item in request.CartItems)
            {
                // Thêm vào bảng OrderDetail
                var orderDetail = new OrderDetail
                {
                    OrderId = order.Id,       // Lấy ID vừa sinh ra ở trên
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Price    // Lưu lại giá tại thời điểm mua (tránh việc sau này giá đổi)
                };
                _context.OrderDetails.Add(orderDetail);

                // Khấu trừ số lượng tồn kho trong bảng Product
                var product = _context.Products.Find(item.ProductId);
                if (product != null)
                {
                    // Trừ kho (Đảm bảo kho không bị âm)
                    product.StockQuantity = product.StockQuantity >= item.Quantity
                        ? product.StockQuantity - item.Quantity
                        : 0;
                }
            }

            // Lưu toàn bộ chi tiết và cập nhật tồn kho cùng lúc
            _context.SaveChanges();

            return Ok(new { message = "Đặt hàng thành công!", orderId = order.Id });
        }

        // ========================================================
        // 2. API XEM LỊCH SỬ MUA HÀNG CỦA KHÁCH (GET)
        // Đường dẫn: GET /api/Orders/customer/{customerId}
        // ========================================================
        [HttpGet("customer/{customerId}")]
        public IActionResult GetCustomerOrders(int customerId)
        {
            var orders = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status
                })
                .ToList();

            return Ok(orders);
        }
    }

    // ========================================================
    // CÁC CLASS DTO HỖ TRỢ ĐỂ HỨNG DỮ LIỆU TỪ REACTJS
    // ========================================================
    public class OrderRequest
    {
        public int CustomerId { get; set; }
        public List<CartItemRequest> CartItems { get; set; }
    }

    public class CartItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}