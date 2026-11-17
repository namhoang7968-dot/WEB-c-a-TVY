// Data services for Checklist, Ideas, Metrics, Profile Growth, Conversions & Settings
// Complete with Safe Fallbacks and Supabase Direct Sync

import { supabase } from './supabaseClient';

const CHECKLIST_KEY = 'gsa_campaign_checklist';
const IDEAS_KEY = 'gsa_campaign_ideas';
const METRICS_KEY = 'gsa_campaign_metrics';
const SETTINGS_KEY = 'gsa_campaign_settings';
const GROWTH_KEY = 'gsa_campaign_growth';
const CONVERSIONS_KEY = 'gsa_campaign_conversions';

export const INITIAL_CHECKLIST = [
  { id: 'c1', title: 'Hoàn thiện hồ sơ GSA Creator & Ký cam kết', category: 'Onboarding', completed: true, deadline: '20/10/2024' },
  { id: 'c2', title: 'Tham gia buổi Kickoff Campaign trực tuyến', category: 'Onboarding', completed: true, deadline: '21/10/2024' },
  { id: 'c3', title: 'Tạo & đăng Video Teaser Launch (Bài 1)', category: 'Sản xuất nội dung', completed: true, deadline: '23/10/2024' },
  { id: 'c4', title: 'Chuẩn bị kịch bản & file minh họa cho Topic Tuần 1', category: 'Sản xuất nội dung', completed: true, deadline: '23/10/2024' },
  { id: 'c5', title: 'Đăng bài viết kèm template tài liệu trên Facebook cá nhân', category: 'Sản xuất nội dung', completed: false, deadline: '24/10/2024' },
  { id: 'c6', title: 'Hoàn thành mốc 4 bài bắt buộc giai đoạn 1', category: 'Mục tiêu', completed: false, deadline: '28/10/2024' },
  { id: 'c7', title: 'Gửi báo cáo số liệu thủ công tuần 1', category: 'Báo cáo', completed: false, deadline: '30/10/2024' },
  { id: 'c8', title: 'Đăng đủ 8 bài bắt buộc trước hạn chiến dịch', category: 'Mục tiêu', completed: false, deadline: '15/11/2024' }
];

export const INITIAL_IDEAS = [
  {
    id: 'idea-1',
    title: 'Biến slide thuyết trình từ chán ngắt thành cuốn hút trong 3 phút với Gemini',
    channel: 'TikTok',
    format: 'Video ngắn (POV / Screen record)',
    status: 'Sẵn sàng',
    tags: ['Academics', 'Slide', 'Fast-paced'],
    notes: 'Quay màn hình thao tác thật, có lồng tiếng hướng dẫn ngắn gọn'
  },
  {
    id: 'idea-2',
    title: 'Top 5 lỗi sai ngớ ngẩn khi viết prompt khiến AI cho kết quả tệ hại',
    channel: 'Facebook cá nhân',
    format: 'Bài viết Infographic',
    status: 'Đang ấp ủ',
    tags: ['Prompting', 'Tips', 'Beginner'],
    notes: 'Kèm ví dụ sai vs đúng để người đọc lưu lại'
  },
  {
    id: 'idea-3',
    title: 'Thử thách: Ôn thi môn Triết chỉ dùng tài liệu tóm tắt bởi Gemini AI',
    channel: 'TikTok',
    format: 'Video ngắn (Vlog)',
    status: 'Ý tưởng mới',
    tags: ['Challenge', 'StudyWithMe', 'Viral'],
    notes: 'Tạo cảm giác chân thực của sinh viên mùa thi'
  }
];

export const INITIAL_METRICS = [
  { id: 'm1', code: 'GSA-CH01-STUDY-TikTok', views: 18500, likes: 1420, comments: 88, shares: 195, saves: 340, conversions: 42 },
  { id: 'm2', code: 'GSA-CH01-STUDY-FB', views: 6200, likes: 410, comments: 52, shares: 74, saves: 110, conversions: 28 },
  { id: 'm3', code: 'GSA-01-TikTok', views: 24300, likes: 2150, comments: 145, shares: 310, saves: 520, conversions: 86 },
  { id: 'm4', code: 'GSA-02-FB', views: 5100, likes: 320, comments: 34, shares: 48, saves: 65, conversions: 19 },
  { id: 'm5', code: 'GSA-EXTRA-01-TikTok', views: 32400, likes: 3100, comments: 210, shares: 480, saves: 790, conversions: 114 },
  { id: 'm6', code: 'GSA-EXTRA-02-Threads', views: 8900, likes: 620, comments: 45, shares: 92, saves: 180, conversions: 35 }
];

