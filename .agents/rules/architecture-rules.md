# Quy Chuẩn Kiến Trúc & Đồng Bộ Dữ Liệu - Creator Studio Dashboard (WEBTVY)

Tài liệu này định nghĩa các nguyên tắc phát triển mã nguồn, kiến trúc phân tầng, quản lý dữ liệu và giao thức đồng bộ mạng xã hội cho các AI Agents và Developers.

---

## 1. Phân Tầng Kiến Trúc (Architecture Layers)

Dự án được phân chia theo cấu trúc phân tầng rõ rệt:

1. **`src/views/` (Màn hình / Tabs chức năng):**
   - Chứa 9 tab màn hình chính của ứng dụng: `Overview`, `ContentCalendar`, `ManualMetrics`, `PerformanceAnalytics`, `IdeaBank`, `ProfileGrowth`, `ConversionTracker`, `CampaignChecklist`, `WeeklySummary`, `SettingsData`.
   - Quản lý state cục bộ của tab, lắng nghe realtime từ Supabase hoặc gọi qua service.

2. **`src/components/` (UI Components tái sử dụng):**
   - Chứa các thành phần giao diện dùng chung: `Header`, `Sidebar`, `Toast`, `ErrorBoundary`, và các Hộp thoại Modal (`ContentModal`, `DeleteConfirmModal`, `BookmarkletModal`).
   - Không chứa logic nghiệp vụ đặc thù của riêng một màn hình.

3. **`src/services/` (Tầng dữ liệu độc lập):**
   - `contentService.js`: Quản lý CRUD lịch bài đăng `gsa_contents`, xuất CSV chuẩn UTF-8 BOM, tính toán KPI 8 bài bắt buộc.
   - `otherDataService.js`: Quản lý các bảng phụ: `gsa_checklist`, `gsa_ideas`, `gsa_metrics`, `gsa_profile_growth`, `gsa_conversions`, `gsa_weekly_summaries`, `gsa_settings`.
   - `socialSyncService.js`: Nơi lưu trữ mã nguồn Bookmarklet (Facebook & TikTok) và hàm fetch chỉ số `social_metrics`.
   - `supabaseClient.js`: Khởi tạo Supabase client v2 với fallback an toàn.

4. **`schemas/` (Định nghĩa Lược đồ & SQL):**
   - `schemas/supabase_schema.sql`: Khởi tạo 8 bảng dữ liệu, cấu hình Row Level Security (RLS) và nạp dữ liệu mẫu ban đầu.

---

## 2. Quy Chuẩn Path Alias `@/`

- Toàn bộ các file bên trong `src/` **bắt buộc** sử dụng path alias `@/` thay vì đường dẫn tương đối (`./` hoặc `../`):
  - `@/components/...`
  - `@/views/...`
  - `@/services/...`
  - `@/App.jsx`, `@/index.css`
- Cấu hình alias được đồng bộ đồng thời tại:
  - `vite.config.js`: `resolve.alias: { '@': path.resolve(__dirname, './src') }`
  - `jsconfig.json`: `"paths": { "@/*": ["src/*"] }`

---

## 3. Quy Chuẩn Kết Nối Supabase & Realtime

1. **Thư viện Supabase JS v2:**
   - Trong `@supabase/supabase-js` v2, các phương thức `.select()`, `.insert()`, `.upsert()`, `.delete()` **không có** `.catch()`.
   - **Bắt buộc** sử dụng cú pháp `async/await` kết hợp `try / catch`:
     ```javascript
     try {
       const { data, error } = await supabase.from('table_name').upsert(payload, { onConflict: 'id' });
       if (error) throw error;
       return data;
     } catch (err) {
       console.warn('Lỗi thao tác Supabase:', err.message);
     }
     ```
2. **Chiến lược Offline-First (LocalStorage Fallback):**
   - Mọi service đều đọc từ cache LocalStorage trước để render ngay lập tức (zero latency).
   - Sau đó đồng bộ ngầm với Supabase Cloud để cập nhật dữ liệu mới nhất.

---

## 4. Giao Thức Đồng Bộ Mạng Xã Hội (Bookmarklet Protocol)

1. **Vượt rào cản Content Security Policy (CSP):**
   - Facebook và TikTok chặn lệnh `fetch()` ra domain ngoài.
   - Bookmarklet **không** dùng `fetch()` gửi trực tiếp về Supabase mà đóng gói dữ liệu JSON vào URL Hash `#sync_payload=...` và truyền qua `window.name`, sau đó mở trang Web Studio.
   - `src/App.jsx` có `useEffect` bắt tham số `#sync_payload` khi mở trang, tự động lưu vào bảng `social_metrics` và hiển thị Toast thông báo.

2. **Quy tắc bóc tách DOM Facebook:**
   - **Gom bài duy nhất:** Không quét từng link ảnh `a[href*="/photo"]` riêng rẽ. Chỉ bắt đầu từ `[data-ad-preview="message"]` hoặc permalink bài viết (`/posts/`, `/reel/`, `/videos/`), dùng `Set(seenCards)` để gom trọn thẻ cha.
   - **Vị trí số Tim (Likes):** Xác định theo vị trí nút Bình luận (`commEl`) đã tìm được, leo lên hàng ngang `summaryRow` và trích xuất số nguyên đầu tiên bên trái nút bình luận.
   - **Cách ly nội dung & bình luận:** Tuyệt đối không đọc số từ nội dung bài viết (`[data-ad-preview="message"]`) và không đọc số từ khu vực bình luận của người xem (`[role="article"]`).
   - **Lượt xem (Views):** Chỉ lấy khi có từ khóa tường minh (`views`, `lượt xem`, `plays`, `lượt tiếp cận`, `reach`). Bài ảnh thông thường luôn giữ `0`.

---

## 5. Nguyên Tắc Bảo Mật

- Tuyệt đối không commit hay đọc nội dung file `.env` chứa khóa bảo mật.
- Luôn cập nhật và duy trì file `.env.example` với các khóa mẫu để hướng dẫn thiết lập.
