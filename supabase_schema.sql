-- ==============================================================================
-- GSA CREATOR STUDIO DASHBOARD - SUPABASE DATABASE SCHEMA
-- Bảng dữ liệu: Lịch nội dung, Ngân hàng ý tưởng, Checklist chiến dịch, Số liệu thủ công...
-- Kèm theo RLS Policy cho phép đọc/ghi qua Anon Key và dữ liệu mẫu ban đầu.
-- ==============================================================================

-- 1. BẢNG: LỊCH NỘI DUNG (gsa_contents)
CREATE TABLE IF NOT EXISTS public.gsa_contents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT NOT NULL UNIQUE,
    "group" TEXT NOT NULL DEFAULT 'Bài bắt buộc',
    topic TEXT NOT NULL,
    description TEXT,
    channel TEXT NOT NULL DEFAULT 'TikTok',
    format TEXT NOT NULL DEFAULT 'Video ngắn',
    scheduled_date TEXT NOT NULL,
    deadline TEXT,
    status TEXT NOT NULL DEFAULT 'Đang làm',
    link TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BẢNG: NGÂN HÀNG Ý TƯỞNG (gsa_ideas)
CREATE TABLE IF NOT EXISTS public.gsa_ideas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'TikTok',
    format TEXT NOT NULL DEFAULT 'Video ngắn',
    status TEXT NOT NULL DEFAULT 'Ý tưởng mới',
    notes TEXT DEFAULT '',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG: CHECKLIST CHIẾN DỊCH (gsa_checklist)
CREATE TABLE IF NOT EXISTS public.gsa_checklist (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Sản xuất nội dung',
    completed BOOLEAN DEFAULT false NOT NULL,
    deadline TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG: SỐ LIỆU THỦ CÔNG (gsa_metrics)
CREATE TABLE IF NOT EXISTS public.gsa_metrics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    content_code TEXT NOT NULL UNIQUE,
    views BIGINT DEFAULT 0,
    likes BIGINT DEFAULT 0,
    comments BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    saves BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BẢNG: TỔNG KẾT TUẦN (gsa_weekly_summaries)
CREATE TABLE IF NOT EXISTS public.gsa_weekly_summaries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    week_label TEXT NOT NULL UNIQUE,
    highlights TEXT DEFAULT '',
    next_week_plan TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BẢNG: CẤU HÌNH CHIẾN DỊCH (gsa_settings)
CREATE TABLE IF NOT EXISTS public.gsa_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    creator_name TEXT DEFAULT 'GSA Ambassador',
    campaign_name TEXT DEFAULT 'Google Student Ambassador (GSA) Campaign 2024',
    target_mandatory_posts INT DEFAULT 8,
    deadline_campaign TEXT DEFAULT '2024-11-20',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- CẤU HÌNH ROW LEVEL SECURITY (RLS) & POLICIES (CHO PHÉP TRUY CẬP TỪ WEB)
-- Cho phép đọc (SELECT), thêm (INSERT), sửa (UPDATE), xóa (DELETE) với anon key
-- ==============================================================================

-- Bật RLS cho các bảng
ALTER TABLE public.gsa_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_weekly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_settings ENABLE ROW LEVEL SECURITY;

-- 1. Policies cho gsa_contents
DROP POLICY IF EXISTS "Allow public read gsa_contents" ON public.gsa_contents;
CREATE POLICY "Allow public read gsa_contents" ON public.gsa_contents FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert gsa_contents" ON public.gsa_contents;
CREATE POLICY "Allow public insert gsa_contents" ON public.gsa_contents FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update gsa_contents" ON public.gsa_contents;
CREATE POLICY "Allow public update gsa_contents" ON public.gsa_contents FOR UPDATE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public delete gsa_contents" ON public.gsa_contents;
CREATE POLICY "Allow public delete gsa_contents" ON public.gsa_contents FOR DELETE TO anon, authenticated USING (true);

-- 2. Policies cho gsa_ideas
DROP POLICY IF EXISTS "Allow public all gsa_ideas" ON public.gsa_ideas;
CREATE POLICY "Allow public all gsa_ideas" ON public.gsa_ideas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. Policies cho gsa_checklist
DROP POLICY IF EXISTS "Allow public all gsa_checklist" ON public.gsa_checklist;
CREATE POLICY "Allow public all gsa_checklist" ON public.gsa_checklist FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. Policies cho gsa_metrics
DROP POLICY IF EXISTS "Allow public all gsa_metrics" ON public.gsa_metrics;
CREATE POLICY "Allow public all gsa_metrics" ON public.gsa_metrics FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. Policies cho gsa_weekly_summaries
DROP POLICY IF EXISTS "Allow public all gsa_weekly_summaries" ON public.gsa_weekly_summaries;
CREATE POLICY "Allow public all gsa_weekly_summaries" ON public.gsa_weekly_summaries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. Policies cho gsa_settings
DROP POLICY IF EXISTS "Allow public all gsa_settings" ON public.gsa_settings;
CREATE POLICY "Allow public all gsa_settings" ON public.gsa_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA - KHỚP 100% VỚI BẢN THIẾT KẾ MẪU)
-- ==============================================================================

