using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            // Tạo dữ liệu giả cho tài khoản quản trị hệ thống (Trang 16)
            var users = new List<User>
            {
                new User { Id = 1, Username = "admin_thai", FullName = "Nguyễn Cao Thái", Role = "Admin" },
                new User { Id = 2, Username = "editor_bin", FullName = "Nguyễn Phước Gia Bin", Role = "Editor" },
                new User { Id = 3, Username = "author_minh", FullName = "Lê Quang Minh", Role = "Author" }
            };

            return View(users);
        }
    }
}