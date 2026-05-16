using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using System.Collections.Generic;
using System;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        // 1. Trang danh sách bài viết
        public IActionResult Index()
        {
            var posts = new List<Post>
            {
                new Post
                {
                    Id = 1,
                    Title = "Lộ trình học ASP.NET Core cho người mới",
                    Content = "Nội dung bài viết về lộ trình học .NET chi tiết từ cơ bản đến nâng cao...",
                    ImageUrl = "https://picsum.photos/id/1/300/200",
                    CreatedDate = DateTime.Now
                },
                new Post
                {
                    Id = 2,
                    Title = "ReactJS và WebAPI: Xu hướng Fullstack 2026",
                    Content = "Nội dung bài viết về sự kết hợp tuyệt vời giữa React và API trong kiến trúc hiện đại...",
                    ImageUrl = "https://picsum.photos/id/2/300/200",
                    CreatedDate = DateTime.Now.AddDays(-1)
                },
                new Post
                {
                    Id = 3,
                    Title = "Hướng dẫn cài đặt môi trường Visual Studio",
                    Content = "Các bước cài đặt công cụ và tiện ích mở rộng cần thiết cho lập trình viên .NET...",
                    ImageUrl = "https://picsum.photos/id/3/300/200",
                    CreatedDate = DateTime.Now.AddDays(-2)
                }
            };

            return View(posts);
        }

        // 2. Trang chi tiết bài viết (Trang 18)
        public IActionResult Details(int id)
        {
            var post = new Post
            {
                Id = id,
                Title = "Nội dung chi tiết bài viết số " + id,
                Content = "Đây là nội dung đầy đủ và chi tiết của bài viết mà bạn vừa click vào. Ở đây code có thể viết dài hơn để thấy sự khác biệt với trang danh sách."
            };
            return View(post);
        }
    }
}