-- Seed dữ liệu Lịch nội dung
INSERT INTO public.gsa_contents (code, "group", topic, description, channel, format, scheduled_date, deadline, status, link, notes)
VALUES
('GSA-CH01-STUDY-TikTok', 'Bài bắt buộc', 'Topic: Tuần 1 — Study | Academics: Chạy Deadline Thuyết Trình Làm Slide Phát Mê', 'Minh họa quy trình sử dụng Gemini để xử lý tài liệu PDF, xây dựng dàn ý slide và kiểm tra nội dung trước thuyết trình', 'TikTok', 'Video ngắn', '22/10/2024', '23/10/2024', 'Đang làm', '', 'Kèm hashtag #GSA #GoogleGemini #StudyWithAI'),
('GSA-CH01-STUDY-FB', 'Bài bắt buộc', 'Topic: Tuần 1 — Study | Academics: Chạy Deadline Thuyết Trình Làm Slide Phát Mê', 'Minh họa quy trình sử dụng Gemini để xử lý tài liệu PDF, xây dựng dàn ý slide và kiểm tra nội dung trước thuyết trình', 'Facebook cá nhân', 'Bài viết', '22/10/2024', '23/10/2024', 'Đang làm', '', 'Đăng kèm ảnh chụp slide demo và link prompt template'),
('GSA-01-TikTok', 'Bài bắt buộc', 'Official Launch Post', 'Giới thiệu sự kiện Google AI Plus dành cho sinh viên, tạo nhận biết và dẫn người xem đến link giới thiệu...', 'TikTok', 'Video ngắn', '23/10/2024', '25/10/2024', 'Đang làm', '', 'Kêu gọi CTA bio link đăng ký tham gia'),
('GSA-02-FB', 'Bài bắt buộc', 'Video launch', 'Tạo chú ý bằng video giới thiệu chiến dịch.', 'Facebook cá nhân', 'Video ngắn', '23/10/2024', '26/10/2024', 'Đang làm', '', 'Video dọc 9:16 cắt từ teaser chính thức'),
('GSA-CH02-CAREER-TikTok', 'Bài bắt buộc', 'Topic: Tuần 2 — Career & CV Review chuẩn bị tuyển thực tập sinh', 'Cách tận dụng Gemini để phân tích Job Description, tối ưu từ khóa trong CV và luyện phỏng vấn thử 1:1', 'TikTok', 'Video ngắn', '28/10/2024', '30/10/2024', 'Chưa làm', '', 'Chia sẻ prompt mẫu trong phần comment'),
('GSA-CH02-CAREER-FB', 'Bài bắt buộc', 'Topic: Tuần 2 — Career: Đúc kết 5 prompt Gemini giúp SV viết CV đậu vòng hồ sơ', 'Bài viết dạng carousel ảnh và text dài chia sẻ chi tiết case study thực tế cải thiện CV xin việc', 'Facebook cá nhân', 'Bài viết', '29/10/2024', '31/10/2024', 'Chưa làm', '', 'Chuẩn bị bộ 5 hình ảnh infographic'),
('GSA-CH03-PROD-TikTok', 'Bài bắt buộc', 'Topic: Tuần 3 — Productivity & Quản lý thời gian học tập', 'Xây dựng kế hoạch ôn thi nước rút và tạo flashcard tự động bằng Gemini kết hợp Google Docs', 'TikTok', 'Video ngắn', '04/11/2024', '06/11/2024', 'Chưa làm', '', 'Highlight tính năng export sang Docs'),
('GSA-CH03-PROD-FB', 'Bài bắt buộc', 'Topic: Tuần 3 — Tổng hợp Template Notion + Gemini Study Hub', 'Chia sẻ miễn phí bộ template học tập tích hợp AI dành riêng cho cộng đồng sinh viên', 'Facebook cá nhân', 'Bài viết', '05/11/2024', '07/11/2024', 'Chưa làm', '', 'Kèm link Gumroad/Drive miễn phí'),
('GSA-EXTRA-01-TikTok', 'Nội dung bổ sung', 'Q&A: Giải đáp các lỗi prompt thường gặp khiến AI trả lời chung chung', 'Video ngắn trả lời thắc mắc của follower về cách viết prompt chi tiết theo công thức ROLE - TASK - CONTEXT', 'TikTok', 'Video ngắn', '24/10/2024', '27/10/2024', 'Đã đăng', 'https://tiktok.com/@creator/video/123456789', 'Nội dung tương tác cộng đồng'),
('GSA-EXTRA-02-Threads', 'Nội dung bổ sung', 'Micro-tips: 3 câu lệnh Gemini thần thánh dân kinh tế cần biết', 'Chuỗi bài ngắn trên Threads chia sẻ cách tóm tắt báo cáo tài chính và tìm số liệu thị trường', 'Threads', 'Bài viết', '26/10/2024', '28/10/2024', 'Đã đăng', 'https://threads.net/@creator/post/987654321', 'Viral tốt trên đối tượng gen Z văn phòng')
ON CONFLICT (code) DO NOTHING;

