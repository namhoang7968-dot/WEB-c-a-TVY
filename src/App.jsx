import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ContentCalendar from './components/ContentCalendar';
import ContentModal from './components/ContentModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

// Auxiliary views
import Overview from './components/views/Overview';
import ManualMetrics from './components/views/ManualMetrics';
import PerformanceAnalytics from './components/views/PerformanceAnalytics';
import IdeaBank from './components/views/IdeaBank';
import ProfileGrowth from './components/views/ProfileGrowth';
import ConversionTracker from './components/views/ConversionTracker';
import CampaignChecklist from './components/views/CampaignChecklist';
import WeeklySummary from './components/views/WeeklySummary';
import SettingsData from './components/views/SettingsData';

import { contentService } from './services/contentService';
import { checklistService } from './services/otherDataService';
import { supabase } from './services/supabaseClient';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar');
  const [contents, setContents] = useState(() => contentService.getLocalCache() || []);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 3500);
  };

  // Load fresh data from Supabase
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await contentService.fetchContents();
      if (Array.isArray(list) && list.length > 0) {
        setContents(list);
        const calculatedStats = contentService.getStats(list) || {};
        const checklistItems = await checklistService.fetch();
        const safeChecklist = Array.isArray(checklistItems) ? checklistItems : [];
        const checklistPending = safeChecklist.filter(i => !i?.completed).length;
        setStats({ ...calculatedStats, checklistPending });
      } else if (Array.isArray(list)) {
        setContents(prev => (prev.length > 0 ? prev : []));
      }
    } catch (err) {
      console.warn('Lỗi đồng bộ Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Subscribe to Realtime Supabase changes
    const unsubscribe = contentService.subscribeToChanges((newContents) => {
      const safeNew = Array.isArray(newContents) ? newContents : [];
      setContents(safeNew);
      const calculatedStats = contentService.getStats(safeNew) || {};
      setStats(prev => ({ ...prev, ...calculatedStats }));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [refreshData]);

  // Handle auto-sync payload from Bookmarklet via URL param, Hash, or window.name
  useEffect(() => {
    let isProcessing = false;
    const handleIncomingSyncPayload = async () => {
      if (isProcessing) return;
      try {
        let rawData = null;

        // 1. Check URL Hash: #sync_payload=...
        const hash = window.location.hash || '';
        if (hash.includes('sync_payload=')) {
          const m = hash.match(/sync_payload=([^&]+)/);
          if (m && m[1]) rawData = decodeURIComponent(m[1]);
        }

        // 2. Check URL Search: ?sync_payload=...
        if (!rawData && window.location.search) {
          const params = new URLSearchParams(window.location.search);
          const p = params.get('sync_payload');
          if (p) rawData = p;
        }

        // 3. Check window.name
        if (!rawData && window.name) {
          try {
            let str = window.name;
            if (str.startsWith('gsa_sync_')) {
              str = decodeURIComponent(str.replace('gsa_sync_', ''));
            }
            if (str.startsWith('{') || str.startsWith('[')) {
              rawData = str;
            }
          } catch (_) {}
        }

        if (!rawData) return;

        let payload = null;
        try {
          payload = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
        } catch (e) {
          console.warn('Lỗi parse sync_payload:', e);
          return;
        }

        if (!payload) return;
        isProcessing = true;

        // Clean URL search & hash, and clear window.name so refreshing won't re-sync
        window.history.replaceState({}, document.title, window.location.pathname);
        window.name = '';

        const platform = payload.platform || 'tiktok';
        const authorHandle = payload.author_handle || (platform === 'tiktok' ? 'thuyvy.risetoshine' : 'thuyvy.vandinh');
        const items = Array.isArray(payload.items) ? payload.items : (Array.isArray(payload) ? payload : []);
        const followers = Number(payload.followers) || 0;

        if (items.length === 0 && followers === 0) return;

        showToast(`Đang đồng bộ ${items.length} bài viết từ ${platform.toUpperCase()} vào Supabase...`, 'info');

        // 1. If followers > 0, update gsa_profile_growth
        if (followers > 0) {
          try {
            const { error: gErr } = await supabase.from('gsa_profile_growth').upsert({
              name: platform === 'tiktok' ? 'TikTok' : 'Facebook',
              handle: authorHandle.startsWith('@') ? authorHandle : `@${authorHandle}`,
              current_followers: followers,
              updated_at: new Date().toISOString()
            }, { onConflict: 'name' });
            if (gErr) console.warn('Lỗi cập nhật gsa_profile_growth:', gErr.message);
          } catch (ge) {
            console.warn('Lỗi upsert profile_growth:', ge);
          }
        }

        // 2. Upsert items into social_metrics
        if (items.length > 0) {
          const records = items.map(it => ({
            platform: it.platform || platform,
            author_handle: it.author_handle || authorHandle,
            post_id: String(it.post_id || it.id),
            title: it.title || ('Bài viết ' + platform),
            url: it.url || (platform === 'tiktok' ? `https://www.tiktok.com/@${authorHandle}/video/${it.post_id || it.id}` : `https://www.facebook.com/${authorHandle}`),
            views: Number(it.views) || 0,
            likes: Number(it.likes) || 0,
            comments: Number(it.comments) || 0,
            shares: Number(it.shares) || 0,
            saves: Number(it.saves) || 0,
            posted_at: it.posted_at || new Date().toISOString(),
            synced_at: new Date().toISOString()
          }));

          const { error: mErr } = await supabase
            .from('social_metrics')
            .upsert(records, { onConflict: 'platform,post_id' });

          if (mErr) throw mErr;

          showToast(`Đã đồng bộ thành công ${records.length} bài viết từ ${platform.toUpperCase()} vào Supabase!`, 'success');
        }
      } catch (err) {
        console.error('Lỗi tự động lưu sync payload:', err);
        showToast('Lỗi lưu đồng bộ vào Supabase: ' + err.message, 'error');
      } finally {
        isProcessing = false;
      }
    };

    handleIncomingSyncPayload();
  }, [refreshData]);

  // Content CRUD Handlers
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveContent = async (formData) => {
    try {
      if (editingItem?.id) {
        await contentService.updateContent(editingItem.id, formData);
        showToast('Đã cập nhật bài viết lên Supabase!', 'success');
      } else {
        await contentService.createContent(formData);
        showToast('Đã lưu bài viết mới vào Supabase!', 'success');
      }
      refreshData();
    } catch (e) {
      showToast('Lỗi lưu dữ liệu: ' + e.message, 'error');
    }
  };

  const handleRequestDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      await contentService.deleteContent(id, deletingItem?.code);
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
      showToast('Đã xóa nội dung khỏi Supabase!', 'info');
      refreshData();
    } catch (e) {
      showToast('Lỗi xóa bài: ' + e.message, 'error');
    }
  };

  const handleExportCSV = (filteredItems) => {
    contentService.exportToCSV(filteredItems);
    showToast('Đã xuất file CSV thành công!', 'success');
  };

  const handleConvertIdeaToContent = (idea) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const dateStr = `${dd}/${mm}/${yyyy}`;

    setEditingItem({
      code: `GSA-IDEA-${Math.floor(100 + Math.random() * 900)}`,
      group: 'Nội dung bổ sung',
      topic: idea?.title || '',
      description: idea?.notes || '',
      channel: idea?.channel || 'TikTok',
      format: idea?.format || 'Video ngắn',
      scheduledDate: dateStr,
      deadline: dateStr,
      status: 'Đang làm',
      link: '',
      notes: (idea?.tags || []).map(t => `#${t}`).join(' ')
    });
    setCurrentTab('calendar');
    setIsModalOpen(true);
    showToast('Đã chuyển ý tưởng sang form tạo nội dung!', 'info');
  };

  // Tab Header config mapping
  const getHeaderInfo = () => {
    switch (currentTab) {
      case 'overview':
        return {
          breadcrumb: 'GSA Campaign / Tổng quan',
          title: 'Tổng quan chiến dịch',
          subtitle: 'Trung tâm theo dõi toàn diện tiến độ 8 bài bắt buộc, chỉ số tương tác và kế hoạch hành động.',
          showCreateButton: true,
          actionButtonLabel: '+ Tạo nội dung'
        };
      case 'calendar':
        return {
          breadcrumb: 'GSA Campaign / Lịch nội dung',
          title: 'Lịch nội dung',
          subtitle: 'Theo dõi riêng 8 bài bắt buộc và các nội dung bổ sung. Không có bài nào tự động được đánh dấu đã đăng.',
          showCreateButton: true,
          actionButtonLabel: '+ Tạo nội dung'
        };
      case 'manual-metrics':
        return {
          breadcrumb: 'GSA Campaign / Số liệu thủ công',
          title: 'Số liệu thủ công',
          subtitle: 'Nhập và kiểm soát các chỉ số thực tế sau xuất bản: Views, Likes, Comments, Shares, Saves.',
          showCreateButton: false
        };
      case 'analytics':
        return {
          breadcrumb: 'GSA Campaign / Phân tích hiệu quả',
          title: 'Phân tích hiệu quả',
          subtitle: 'Thống kê tỷ lệ tiếp cận theo từng nền tảng, định dạng nổi bật và top bài có tương tác cao nhất.',
          showCreateButton: false
        };
      case 'idea-bank':
        return {
          breadcrumb: 'GSA Campaign / Ngân hàng ý tưởng',
          title: 'Ngân hàng ý tưởng',
          subtitle: 'Nơi ấp ủ các kịch bản sáng tạo, góc nhìn độc đáo và dễ dàng chuyển thành bài đăng chính thức.',
          showCreateButton: true,
          actionButtonLabel: '+ Thêm nội dung'
        };
      case 'growth':
        return {
          breadcrumb: 'GSA Campaign / Phát triển trang cá nhân',
          title: 'Phát triển trang cá nhân',
          subtitle: 'Theo dõi tốc độ tăng trưởng người theo dõi và độ nhận diện thương hiệu cá nhân qua từng tuần.',
          showCreateButton: false
        };
      case 'conversions':
        return {
          breadcrumb: 'GSA Campaign / Theo dõi chuyển đổi',
          title: 'Theo dõi chuyển đổi',
          subtitle: 'Quản lý link UTM tiếp thị cá nhân, thống kê số lượt click và người dùng đăng ký qua giới thiệu.',
          showCreateButton: false
        };
      case 'checklist':
        return {
          breadcrumb: 'GSA Campaign / Checklist chiến dịch',
          title: 'Checklist chiến dịch',
          subtitle: 'Đảm bảo hoàn thành đầy đủ các cột mốc quan trọng, chuẩn bị kịch bản và nộp báo cáo đúng hạn.',
          showCreateButton: false
        };
      case 'weekly-summary':
        return {
          breadcrumb: 'GSA Campaign / Tổng kết tuần',
          title: 'Tổng kết tuần',
          subtitle: 'Ghi nhận bài học kinh nghiệm, phân tích kết quả tuần và xây dựng mục tiêu tuần kế tiếp.',
          showCreateButton: false
        };
      case 'settings':
        return {
          breadcrumb: 'GSA Campaign / Cài đặt & Dữ liệu',
          title: 'Cài đặt & Dữ liệu',
          subtitle: 'Quản lý bộ nhớ trình duyệt, sao lưu / phục hồi JSON và thiết lập kết nối đám mây Supabase.',
          showCreateButton: false
        };
      default:
        return {
          breadcrumb: 'GSA Campaign / Lịch nội dung',
          title: 'Lịch nội dung',
          subtitle: '',
          showCreateButton: true,
          actionButtonLabel: '+ Tạo nội dung'
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <ErrorBoundary fallbackTitle="Ứng dụng gặp sự cố giao diện">
      <div className="flex min-h-screen bg-[var(--color-paper)] text-[#0F172A]">
        {/* Sidebar (Left) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          stats={stats}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area (Right) */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* Header */}
            <Header
              breadcrumb={headerInfo.breadcrumb}
              title={headerInfo.title}
              subtitle={headerInfo.subtitle}
              onOpenCreateModal={handleOpenCreateModal}
              showCreateButton={headerInfo.showCreateButton}
              actionButtonLabel={headerInfo.actionButtonLabel}
              storageStatus="Đồng bộ Supabase trực tuyến"
              onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
            />

            {/* Tab Views wrapped in ErrorBoundary per tab */}
            <div className="mt-4">
              <ErrorBoundary key={currentTab} fallbackTitle={`Lỗi khi tải tab ${headerInfo.title}`}>
                {currentTab === 'calendar' && (
                  <ContentCalendar
                    contents={contents}
                    onEdit={handleEditItem}
                    onDelete={handleRequestDelete}
                    onExportCSV={handleExportCSV}
                    onCreateNew={handleOpenCreateModal}
                  />
                )}

                {currentTab === 'overview' && (
                  <Overview
                    contents={contents}
                    stats={stats}
                    onNavigateToCalendar={() => setCurrentTab('calendar')}
                    onOpenCreateModal={handleOpenCreateModal}
                  />
                )}

                {currentTab === 'manual-metrics' && (
                  <ManualMetrics
                    contents={contents}
                    onShowToast={showToast}
                  />
                )}

                {currentTab === 'analytics' && (
                  <PerformanceAnalytics
                    contents={contents}
                  />
                )}

                {currentTab === 'idea-bank' && (
                  <IdeaBank
                    onConvertIdeaToContent={handleConvertIdeaToContent}
                    onShowToast={showToast}
                  />
                )}

                {currentTab === 'growth' && (
                  <ProfileGrowth />
                )}

                {currentTab === 'conversions' && (
                  <ConversionTracker
                    onShowToast={showToast}
                  />
                )}

                {currentTab === 'checklist' && (
                  <CampaignChecklist
                    onShowToast={showToast}
                  />
                )}

                {currentTab === 'weekly-summary' && (
                  <WeeklySummary
                    contents={contents}
                    stats={stats}
                    onShowToast={showToast}
                  />
                )}

                {currentTab === 'settings' && (
                  <SettingsData
                    onReloadData={refreshData}
                    onShowToast={showToast}
                  />
                )}
              </ErrorBoundary>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/50">
            Creator Studio • GSA Campaign • Đồng bộ trực tiếp với Supabase Cloud
          </footer>
        </div>

        {/* Modals */}
        <ContentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveContent}
          initialData={editingItem}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          item={deletingItem}
        />

        {/* Global Toast */}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      </div>
    </ErrorBoundary>
  );
}
