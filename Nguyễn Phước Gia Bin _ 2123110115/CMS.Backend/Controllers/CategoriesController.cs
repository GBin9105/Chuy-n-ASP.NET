using CMS.Data; // Đảm bảo gọi đúng DbContext của bạn
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Thêm thư viện này để dùng ListAsync và EntityState
using System.Linq;
using System.Threading.Tasks;

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

        // 1. Lấy toàn bộ danh sách Chủ đề (Đã nâng cấp lên bất đồng bộ)
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.Categories.ToListAsync();
            return Ok(data);
        }

        // 2. Lấy chi tiết 1 danh mục theo ID (Dùng khi ấn vào nút Sửa để load data cũ lên form)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục này!" });
            }
            return Ok(category);
        }

        // 3. Thêm danh mục mới (Create)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        // 4. Cập nhật danh mục (Update)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category category)
        {
            // Kiểm tra xem ID trên URL và ID trong body gửi lên có khớp nhau không
            if (id != category.Id)
            {
                return BadRequest(new { message = "ID không khớp!" });
            }

            // Đánh dấu thực thể này đã bị thay đổi
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(); // Lưu xuống DB
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Categories.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Danh mục không tồn tại trên hệ thống!" });
                }
                else
                {
                    throw;
                }
            }
            return Ok(new { message = "Cập nhật thành công!" });
        }

        // 5. Xóa danh mục (Delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục để xóa!" });
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa danh mục thành công!" });
        }
    }
}