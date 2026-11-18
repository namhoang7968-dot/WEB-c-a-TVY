# Đặc Tả Kỹ Thuật Bookmarklets - Đồng Bộ TikTok & Facebook

Tài liệu này ghi chép thuật toán bóc tách DOM và giao thức truyền tải dữ liệu của 2 công cụ Bookmarklet trong `src/services/socialSyncService.js`.

---

## 1. Vấn Đề Kỹ Thuật Cốt Lõi: Content Security Policy (CSP)

- **Nguyên nhân:** Facebook (`facebook.com`) và TikTok (`tiktok.com`) cấu hình tiêu đề HTTP `Content-Security-Policy` với chỉ thị `connect-src 'self' ...` chặn toàn bộ yêu cầu `fetch()` hoặc `XMLHttpRequest` gửi đến các domain bên ngoài (bao gồm `*.supabase.co`).
- **Giải pháp:** 
  1. Bookmarklet sau khi bóc tách số liệu sẽ đóng gói object `payload` sang JSON.
  2. Mã hóa an toàn bằng `encodeURIComponent(JSON.stringify(payload))`.
  3. Mở URL trang web ứng dụng với hash payload:
     ```javascript
     const targetUrl = "https://web-c-a-tvy.vercel.app/?sync_source=facebook#sync_payload=" + pEnc;
     window.open(targetUrl, "gsa_sync_" + pEnc);
     ```
  4. Ứng dụng web React bắt giá trị hash này thông qua `window.location.hash` hoặc `window.name` và tự gọi Supabase API nội bộ từ domain của chính nó.

---

## 2. Thuật Toán Bóc Tách DOM Facebook

Mã Bookmarklet Facebook thực hiện các bước sau:

1. **Khởi tạo và lọc hạt giống bài viết (Seed Elements):**
   - Tìm kiếm các phần tử nội dung: `[data-ad-preview="message"], [data-ad-comet-preview="message"]`.
   - Tìm kiếm các liên kết thời gian đăng bài: `a[href*="/posts/"], a[href*="/reel/"], a[href*="/videos/"], a[href*="permalink.php"], a[href*="story_fbid="]`.
   - **Loại trừ tuyệt đối:** `a[href*="/photo"]` (để tránh tách lẻ các ảnh con trong bài album thành các bài viết riêng).
   - **Loại trừ comment:** Bỏ qua bất kỳ phần tử nào có `el.closest('[role="article"]')` hoặc `el.closest('form')`.

2. **Xác định thẻ cha bài viết (Post Card Container):**
   - Leo ngược lên `div[data-pagelet*="FeedUnit_"]` hoặc phần tử con trực tiếp của `div[role="feed"]`.
   - Dùng `Set(seenCards)` để đảm bảo mỗi bài đăng chỉ được xử lý đúng 1 lần.

3. **Trích xuất chỉ số tương tác chân bài:**
   - **Bình luận (Comments):** Tìm kiếm trên hàng tương tác phần tử chứa chuỗi `X bình luận` hoặc `X comments` (hoặc `aria-label` tương ứng). Lưu lại phần tử này thành `commEl`.
   - **Tim / Cảm xúc (Likes):**
     - Từ `commEl`, leo lên phần tử cha chứa toàn bộ hàng ngang `summaryRow`.
     - Đọc các phần tử nằm bên trái `commEl` (nơi hiển thị cụm icon tim/like).
     - Phân tích danh sách số nguyên trên hàng ngang: Số đầu tiên đứng trước số bình luận chính là số tim (ví dụ hàng có "41" và "10" -> `likes = 41`, `comments = 10`).
   - **Lượt xem (Views / Reach):**
     - Quét chuỗi khớp regex `/([\d.,]+[KMB]?)\s*(?:views?|lượt xem|lượt phát|plays?|lượt tiếp cận|reach)/i`.
     - Nếu là bài ảnh thông thường không có lượt xem thì mặc định là `0`.

---

## 3. Thuật Toán Bóc Tách DOM TikTok

Mã Bookmarklet TikTok quét trang profile `@thuyvy.risetoshine`:

1. **Truy vấn danh sách video & photo:**
   - Tìm các liên kết `a[href*="/video/"]` và `a[href*="/photo/"]` (hỗ trợ cả bài đăng dạng album trượt).
   - Fallback: Tìm các thẻ `[data-e2e="user-post-item"]`.
2. **Trích xuất số liệu 3 chỉ số:**
   - Đọc dữ liệu từ khối `<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">` nếu có sẵn trong cache trình duyệt.
   - Fallback bóc tách trực tiếp trên thẻ item:
     - Số lượt xem từ `[data-e2e="video-views"]` hoặc chuỗi ký tự đứng sau icon `▷` (ví dụ `15.1K`, `1881`, `23.8K`).
     - Tiêu đề video từ thuộc tính `alt` của thẻ `<img>`.
3. **Hiển thị popup xác nhận:** Đưa ra danh sách video quét được kèm 3 chỉ số `👁️ Lượt xem`, `❤️ Tim`, `💬 Bình luận` trước khi chuyển tiếp về Creator Studio.
