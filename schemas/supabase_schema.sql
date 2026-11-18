-- ==============================================================================
-- GSA CREATOR STUDIO DASHBOARD - TOÀN BỘ CƠ SỞ DỮ LIỆU CHO MỌI TAB
-- Bao gồm đầy đủ 8 bảng dữ liệu, bật RLS và nạp sẵn dữ liệu ban đầu
-- Chạy đoạn mã này trong Supabase > SQL Editor > Run
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

-- 5. BẢNG: PHÁT TRIỂN TRANG CÁ NHÂN (gsa_profile_growth)
CREATE TABLE IF NOT EXISTS public.gsa_profile_growth (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL UNIQUE,
    handle TEXT NOT NULL,
    current_followers INT DEFAULT 0,
    start_followers INT DEFAULT 0,
    target INT DEFAULT 0,
    link_clicks INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BẢNG: THEO DÕI CHUYỂN ĐỔI (gsa_conversions)
CREATE TABLE IF NOT EXISTS public.gsa_conversions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    date TEXT NOT NULL,
    source TEXT NOT NULL,
    clicks INT DEFAULT 0,
    signups INT DEFAULT 0,
    conversion_rate TEXT DEFAULT '0%',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BẢNG: TỔNG KẾT TUẦN (gsa_weekly_summaries)
CREATE TABLE IF NOT EXISTS public.gsa_weekly_summaries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    week_label TEXT NOT NULL UNIQUE,
    highlights TEXT DEFAULT '',
    next_week_plan TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BẢNG: CẤU HÌNH CHIẾN DỊCH (gsa_settings)
CREATE TABLE IF NOT EXISTS public.gsa_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    creator_name TEXT DEFAULT 'GSA Ambassador',
    campaign_name TEXT DEFAULT 'Google Student Ambassador (GSA) Campaign 2024',
    target_mandatory_posts INT DEFAULT 8,
    deadline_campaign TEXT DEFAULT '2024-11-20',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. BẢNG: ĐỒNG BỘ MẠNG XÃ HỘI (social_metrics - TikTok & Facebook Sync)
CREATE TABLE IF NOT EXISTS public.social_metrics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    platform TEXT NOT NULL, -- 'tiktok' | 'facebook'
    author_handle TEXT NOT NULL,
    post_id TEXT NOT NULL,
    title TEXT,
    url TEXT,
    views BIGINT DEFAULT 0,
    likes BIGINT DEFAULT 0,
    comments BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    saves BIGINT DEFAULT 0,
    posted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    synced_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    raw_data JSONB,
    UNIQUE(platform, post_id)
);

-- ==============================================================================
-- BẬT ROW LEVEL SECURITY (RLS) & CHÍNH SÁCH ĐỌC / GHI CHO TOÀN BỘ BẢNG
-- ==============================================================================

ALTER TABLE public.gsa_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_profile_growth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_weekly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_metrics ENABLE ROW LEVEL SECURITY;

-- Tạo Policy cho phép SELECT, INSERT, UPDATE, DELETE bằng Anon Key
DROP POLICY IF EXISTS "Allow public all gsa_contents" ON public.gsa_contents;
CREATE POLICY "Allow public all gsa_contents" ON public.gsa_contents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all gsa_ideas" ON public.gsa_ideas;
CREATE POLICY "Allow public all gsa_ideas" ON public.gsa_ideas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all gsa_checklist" ON public.gsa_checklist;
CREATE POLICY "Allow public all gsa_checklist" ON public.gsa_checklist FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all gsa_metrics" ON public.gsa_metrics;
CREATE POLICY "Allow public all gsa_metrics" ON public.gsa_metrics FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all gsa_profile_growth" ON public.gsa_profile_growth;
CREATE POLICY "Allow public all gsa_profile_growth" ON public.gsa_profile_growth FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all gsa_conversions" ON public.gsa_conversions;
CREATE POLICY "Allow public all gsa_conversions" ON public.gsa_conversions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all gsa_weekly_summaries" ON public.gsa_weekly_summaries;
CREATE POLICY "Allow public all gsa_weekly_summaries" ON public.gsa_weekly_summaries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all gsa_settings" ON public.gsa_settings;
CREATE POLICY "Allow public all gsa_settings" ON public.gsa_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all social_metrics" ON public.social_metrics;
CREATE POLICY "Allow public all social_metrics" ON public.social_metrics FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- DỮ LIỆU MẪU BAN ĐẦU CHO CÁC BẢNG (SEED DATA)
-- ==============================================================================

-- 1. Nạp số liệu thủ công mẫu
INSERT INTO public.gsa_metrics (content_code, views, likes, comments, shares, saves, conversions)
VALUES
('GSA-CH01-STUDY-TikTok', 18500, 1420, 88, 195, 340, 42),
('GSA-CH01-STUDY-FB', 6200, 410, 52, 74, 110, 28),
('GSA-01-TikTok', 24300, 2150, 145, 310, 520, 86),
('GSA-02-FB', 5100, 320, 34, 48, 65, 19),
('GSA-EXTRA-01-TikTok', 32400, 3100, 210, 480, 790, 114),
('GSA-EXTRA-02-Threads', 8900, 620, 45, 92, 180, 35)
ON CONFLICT (content_code) DO NOTHING;

-- 2. Nạp dữ liệu Phát triển trang cá nhân
INSERT INTO public.gsa_profile_growth (name, handle, current_followers, start_followers, target, link_clicks)
VALUES
('TikTok', '@gsa.creator.vn', 14200, 9800, 20000, 1240),
('Facebook cá nhân', 'facebook.com/creator', 6500, 5100, 10000, 820),
('Threads', '@creator_thoughts', 2800, 1100, 5000, 340)
ON CONFLICT (name) DO NOTHING;

-- 3. Nạp dữ liệu Theo dõi chuyển đổi
INSERT INTO public.gsa_conversions (date, source, clicks, signups, conversion_rate)
VALUES
('22/10/2024', 'TikTok Bio Link', 312, 42, '13.4%'),
('22/10/2024', 'Facebook Comment Pin', 184, 28, '15.2%'),
('23/10/2024', 'TikTok Teaser Video CTA', 495, 86, '17.3%'),
('24/10/2024', 'Threads Link', 120, 14, '11.6%');

-- 4. Nạp dữ liệu Cấu hình mặc định
INSERT INTO public.gsa_settings (id, creator_name, campaign_name, target_mandatory_posts, deadline_campaign)
VALUES ('default', 'GSA Ambassador', 'Google Student Ambassador (GSA) Campaign 2024', 8, '2024-11-20')
ON CONFLICT (id) DO NOTHING;
