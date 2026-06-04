using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using CMS.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Hiển thị trang đăng nhập (GET)
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        // 2. Xử lý Logic đăng nhập (POST)
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            // Kiểm tra tài khoản trong Database
            var user = _context.Users.FirstOrDefault(u => u.Username == username && u.PasswordHash == password);

            if (user != null)
            {
                // Nếu đúng mật khẩu, thiết lập danh tính (Claims)
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role), // Quan trọng: Lưu vai trò Admin/Editor để lát nữa phân quyền
                    new Claim("FullName", user.FullName)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                // Đăng nhập và lưu Cookie "thẻ bài" vào trình duyệt
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                // Đăng nhập thành công thì đá về trang chủ
                return RedirectToAction("Index", "Home");
            }

            // Nếu sai thì báo lỗi
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
            return View();
        }

        // 3. Hàm Đăng xuất
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        // 4. Hiển thị trang báo lỗi khi không đủ quyền (403 Access Denied)
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}