-- Seed dữ liệu Ngân hàng ý tưởng
INSERT INTO public.gsa_ideas (title, channel, format, status, notes, tags)
VALUES
('Biến slide thuyết trình từ chán ngắt thành cuốn hút trong 3 phút với Gemini', 'TikTok', 'Video ngắn', 'Sẵn sàng', 'Quay màn hình thao tác thật, có lồng tiếng hướng dẫn ngắn gọn', ARRAY['Academics', 'Slide', 'Fast-paced']),
('Top 5 lỗi sai ngớ ngẩn khi viết prompt khiến AI cho kết quả tệ hại', 'Facebook cá nhân', 'Bài viết', 'Đang ấp ủ', 'Kèm ví dụ sai vs đúng để người đọc lưu lại', ARRAY['Prompting', 'Tips', 'Beginner']),
('Thử thách: Ôn thi môn Triết chỉ dùng tài liệu tóm tắt bởi Gemini AI', 'TikTok', 'Video ngắn', 'Ý tưởng mới', 'Tạo cảm giác chân thực của sinh viên mùa thi', ARRAY['Challenge', 'StudyWithMe', 'Viral'])
ON CONFLICT DO NOTHING;

-- Seed dữ liệu Checklist chiến dịch
INSERT INTO public.gsa_checklist (title, category, completed, deadline)
VALUES
('Hoàn thiện hồ sơ GSA Creator & Ký cam kết', 'Onboarding', true, '20/10/2024'),
('Tham gia buổi Kickoff Campaign trực tuyến', 'Onboarding', true, '21/10/2024'),
('Tạo & đăng Video Teaser Launch (Bài 1)', 'Sản xuất nội dung', true, '23/10/2024'),
('Chuẩn bị kịch bản & file minh họa cho Topic Tuần 1', 'Sản xuất nội dung', true, '23/10/2024'),
('Đăng bài viết kèm template tài liệu trên Facebook cá nhân', 'Sản xuất nội dung', false, '24/10/2024'),
('Hoàn thành mốc 4 bài bắt buộc giai đoạn 1', 'Mục tiêu', false, '28/10/2024'),
('Gửi báo cáo số liệu thủ công tuần 1', 'Báo cáo', false, '30/10/2024'),
('Đăng đủ 8 bài bắt buộc trước hạn chiến dịch', 'Mục tiêu', false, '15/11/2024')
ON CONFLICT DO NOTHING;

-- Seed cấu hình cài đặt mặc định
INSERT INTO public.gsa_settings (id, creator_name, campaign_name, target_mandatory_posts, deadline_campaign)
VALUES ('default', 'GSA Ambassador', 'Google Student Ambassador (GSA) Campaign 2024', 8, '2024-11-20')
ON CONFLICT (id) DO NOTHING;
