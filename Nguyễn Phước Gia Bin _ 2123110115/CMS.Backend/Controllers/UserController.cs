using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy danh sách thành viên từ Database
            var users = _context.Users.ToList();
            return View(users);
        }
    }
}