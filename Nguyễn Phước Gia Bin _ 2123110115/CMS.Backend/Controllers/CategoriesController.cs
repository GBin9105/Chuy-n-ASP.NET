using Microsoft.AspNetCore.Mvc;
using System.Linq;
using CMS.Data; // Đảm bảo gọi đúng DbContext của bạn

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Cấp quyền cho ReactJS lấy toàn bộ danh sách Chủ đề
        [HttpGet]
        public IActionResult Get()
        {
            var data = _context.Categories.ToList();
            return Ok(data);
        }
    }
}