export const INITIAL_GROWTH = [
  { name: 'TikTok', handle: '@gsa.creator.vn', currentFollowers: 14200, startFollowers: 9800, target: 20000, linkClicks: 1240 },
  { name: 'Facebook cá nhân', handle: 'facebook.com/creator', currentFollowers: 6500, startFollowers: 5100, target: 10000, linkClicks: 820 },
  { name: 'Threads', handle: '@creator_thoughts', currentFollowers: 2800, startFollowers: 1100, target: 5000, linkClicks: 340 },
];

export const INITIAL_CONVERSIONS = [
  { date: '22/10/2024', source: 'TikTok Bio Link', clicks: 312, signups: 42, conversionRate: '13.4%' },
  { date: '22/10/2024', source: 'Facebook Comment Pin', clicks: 184, signups: 28, conversionRate: '15.2%' },
  { date: '23/10/2024', source: 'TikTok Teaser Video CTA', clicks: 495, signups: 86, conversionRate: '17.3%' },
  { date: '24/10/2024', source: 'Threads Link', clicks: 120, signups: 14, conversionRate: '11.6%' },
];

export const INITIAL_SETTINGS = {
  creatorName: 'GSA Ambassador',
  campaignName: 'Google Student Ambassador (GSA) Campaign 2024',
  targetMandatoryPosts: 8,
  deadlineCampaign: '2024-11-20',
  storageMode: 'supabase'
};

// ================= CHECKLIST SERVICE =================
export const checklistService = {
  get: () => checklistService.getCache(),
  getCache: () => {
    try {
      const d = localStorage.getItem(CHECKLIST_KEY);
      return d ? JSON.parse(d) : INITIAL_CHECKLIST;
    } catch {
      return INITIAL_CHECKLIST;
    }
  },
  setCache: (items) => {
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items || []));
    } catch (e) {
      console.warn(e);
    }
  },
  fetch: async () => {
    try {
      const { data, error } = await supabase.from('gsa_checklist').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        checklistService.setCache(data);
        return data;
      }
      return checklistService.getCache();
    } catch (err) {
      console.warn('Lỗi fetch checklist từ Supabase:', err);
      return checklistService.getCache();
    }
  },
  toggle: async (id) => {
    const list = checklistService.getCache() || [];
    const item = list.find(i => i.id === id);
    if (!item) return list;
    const newStatus = !item.completed;
    const updated = list.map(i => i.id === id ? { ...i, completed: newStatus } : i);
    checklistService.setCache(updated);

    try {
      await supabase.from('gsa_checklist').update({ completed: newStatus }).eq('id', id);
    } catch (err) {
      console.warn('Supabase toggle error:', err);
    }
    return updated;
  },
  add: async (item) => {
    const list = checklistService.getCache() || [];
    try {
      const { data, error } = await supabase.from('gsa_checklist').insert([item]).select();
      if (error) throw error;
      const created = data?.[0] || { id: 'c-' + Date.now(), completed: false, ...item };
      const updated = [...list, created];
      checklistService.setCache(updated);
      return updated;
    } catch {
      const localItem = { id: 'c-' + Date.now(), completed: false, ...item };
      const updated = [...list, localItem];
      checklistService.setCache(updated);
      return updated;
    }
  },
  delete: async (id) => {
    const list = checklistService.getCache() || [];
    const updated = list.filter(i => i.id !== id);
    checklistService.setCache(updated);
    try {
      await supabase.from('gsa_checklist').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
    return updated;
  }
};

