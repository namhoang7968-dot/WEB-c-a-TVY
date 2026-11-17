# Creator Studio Dashboard - GSA Campaign

Ứng dụng web quản lý nội dung và công việc cá nhân dành cho Creator / Ambassador trong chiến dịch GSA (Google Student Ambassador) Campaign.
Giao diện được thiết kế chuẩn xác, tinh tế theo phong cách Dashboard hiện đại giống hệt bản thiết kế mẫu.

---

## 🚀 Công Nghệ Sử Dụng

- **React 18** (Vite)
- **Tailwind CSS v3** (Tùy biến bảng màu Slate & Brand chuẩn xác)
- **Lucide React Icons** (Bộ icon tối giản, sắc nét)
- **LocalStorage Data Service** (Kiến trúc phân tầng dịch vụ tách biệt, sẵn sàng kết nối Supabase)
- **UTF-8 BOM CSV Exporter** (Mở trực tiếp trên Microsoft Excel không bị lỗi font tiếng Việt)

---

## 🌟 Cấu Trúc & Tính Năng Chi Tiết

### 1. Sidebar Bên Trái (Nền tối `#0F172A`)
- **Logo & Tiêu đề:** `CREATOR STUDIO - GSA Campaign 2024`
- **Các tab chính:**
  - `Tổng quan`: Thống kê tổng quan KPI, tiến độ 8 bài bắt buộc, danh sách bài sắp tới.
  - `Lịch nội dung` (*Mặc định active*): Bảng quản lý chi tiết các bài đăng, lọc theo trạng thái, nhóm và tìm kiếm nhanh.
  - `Số liệu thủ công`: Bảng nhập chỉ số Views, Likes, Comments, Shares, Saves cho từng bài đăng sau xuất bản.
  - `Phân tích hiệu quả`: Bảng xếp hạng Top bài có reach cao nhất, phân tích tỷ trọng theo nền tảng (TikTok, FB, Threads).
  - `Ngân hàng ý tưởng`: Lưu trữ các ý tưởng sáng tạo, gắn nhãn (tags), và chuyển thẳng sang lịch đăng chỉ với 1 click.
  - `Phát triển trang cá nhân`: Theo dõi mục tiêu tăng trưởng người theo dõi & lượt click bio link.
  - `Theo dõi chuyển đổi`: Link UTM cá nhân hóa, đo lường lượt clicks & đăng ký form.
  - `Checklist chiến dịch`: Danh sách các đầu việc quan trọng cần hoàn thành trong suốt chiến dịch.
- **Nhóm QUẢN LÝ:**
  - `Tổng kết tuần`: Viết báo cáo tổng kết, đúc kết bài học từng tuần.
  - `Cài đặt & Dữ liệu`: Xuất/nhập file sao lưu JSON, đặt lại dữ liệu gốc, và cấu hình kết nối Supabase.
- **Thẻ Mục tiêu chiến dịch (Dưới cùng sidebar):**
  - Hiển thị tiến độ hoàn thành 8 bài bắt buộc kèm thanh tiến độ trực quan cập nhật theo thời gian thực.

### 2. Khu Vực Chính (Nền sáng `#F8FAFC`)
- **Header:**
  - Breadcrumb: `GSA Campaign / Lịch nội dung`
  - Tiêu đề lớn & mô tả phụ
  - Badge trạng thái: `• Dữ liệu lưu trên thiết bị`
  - Nút chính: `+ Tạo nội dung`
- **Thanh công cụ lọc:**
  - Ô tìm kiếm: Tìm nhanh theo mã, chủ đề, kênh, mô tả.
  - Dropdown lọc trạng thái: `Đang làm`, `Đã đăng`, `Chưa làm`, `Tất cả`.
  - Dropdown lọc nhóm: `Tất cả nhóm`, `Bài bắt buộc`, `Nội dung bổ sung`.
  - Nút `Xuất CSV`: Xuất file danh sách bài viết định dạng `.csv` hỗ trợ tiếng Việt có dấu trong Excel.
- **Bảng dữ liệu quản trị:**
  - `MÃ / NHÓM`: Mã bài viết kèm badge xanh "Bài bắt buộc" hoặc "Nội dung bổ sung".
  - `CHỦ ĐỀ & MỤC TIÊU`: Tiêu đề in đậm, mô tả chi tiết, link bài đăng thực tế.
  - `KÊNH / ĐỊNH DẠNG`: TikTok / Video ngắn, Facebook cá nhân / Bài viết...
  - `NGÀY DỰ KIẾN`: Ngày dự kiến đăng và Hạn chót (Deadline).
  - `TRẠNG THÁI`: Badge màu sinh động ("Đang làm", "Đã đăng", "Chưa làm").
  - `THAO TÁC`: Nút `Sửa` (mở Modal chỉnh sửa) và nút `Xóa` (hộp thoại xác nhận an toàn).

### 3. Tương Tác & Quản Lý Dữ Liệu
- Tạo bài mới hoặc Sửa bài mở Modal form nhập đầy đủ thông tin.
- Dữ liệu lưu trong `localStorage` giúp dữ liệu không bị mất khi F5 hoặc tắt trình duyệt.
- Tầng service `src/services/contentService.js` được thiết kế trừu tượng độc lập để dễ dàng thay thế bằng API Supabase khi cần kết nối cơ sở dữ liệu từ xa.

---

## 🛠 Hướng Dẫn Chạy & Phát Triển

1. **Cài đặt thư viện:**
   ```bash
   cd d:\WEBTVY
   npm install
   ```

2. **Chạy máy chủ phát triển (Dev server):**
   ```bash
   npm run dev
   ```
   Truy cập trình duyệt: `http://localhost:3000`

3. **Build sản phẩm (Production build):**
   ```bash
   npm run build
   ```
   File tĩnh được xuất ra thư mục `dist/`.

---

## 🌐 Hướng Dẫn Tích Hợp Supabase (Bước Tiếp Theo)

Khi bạn muốn chuyển từ `localStorage` sang đám mây **Supabase**:
1. Vào tab **Cài đặt & Dữ liệu** trong ứng dụng.
2. Nhập `Supabase Project URL` và `Anon Public Key`.
3. Trong Supabase, tạo bảng `gsa_contents` với các cột tương ứng:
   - `id` (text / uuid primary key)
   - `code` (text)
   - `group` (text)
   - `topic` (text)
   - `description` (text)
   - `channel` (text)
   - `format` (text)
   - `scheduled_date` (text)
   - `deadline` (text)
   - `status` (text)
   - `link` (text)
   - `notes` (text)
