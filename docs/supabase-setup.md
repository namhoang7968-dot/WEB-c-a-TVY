# Hướng Dẫn Cấu Hình Cơ Sở Dữ Liệu Supabase

Tài liệu này hướng dẫn cài đặt và thiết lập cơ sở dữ liệu Supabase cho Creator Studio Dashboard.

---

## 1. Khởi Tạo Cơ Sở Dữ Liệu

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com).
2. Tạo dự án mới hoặc chọn dự án hiện có.
3. Truy cập vào mục **SQL Editor** trong thanh menu bên trái.
4. Mở tệp `schemas/supabase_schema.sql` trong dự án.
5. Dán toàn bộ nội dung SQL vào khung soạn thảo và nhấn **Run**.

---

## 2. Danh Sách 8 Bảng Dữ Liệu Được Tạo

| Tên Bảng | Mô Tả Chức Năng | Khóa Chính |
| :--- | :--- | :--- |
| `gsa_contents` | Lịch nội dung, 8 bài bắt buộc, tiến độ & deadline | `id` (text / uuid) |
| `gsa_ideas` | Ngân hàng ý tưởng, gắn nhãn tags, trạng thái | `id` (text / uuid) |
| `gsa_checklist` | Danh sách đầu việc cần làm trong chiến dịch | `id` (text / uuid) |
| `gsa_metrics` | Số liệu thủ công cho 8 bài bắt buộc | `id` (text / uuid) |
| `gsa_profile_growth` | Theo dõi tăng trưởng Followers và Link Clicks bio | `id` (text / uuid) |
| `gsa_conversions` | Theo dõi clicks và đăng ký gói Google AI Plus | `id` (text / uuid) |
| `gsa_weekly_summaries` | Báo cáo tổng kết tuần & bài học kinh nghiệm | `id` (text / uuid) |
| `gsa_settings` | Cấu hình tên tác giả, trạng thái đồng bộ | `id` (text) |
| `social_metrics` | Dữ liệu đồng bộ tự động từ TikTok & Facebook | `post_id` (text) |

---

## 3. Cấu Hình Biến Môi Trường (.env)

Tạo tệp `.env` tại thư mục gốc dựa theo `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

*Lưu ý: Không chia sẻ hoặc đưa file `.env` lên các kho lưu trữ công khai.*
