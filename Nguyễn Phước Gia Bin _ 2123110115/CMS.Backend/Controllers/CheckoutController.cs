using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CheckoutController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // API ĐẶT HÀNG VÀ GỬI EMAIL TỰ ĐỘNG
        // ========================================================
        [HttpPost("SubmitOrder")]
        public IActionResult SubmitOrder([FromBody] OrderSubmitDto request)
        {
            // Kiểm tra giỏ hàng
            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest(new { message = "Giỏ hàng của bạn đang trống!" });
            }

            // Lấy thông tin khách hàng
            var customer = _context.Customers.Find(request.CustomerId);
            if (customer == null)
            {
                return BadRequest(new { message = "Khách hàng không tồn tại!" });
            }

            // Lưu Đơn hàng mới
            var newOrder = new Order
            {
                CustomerId = request.CustomerId,
                OrderDate = DateTime.Now
            };

            _context.Orders.Add(newOrder);
            _context.SaveChanges();

            // Lưu Chi tiết đơn hàng
            foreach (var item in request.Items)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = newOrder.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                };
                _context.OrderDetails.Add(orderDetail);
            }
            _context.SaveChanges();

            // Gửi Email
            bool isEmailSent = SendOrderConfirmationEmail(customer.Email, customer.FullName, newOrder.Id);

            return Ok(new
            {
                message = "Đặt hàng thành công!",
                orderId = newOrder.Id,
                emailSent = isEmailSent
            });
        }

        // ========================================================
        // HÀM HỖ TRỢ: GỬI EMAIL
        // ========================================================
        private bool SendOrderConfirmationEmail(string toEmail, string customerName, int orderId)
        {
            try
            {
                // ⚠️ THAY EMAIL VÀ MẬT KHẨU ỨNG DỤNG CỦA BẠN VÀO ĐÂY ⚠️
                string fromEmail = "willemregytb7@gmail.com";
                string appPassword = "ukic audy vnvm grar";

                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(fromEmail, "Cửa Hàng Của Bin");
                mail.To.Add(toEmail);
                mail.Subject = $"Xác nhận đặt hàng thành công - Mã đơn #{orderId}";
                mail.Body = $@"
                    <h3>Chào {customerName},</h3>
                    <p>Cảm ơn bạn đã tin tưởng và đặt hàng tại cửa hàng của chúng tôi.</p>
                    <p>Mã đơn hàng của bạn là: <b style='color:red;'>#{orderId}</b>.</p>
                    <p>Chúng tôi sẽ sớm liên hệ với bạn để xác nhận thời gian giao hàng.</p>
                    <br/>
                    <p>Trân trọng,<br/><b>Đội ngũ Admin Bin</b></p>
                ";
                mail.IsBodyHtml = true;

                SmtpClient smtp = new SmtpClient("smtp.gmail.com");
                smtp.Port = 587;
                smtp.EnableSsl = true;
                smtp.Credentials = new NetworkCredential(fromEmail, appPassword);

                smtp.Send(mail);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }

    // ========================================================
    // CÁC CLASS HỖ TRỢ (Đã đổi tên sang DTO để tránh đụng hàng)
    // ========================================================
    public class OrderSubmitDto
    {
        public int CustomerId { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}