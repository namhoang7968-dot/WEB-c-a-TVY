// Content Data Management Service
// Direct Sync with Supabase (with offline-first LocalStorage fallback)

import { supabase } from './supabaseClient';

const STORAGE_KEY = 'gsa_creator_studio_contents';

export const INITIAL_CONTENTS = [
  {
    id: 'post-1',
    code: 'GSA-CH01-STUDY-TikTok',
    group: 'Bài bắt buộc',
    topic: 'Topic: Tuần 1 — Study | Academics: Chạy Deadline Thuyết Trình Làm Slide Phát Mê',
    description: 'Minh họa quy trình sử dụng Gemini để xử lý tài liệu PDF, xây dựng dàn ý slide và kiểm tra nội dung trước thuyết trình',
    channel: 'TikTok',
    format: 'Video ngắn',
    scheduledDate: '22/10/2024',
    deadline: '23/10/2024',
    status: 'Đang làm',
    link: '',
    notes: 'Kèm hashtag #GSA #GoogleGemini #StudyWithAI'
  },
  {
    id: 'post-2',
    code: 'GSA-CH01-STUDY-FB',
    group: 'Bài bắt buộc',
    topic: 'Topic: Tuần 1 — Study | Academics: Chạy Deadline Thuyết Trình Làm Slide Phát Mê',
    description: 'Minh họa quy trình sử dụng Gemini để xử lý tài liệu PDF, xây dựng dàn ý slide và kiểm tra nội dung trước thuyết trình',
    channel: 'Facebook cá nhân',
    format: 'Bài viết',
    scheduledDate: '22/10/2024',
    deadline: '23/10/2024',
    status: 'Đang làm',
    link: '',
    notes: 'Đăng kèm ảnh chụp slide demo và link prompt template'
  },
  {
    id: 'post-3',
    code: 'GSA-01-TikTok',
    group: 'Bài bắt buộc',
    topic: 'Official Launch Post',
    description: 'Giới thiệu sự kiện Google AI Plus dành cho sinh viên, tạo nhận biết và dẫn người xem đến link giới thiệu...',
    channel: 'TikTok',
    format: 'Video ngắn',
    scheduledDate: '23/10/2024',
    deadline: '25/10/2024',
    status: 'Đang làm',
    link: '',
    notes: 'Kêu gọi CTA bio link đăng ký tham gia'
  },
  {
    id: 'post-4',
    code: 'GSA-02-FB',
    group: 'Bài bắt buộc',
    topic: 'Video launch',
    description: 'Tạo chú ý bằng video giới thiệu chiến dịch.',
    channel: 'Facebook cá nhân',
    format: 'Video ngắn',
    scheduledDate: '23/10/2024',
    deadline: '26/10/2024',
    status: 'Đang làm',
    link: '',
    notes: 'Video dọc 9:16 cắt từ teaser chính thức'
  }
];

// Helper to map DB row to frontend object
const mapFromSupabase = (row) => ({
  id: row.id,
  code: row.code,
  group: row.group,
  topic: row.topic,
  description: row.description || '',
  channel: row.channel,
  format: row.format,
  scheduledDate: row.scheduled_date,
  deadline: row.deadline || '',
  status: row.status,
  link: row.link || '',
  notes: row.notes || '',
  createdAt: row.created_at
});

// Helper to map frontend object to DB row
const mapToSupabase = (item) => ({
  code: item.code,
  group: item.group,
  topic: item.topic,
  description: item.description || '',
  channel: item.channel,
  format: item.format,
  scheduled_date: item.scheduledDate,
  deadline: item.deadline || '',
  status: item.status,
  link: item.link || '',
  notes: item.notes || '',
  updated_at: new Date().toISOString()
});

