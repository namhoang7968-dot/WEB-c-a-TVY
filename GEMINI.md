# GEMINI.md - Context Entrypoint & Architecture Blueprint
# Creator Studio Dashboard (WEBTVY) - GSA Campaign

Tài liệu này là **Điểm neo ngữ cảnh (Context Entrypoint)** dành cho Gemini, Antigravity AI và các Developer tham gia phát triển dự án.

---

## 1. Tổng Quan Dự Án
- **Tên dự án:** Creator Studio Dashboard (WEBTVY)
- **Mục tiêu:** Nền tảng quản lý nội dung đa kênh (TikTok & Facebook cá nhân), đo lường KPI 8 bài bắt buộc, theo dõi chuyển đổi Google AI Plus và quản trị dữ liệu cho Đại sứ Sinh viên Google (Google Student Ambassador - GSA).
- **Địa chỉ Production:** [https://web-c-a-tvy.vercel.app](https://web-c-a-tvy.vercel.app)
- **Tác giả / Kênh cá nhân:**
  - Facebook: `@thuyvy.vandinh` (https://www.facebook.com/thuyvy.vandinh)
  - TikTok: `@thuyvy.risetoshine` (https://www.tiktok.com/@thuyvy.risetoshine)

---

## 2. Tech Stack Cốt Lõi
- **Frontend Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS v3 + CSS Variables theo chuẩn Design Systems (Hallmark, Taste-Skill v2.5.1, Unslop)
- **Icons:** `lucide-react`
- **Data Visualization:** `recharts` v3
- **Database & Cloud:** Supabase JS v2 (PostgreSQL + Row Level Security + Realtime)
- **Test Runner:** `vitest` v2
- **Serverless API:** Vercel Serverless Function (`api/sync-tiktok.js`)

---

## 3. Cấu Trúc Thư Mục Chuẩn (Deterministic Structure)

```text
WEBTVY/
├── .agents/                        # Bộ quy tắc và kỹ năng AI Agent
│   ├── rules/
│   │   ├── architecture-rules.md   # Quy chuẩn phân tầng code & data sync
│   │   └── ui-guidelines.md        # Nguyên tắc UI/UX, bảng màu & typography
│   └── skills/                     # Skills thiết kế: hallmark, taste-skill, unslop
├── api/
│   └── sync-tiktok.js              # Vercel serverless function (đồng bộ ngầm TikTok)
├── docs/                           # Tài liệu kỹ thuật chi tiết
│   ├── architecture.md             # Kiến trúc hệ thống & data flow
│   ├── bookmarklets.md             # Đặc tả kỹ thuật 2 bookmarklet Facebook & TikTok
│   └── supabase-setup.md           # Hướng dẫn khởi tạo database Supabase
├── schemas/
│   └── supabase_schema.sql         # 8 bảng CSDL Supabase, RLS policies & initial seed
├── src/
│   ├── components/                 # Các component dùng chung (Header, Sidebar, Modals, Toast)
│   ├── views/                      # 9 tab chức năng chính (Overview, Calendar, Analytics...)
│   ├── services/                   # Tầng dịch vụ dữ liệu & Supabase Client
│   ├── App.jsx                     # Component gốc điều phối tabs & bắt sync_payload
│   ├── index.css                   # Tailwind base, utilities & tactile classes
│   └── main.jsx                    # Điểm vào ứng dụng React
├── tests/                          # Bộ kiểm thử tự động Vitest
│   ├── socialSync.test.js          # Unit test bộ parser số & regex bookmarklet
│   └── contentService.test.js      # Unit test bộ lọc, CRUD & CSV exporter
├── .env.example                    # Mẫu biến môi trường an toàn
├── jsconfig.json                   # Cấu hình Path Alias @/ cho IDE & Agents
├── vite.config.js                  # Vite config với Path Alias @/ & API middleware
├── tailwind.config.js              # Cấu hình bảng màu & font chữ
└── package.json                    # Scripts & dependencies
```

---

## 4. Cơ Chế Đồng Bộ Mạng Xã Hội (Bookmarklet Architecture)

1. **Khắc phục lỗi Content Security Policy (CSP):**
   - Facebook và TikTok chặn lệnh `fetch()` ra ngoài domain.
   - Bookmarklet sau khi quét DOM sẽ mã hóa JSON sang URI Component và mở trang:
     `https://web-c-a-tvy.vercel.app/?sync_source=facebook#sync_payload=<encoded_json>`
     kèm `window.name` làm kênh truyền dữ liệu phụ.
2. **Xử lý tại Web Client (`src/App.jsx`):**
   - Hook `useEffect` tự động bắt `#sync_payload` khi mở trang.
   - Parse dữ liệu và gọi `supabase.from('social_metrics').upsert(items, { onConflict: 'post_id' })`.
   - Hiển thị Toast thông báo thành công và xóa hash trên thanh URL.
3. **Độ chính xác bóc tách chỉ số:**
   - **Gom bài nhiều ảnh:** Bỏ quét `a[href*="/photo"]`, chỉ quét từ message/permalink bài đăng và gom bằng `Set(seenCards)`.
   - **Tim (Likes) & Bình luận (Comments):** Xác định trực tiếp từ hàng ngang chân bài (`summaryRow`), cô lập không đọc text từ nội dung bài viết và bỏ qua comment `[role="article"]`.

---

## 5. Lệnh Phát Triển & Kiểm Thử

```bash
# Cài đặt dependencies
npm install

# Khởi chạy môi trường phát triển (Port 3000)
npm run dev

# Chạy toàn bộ Unit Tests
npm test

# Build ứng dụng cho môi trường Production
npm run build
```
