using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 1. API ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG (POST)
        // Đường dẫn: POST /api/Auth/CustomerRegister
        // ========================================================
        [HttpPost("CustomerRegister")]
        public IActionResult Register([FromBody] Customer model)
        {
            // Kiểm tra xem Email này đã có người đăng ký chưa
            var emailExist = _context.Customers.Any(c => c.Email == model.Email);
            if (emailExist)
            {
                // Trả về lỗi 400 (Bad Request) nếu trùng Email
                return BadRequest(new { message = "Email này đã được sử dụng, vui lòng dùng email khác!" });
            }

            // Lưu khách hàng mới vào Database (Bảng Customers của bạn)
            _context.Customers.Add(model);
            _context.SaveChanges();

            // Trả về mã 200 báo hiệu đăng ký thành công
            return Ok(new { message = "Đăng ký thành công!", customerId = model.Id });
        }

        // ========================================================
        // 2. API ĐĂNG NHẬP DÀNH CHO KHÁCH HÀNG (POST)
        // Đường dẫn: POST /api/Auth/CustomerLogin
        // ========================================================
        [HttpPost("CustomerLogin")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Tìm khách hàng có Email và Mật khẩu khớp với dữ liệu gửi lên
            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == request.Email && c.Password == request.Password);

            if (customer == null)
            {
                // Trả về lỗi 401 (Unauthorized) nếu sai thông tin
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác!" });
            }

            // Đăng nhập thành công -> Trả về thông tin khách hàng (TUYỆT ĐỐI KHÔNG trả về Password)
            return Ok(new
            {
                customer.Id,
                customer.FullName,
                customer.Email,
                customer.Phone,
                customer.Address
            });
        }
    }

    // ========================================================
    // CLASS HỖ TRỢ: Dùng để hứng dữ liệu Đăng nhập từ ReactJS gửi lên
    // (Bắt buộc phải có để API hiểu được Email và Password gửi từ FE)
    // ========================================================
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}