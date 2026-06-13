using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using CMS.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// ==========================================
// 1. CẤU HÌNH SWAGGER (Đã hết lỗi đỏ sau khi cài Package)
// ==========================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký DbContext kết nối Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Khai báo dịch vụ xác thực bằng Cookie (Buổi 5)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

// ========================================================
// BUỔI 6: ĐĂNG KÝ CHÍNH SÁCH CORS (CORS POLICY)
// ========================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // Cho phép mọi nguồn (bao gồm cả ReactJS localhost:3000) gọi vào
              .AllowAnyMethod()   // Cho phép dùng tất cả phương thức (GET, POST, PUT, DELETE)
              .AllowAnyHeader();  // Cho phép gửi mọi kiểu dữ liệu Header lên kèm theo
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
else
{
    // ==========================================
    // 2. KÍCH HOẠT HIỂN THỊ GIAO DIỆN SWAGGER 
    // ==========================================
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// ========================================================
// BUỔI 6: KÍCH HOẠT CHÍNH SÁCH CORS (VỊ TRÍ BẮT BUỘC)
// Mẹo: Lệnh này PHẢI nằm ngay dưới app.UseRouting() 
// và nằm TRÊN các lệnh xác thực UseAuthentication, UseAuthorization.
// ========================================================
app.UseCors("AllowAll");

app.UseAuthentication(); // Xác nhận "Anh là ai?"
app.UseAuthorization();  // Xác nhận "Anh được làm gì?"

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();