// ================= IDEA BANK SERVICE =================
export const ideaService = {
  get: () => ideaService.getCache(),
  getCache: () => {
    try {
      const d = localStorage.getItem(IDEAS_KEY);
      return d ? JSON.parse(d) : INITIAL_IDEAS;
    } catch {
      return INITIAL_IDEAS;
    }
  },
  setCache: (items) => {
    try {
      localStorage.setItem(IDEAS_KEY, JSON.stringify(items || []));
    } catch (e) {
      console.warn(e);
    }
  },
  fetch: async () => {
    try {
      const { data, error } = await supabase.from('gsa_ideas').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        ideaService.setCache(data);
        return data;
      }
      return ideaService.getCache();
    } catch {
      return ideaService.getCache();
    }
  },
  add: async (idea) => {
    const list = ideaService.getCache() || [];
    try {
      const { data, error } = await supabase.from('gsa_ideas').insert([idea]).select();
      if (error) throw error;
      const created = data?.[0] || { id: 'idea-' + Date.now(), ...idea };
      const updated = [created, ...list];
      ideaService.setCache(updated);
      return updated;
    } catch {
      const localItem = { id: 'idea-' + Date.now(), ...idea };
      const updated = [localItem, ...list];
      ideaService.setCache(updated);
      return updated;
    }
  },
  delete: async (id) => {
    const list = ideaService.getCache() || [];
    const updated = list.filter(i => i.id !== id);
    ideaService.setCache(updated);
    try {
      await supabase.from('gsa_ideas').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete idea error:', err);
    }
    return updated;
  }
};

// ================= MANUAL METRICS SERVICE =================
export const metricsService = {
  get: () => metricsService.getCache(),
  getCache: () => {
    try {
      const d = localStorage.getItem(METRICS_KEY);
      return d ? JSON.parse(d) : INITIAL_METRICS;
    } catch {
      return INITIAL_METRICS;
    }
  },
  setCache: (items) => {
    try {
      localStorage.setItem(METRICS_KEY, JSON.stringify(items || []));
    } catch (e) {
      console.warn(e);
    }
  },
  fetch: async () => {
    try {
      const { data, error } = await supabase.from('gsa_metrics').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map(r => ({
          id: r.id,
          code: r.content_code,
          views: Number(r.views) || 0,
          likes: Number(r.likes) || 0,
          comments: Number(r.comments) || 0,
          shares: Number(r.shares) || 0,
          saves: Number(r.saves) || 0,
          conversions: Number(r.conversions) || 0
        }));
        metricsService.setCache(mapped);
        return mapped;
      }
      return metricsService.getCache();
    } catch {
      return metricsService.getCache();
    }
  },
  save: async (items) => {
    metricsService.setCache(items);
  },
  update: async (code, metricData) => {
    const list = metricsService.getCache() || [];
    const updated = list.map(item => item.code === code ? { ...item, ...metricData } : item);
    metricsService.setCache(updated);

    try {
      await supabase.from('gsa_metrics').upsert({
        content_code: code,
        views: metricData.views,
        likes: metricData.likes,
        comments: metricData.comments,
        shares: metricData.shares,
        saves: metricData.saves,
        conversions: metricData.conversions,
        updated_at: new Date().toISOString()
      }, { onConflict: 'content_code' });
    } catch (err) {
      console.warn('Supabase metric update error:', err);
    }
    return updated;
  }
};

// ================= PROFILE GROWTH SERVICE =================
export const growthService = {
  get: () => {
    try {
      const d = localStorage.getItem(GROWTH_KEY);
      return d ? JSON.parse(d) : INITIAL_GROWTH;
    } catch {
      return INITIAL_GROWTH;
    }
  },
  save: (data) => {
    try {
      localStorage.setItem(GROWTH_KEY, JSON.stringify(data || []));
    } catch (e) {
      console.warn(e);
    }
  },
  fetch: async () => {
    try {
      const { data, error } = await supabase.from('gsa_profile_growth').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        growthService.save(data);
        return data;
      }
      return growthService.get();
    } catch {
      return growthService.get();
    }
  }
};

// ================= CONVERSIONS SERVICE =================
export const conversionService = {
  get: () => {
    try {
      const d = localStorage.getItem(CONVERSIONS_KEY);
      return d ? JSON.parse(d) : INITIAL_CONVERSIONS;
    } catch {
      return INITIAL_CONVERSIONS;
    }
  },
  save: (data) => {
    try {
      localStorage.setItem(CONVERSIONS_KEY, JSON.stringify(data || []));
    } catch (e) {
      console.warn(e);
    }
  },
  fetch: async () => {
    try {
      const { data, error } = await supabase.from('gsa_conversions').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        conversionService.save(data);
        return data;
      }
      return conversionService.get();
    } catch {
      return conversionService.get();
    }
  }
};

// ================= SETTINGS SERVICE =================
export const settingsService = {
  get: () => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },
  save: (config) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn(e);
    }
  }
};