export const contentService = {
  // Alias for getLocalCache for backwards-compatibility
  getContents: () => {
    return contentService.getLocalCache();
  },

  // Read local cache immediately for instant render
  getLocalCache: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_CONTENTS;
    } catch {
      return INITIAL_CONTENTS;
    }
  },

  // Save local cache
  setLocalCache: (contents) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
    } catch (err) {
      console.warn('Local storage error:', err);
    }
  },

  // Fetch all contents directly from Supabase
  fetchContents: async () => {
    try {
      const { data, error } = await supabase
        .from('gsa_contents')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped = data.map(mapFromSupabase);
        contentService.setLocalCache(mapped);
        return mapped;
      } else {
        return contentService.getLocalCache();
      }
    } catch (err) {
      console.error('Lỗi tải từ Supabase:', err);
      return contentService.getLocalCache();
    }
  },

  // Add new content directly to Supabase
  createContent: async (itemData) => {
    const payload = mapToSupabase(itemData);
    try {
      const { data, error } = await supabase
        .from('gsa_contents')
        .insert([payload])
        .select();

      if (error) throw error;

      const created = data && data[0] ? mapFromSupabase(data[0]) : { id: 'post-' + Date.now(), ...itemData };
      const current = contentService.getLocalCache();
      const updated = [created, ...current.filter(c => c.code !== created.code)];
      contentService.setLocalCache(updated);
      return created;
    } catch (err) {
      console.error('Lỗi thêm bài trên Supabase:', err);
      // Fallback local
      const localItem = { id: 'post-' + Date.now(), ...itemData };
      const updated = [localItem, ...contentService.getLocalCache()];
      contentService.setLocalCache(updated);
      return localItem;
    }
  },

  // Update existing content directly on Supabase
  updateContent: async (id, updatedData) => {
    const payload = mapToSupabase(updatedData);
    try {
      let query = supabase.from('gsa_contents').update(payload);
      if (id && !id.startsWith('post-')) {
        query = query.eq('id', id);
      } else {
        query = query.eq('code', updatedData.code);
      }

      const { data, error } = await query.select();
      if (error) throw error;

      const current = contentService.getLocalCache();
      const updated = current.map(item =>
        (item.id === id || item.code === updatedData.code) ? { ...item, ...updatedData } : item
      );
      contentService.setLocalCache(updated);
      return data?.[0] ? mapFromSupabase(data[0]) : updatedData;
    } catch (err) {
      console.error('Lỗi cập nhật trên Supabase:', err);
      const current = contentService.getLocalCache();
      const updated = current.map(item => item.id === id ? { ...item, ...updatedData } : item);
      contentService.setLocalCache(updated);
      return updatedData;
    }
  },

  // Delete content directly from Supabase
  deleteContent: async (id, code = null) => {
    try {
      let query = supabase.from('gsa_contents').delete();
      if (id && !id.startsWith('post-')) {
        query = query.eq('id', id);
      } else if (code) {
        query = query.eq('code', code);
      }
      await query;

      const current = contentService.getLocalCache();
      const updated = current.filter(item => item.id !== id && item.code !== code);
      contentService.setLocalCache(updated);
      return true;
    } catch (err) {
      console.error('Lỗi xóa trên Supabase:', err);
      const current = contentService.getLocalCache();
      const updated = current.filter(item => item.id !== id);
      contentService.setLocalCache(updated);
      return true;
    }
  },

  // Realtime subscription
  subscribeToChanges: (onDataChange) => {
    const channel = supabase
      .channel('gsa_contents_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gsa_contents' }, () => {
        contentService.fetchContents().then(items => {
          if (onDataChange) onDataChange(items);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Export to Excel-ready CSV
  exportToCSV: (items = null) => {
    const list = items || contentService.getLocalCache();
    const headers = [
      'Mã nội dung',
      'Nhóm',
      'Chủ đề',
      'Mục tiêu / Mô tả',
      'Kênh',
      'Định dạng',
      'Ngày dự kiến',
      'Hạn chót',
      'Trạng thái',
      'Link bài viết',
      'Ghi chú'
    ];

    const rows = list.map(item => [
      `"${(item.code || '').replace(/"/g, '""')}"`,
      `"${(item.group || '').replace(/"/g, '""')}"`,
      `"${(item.topic || '').replace(/"/g, '""')}"`,
      `"${(item.description || '').replace(/"/g, '""')}"`,
      `"${(item.channel || '').replace(/"/g, '""')}"`,
      `"${(item.format || '').replace(/"/g, '""')}"`,
      `"${(item.scheduledDate || '').replace(/"/g, '""')}"`,
      `"${(item.deadline || '').replace(/"/g, '""')}"`,
      `"${(item.status || '').replace(/"/g, '""')}"`,
      `"${(item.link || '').replace(/"/g, '""')}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GSA_Campaign_Supabase_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Calculate statistics
  getStats: (contents = null) => {
    const list = contents || contentService.getLocalCache();
    const requiredTotal = 8;
    const requiredItems = list.filter(item => item.group === 'Bài bắt buộc');
    const requiredDone = requiredItems.filter(item => item.status === 'Đã đăng').length;
    const requiredInProgress = requiredItems.filter(item => item.status === 'Đang làm').length;
    const extraItems = list.filter(item => item.group === 'Nội dung bổ sung');
    const extraDone = extraItems.filter(item => item.status === 'Đã đăng').length;

    return {
      total: list.length,
      requiredTotal,
      requiredCount: requiredItems.length,
      requiredDone,
      requiredInProgress,
      extraCount: extraItems.length,
      extraDone,
      totalDone: list.filter(item => item.status === 'Đã đăng').length,
      totalInProgress: list.filter(item => item.status === 'Đang làm').length,
      totalTodo: list.filter(item => item.status === 'Chưa làm').length,
      requiredPercentage: Math.min(100, Math.round((requiredDone / requiredTotal) * 100))
    };
  }
};
