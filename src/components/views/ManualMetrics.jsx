import React, { useState, useEffect } from 'react';
import { metricsService } from '../../services/otherDataService';
import { socialSyncService } from '../../services/socialSyncService';
import { Eye, Heart, MessageSquare, Share2, RefreshCw, Bookmark, ExternalLink } from 'lucide-react';
import BookmarkletModal from '../BookmarkletModal';

export default function ManualMetrics({ contents = [], onShowToast }) {
  const [metrics, setMetrics] = useState(() => metricsService.get() || []);
  const [syncedSocialPosts, setSyncedSocialPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempRow, setTempRow] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBookmarkletModal, setShowBookmarkletModal] = useState(false);

  const safeContents = Array.isArray(contents) ? contents : [];
  const safeMetrics = Array.isArray(metrics) ? metrics : [];

  // Load synced social posts from Supabase
  const loadSocialMetrics = async () => {
    try {
      const posts = await socialSyncService.fetchMetrics();
      if (Array.isArray(posts)) {
        setSyncedSocialPosts(posts);
      }
    } catch (e) {
      console.warn('Lỗi tải social_metrics:', e);
    }
  };

  useEffect(() => {
    loadSocialMetrics();
  }, []);

  const handleSyncTikTok = async () => {
    setIsSyncing(true);
    try {
      const res = await socialSyncService.syncTikTok();
      if (res?.success) {
        onShowToast?.(`Đã đồng bộ ${res.videosCount || 0} video từ TikTok @${res.handle}!`, 'success');
        const refreshed = await metricsService.fetch();
        setMetrics(refreshed || []);
        loadSocialMetrics();
      } else {
        onShowToast?.('TikTok yêu cầu xác thực bot. Hãy mở Bookmarklet để quét trực tiếp từ trình duyệt!', 'info');
        setShowBookmarkletModal(true);
      }
    } catch (err) {
      onShowToast?.('Lỗi kết nối máy chủ TikTok: ' + err.message, 'error');
      setShowBookmarkletModal(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleStartEdit = (item) => {
    if (!item) return;
    setEditingId(item.id);
    const existing = safeMetrics.find(m => m?.code === item.code) || {
      id: 'm-' + (item.id || Date.now()),
      code: item.code || '',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      conversions: 0
    };
    setTempRow({ ...existing });
  };

  const handleSaveEdit = (code) => {
    if (!code) return;
    const existingIndex = safeMetrics.findIndex(m => m?.code === code);
    let updated;
    if (existingIndex >= 0) {
      updated = safeMetrics.map(m => m?.code === code ? { ...tempRow } : m);
    } else {
      updated = [...safeMetrics, { ...tempRow, code }];
    }
    setMetrics(updated);
    metricsService.update(code, tempRow);
    setEditingId(null);
    onShowToast?.('Đã lưu số liệu thủ công thành công!', 'success');
  };

  // Total KPIs: combination of manual metrics + synced social posts
  const manualViews = safeMetrics.reduce((acc, curr) => acc + (Number(curr?.views) || 0), 0);
  const socialViews = syncedSocialPosts.reduce((acc, curr) => acc + (Number(curr?.views) || 0), 0);
  const totalViews = manualViews + socialViews;

  const manualLikes = safeMetrics.reduce((acc, curr) => acc + (Number(curr?.likes) || 0), 0);
  const socialLikes = syncedSocialPosts.reduce((acc, curr) => acc + (Number(curr?.likes) || 0), 0);
  const totalLikes = manualLikes + socialLikes;

  const manualComments = safeMetrics.reduce((acc, curr) => acc + (Number(curr?.comments) || 0), 0);
  const socialComments = syncedSocialPosts.reduce((acc, curr) => acc + (Number(curr?.comments) || 0), 0);
  const totalComments = manualComments + socialComments;

  const manualShares = safeMetrics.reduce((acc, curr) => acc + (Number(curr?.shares) || 0), 0);
  const socialShares = syncedSocialPosts.reduce((acc, curr) => acc + (Number(curr?.shares) || 0), 0);
  const totalShares = manualShares + socialShares;

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="tactile-card p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base">Quản lý số liệu tương tác</h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Đồng bộ dữ liệu thực tế từ TikTok & Facebook qua Bookmarklet hoặc cập nhật thủ công
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncTikTok}
            disabled={isSyncing}
            className="tactile-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-60 border border-slate-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ TikTok'}</span>
          </button>

          <button
            onClick={() => setShowBookmarkletModal(true)}
            className="tactile-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200/90 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer bg-white"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Bookmarklet quét số liệu</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards (Instrument Cluster) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Views */}
          <div className="p-4 sm:p-5 border-r border-b lg:border-b-0 border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Tổng lượt xem (Views)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">
              {totalViews.toLocaleString('vi-VN')}
            </p>
            {socialViews > 0 && (
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                TikTok & FB: {socialViews.toLocaleString('vi-VN')}
              </p>
            )}
          </div>

          {/* Card 2: Likes */}
          <div className="p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Tổng Tim / Thích (Likes)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">
              {totalLikes.toLocaleString('vi-VN')}
            </p>
            {socialLikes > 0 && (
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                TikTok & FB: {socialLikes.toLocaleString('vi-VN')}
              </p>
            )}
          </div>

          {/* Card 3: Comments */}
          <div className="p-4 sm:p-5 border-r lg:border-r border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>Bình luận (Comments)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">
              {totalComments.toLocaleString('vi-VN')}
            </p>
            {socialComments > 0 && (
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                TikTok & FB: {socialComments.toLocaleString('vi-VN')}
              </p>
            )}
          </div>

          {/* Card 4: Shares */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
              <Share2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Chia sẻ (Shares)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">
              {totalShares.toLocaleString('vi-VN')}
            </p>
            {socialShares > 0 && (
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                TikTok & FB: {socialShares.toLocaleString('vi-VN')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Synced Social Posts Table (social_metrics) */}
      {syncedSocialPosts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#0F172A]">Bài viết đã đồng bộ từ TikTok & Facebook</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
                  {syncedSocialPosts.length} bài
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Dữ liệu thực tế quét qua Bookmarklet được lưu trữ tại bảng <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">social_metrics</code>
              </p>
            </div>
            <button
              onClick={loadSocialMetrics}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tải lại</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
              <thead className="bg-slate-50/60 text-xs font-medium text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Kênh</th>
                  <th className="py-3 px-4">Tiêu đề bài viết / Video</th>
                  <th className="py-3 px-4">Lượt xem</th>
                  <th className="py-3 px-4">Tim (Likes)</th>
                  <th className="py-3 px-4">Bình luận</th>
                  <th className="py-3 px-4">Chia sẻ</th>
                  <th className="py-3 px-4 text-right">Xem link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {syncedSocialPosts.map((post) => (
                  <tr key={post.id || post.post_id} className="row-tactile transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        post.platform === 'tiktok'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      }`}>
                        {post.platform === 'tiktok' ? 'TikTok' : 'Facebook'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-900 max-w-xs truncate" title={post.title}>
                      {post.title || `Bài viết #${post.post_id}`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-blue-600">
                      {(Number(post.views) || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-rose-600">
                      {(Number(post.likes) || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-amber-600">
                      {(Number(post.comments) || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {(Number(post.shares) || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {post.url ? (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-600 font-sans text-xs transition-colors"
                        >
                          Mở link <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 font-sans">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Content Plan Metrics Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A]">Bảng số liệu 8 bài bắt buộc & Lịch nội dung</h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Cập nhật chỉ số thực tế sau khi đăng bài để đối soát và báo cáo</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
            <thead className="bg-slate-50/60 text-xs font-medium text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã nội dung</th>
                <th className="py-3 px-4">Kênh</th>
                <th className="py-3 px-4">Lượt xem</th>
                <th className="py-3 px-4">Thích</th>
                <th className="py-3 px-4">Bình luận</th>
                <th className="py-3 px-4">Chia sẻ</th>
                <th className="py-3 px-4">Lưu</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeContents.length > 0 ? (
                safeContents.map((item) => {
                  const metric = safeMetrics.find(m => m?.code === item?.code) || {
                    views: 0, likes: 0, comments: 0, shares: 0, saves: 0
                  };
                  const isEditing = editingId === item?.id;

                  return (
                    <tr key={item?.id || Math.random()} className="row-tactile transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#0F172A] text-xs">
                        <span className="font-mono">{item?.code}</span>
                        <span className="block text-[11px] text-slate-400 font-normal truncate max-w-xs">{item?.topic}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{item?.channel}</td>

                      {/* Views */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.views ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, views: parseInt(e.target.value) || 0 })}
                            className="input-tactile w-20 px-2 py-1 text-xs rounded-md font-mono"
                          />
                        ) : (
                          <span className="font-medium text-slate-900 font-mono">{(metric?.views || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Likes */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.likes ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, likes: parseInt(e.target.value) || 0 })}
                            className="input-tactile w-20 px-2 py-1 text-xs rounded-md font-mono"
                          />
                        ) : (
                          <span className="font-medium text-slate-900 font-mono">{(metric?.likes || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Comments */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.comments ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, comments: parseInt(e.target.value) || 0 })}
                            className="input-tactile w-20 px-2 py-1 text-xs rounded-md font-mono"
                          />
                        ) : (
                          <span className="font-medium text-slate-900 font-mono">{(metric?.comments || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Shares */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.shares ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, shares: parseInt(e.target.value) || 0 })}
                            className="input-tactile w-20 px-2 py-1 text-xs rounded-md font-mono"
                          />
                        ) : (
                          <span className="font-medium text-slate-900 font-mono">{(metric?.shares || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Saves */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.saves ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, saves: parseInt(e.target.value) || 0 })}
                            className="input-tactile w-20 px-2 py-1 text-xs rounded-md font-mono"
                          />
                        ) : (
                          <span className="font-medium text-slate-900 font-mono">{(metric?.saves || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(item?.code)}
                              className="tactile-btn bg-[#0F172A] text-white px-2.5 py-1 rounded-md text-xs font-medium hover:bg-slate-800 cursor-pointer shadow-2xs"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-slate-500 hover:text-slate-800 text-xs px-1.5 py-1 cursor-pointer"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
                          >
                            Nhập số liệu
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-xs text-slate-400">
                    Chưa có bài viết nào trong danh sách
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookmarklet Modal */}
      <BookmarkletModal
        isOpen={showBookmarkletModal}
        onClose={() => setShowBookmarkletModal(false)}
      />
    </div>
  );
}
