import React, { useState } from 'react';
import { metricsService } from '../../services/otherDataService';
import { socialSyncService } from '../../services/socialSyncService';
import { Save, BarChart3, TrendingUp, Eye, Heart, MessageSquare, Share2, RefreshCw, Bookmark } from 'lucide-react';
import BookmarkletModal from '../BookmarkletModal';

export default function ManualMetrics({ contents = [], onShowToast }) {
  const [metrics, setMetrics] = useState(() => metricsService.get() || []);
  const [editingId, setEditingId] = useState(null);
  const [tempRow, setTempRow] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBookmarkletModal, setShowBookmarkletModal] = useState(false);

  const safeContents = Array.isArray(contents) ? contents : [];
  const safeMetrics = Array.isArray(metrics) ? metrics : [];

  const handleSyncTikTok = async () => {
    setIsSyncing(true);
    try {
      const res = await socialSyncService.syncTikTok();
      if (res?.success) {
        onShowToast?.(`Đã đồng bộ ${res.videosCount || 0} video từ TikTok @${res.handle}!`, 'success');
        const refreshed = await metricsService.fetch();
        setMetrics(refreshed);
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

  const totalViews = safeMetrics.reduce((acc, curr) => acc + (Number(curr?.views) || 0), 0);
  const totalLikes = safeMetrics.reduce((acc, curr) => acc + (Number(curr?.likes) || 0), 0);
  const totalComments = safeMetrics.reduce((acc, curr) => acc + (Number(curr?.comments) || 0), 0);
  const totalShares = safeMetrics.reduce((acc, curr) => acc + (Number(curr?.shares) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Quản lý & Cập nhật số liệu bài viết</h3>
          <p className="text-xs text-slate-500">Đồng bộ tự động từ TikTok hoặc quét số liệu Facebook qua Bookmarklet</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncTikTok}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-70"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ TikTok ngay'}</span>
          </button>

          <button
            onClick={() => setShowBookmarkletModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Bookmarklet Quét Facebook</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Eye className="w-4 h-4 text-blue-500" />
            <span>Tổng lượt xem (Views)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalViews.toLocaleString('vi-VN')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Tổng lượt thích (Likes)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalLikes.toLocaleString('vi-VN')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span>Bình luận (Comments)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalComments.toLocaleString('vi-VN')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Share2 className="w-4 h-4 text-emerald-500" />
            <span>Chia sẻ (Shares)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalShares.toLocaleString('vi-VN')}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Bảng nhập số liệu từng bài</h3>
            <p className="text-xs text-slate-500">Cập nhật chỉ số thực tế sau khi đăng bài để báo cáo ban tổ chức</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã nội dung</th>
                <th className="py-3 px-4">Kênh</th>
                <th className="py-3 px-4">Lượt xem (Views)</th>
                <th className="py-3 px-4">Thích (Likes)</th>
                <th className="py-3 px-4">Bình luận</th>
                <th className="py-3 px-4">Chia sẻ</th>
                <th className="py-3 px-4">Lưu (Saves)</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
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
                    <tr key={item?.id || Math.random()} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900 text-xs">
                        {item?.code}
                        <span className="block text-[11px] text-slate-400 font-normal truncate max-w-xs">{item?.topic}</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">{item?.channel}</td>

                      {/* Views */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.views ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, views: parseInt(e.target.value) || 0 })}
                            className="w-20 px-2 py-1 text-xs border rounded border-blue-400"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">{(metric?.views || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Likes */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.likes ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, likes: parseInt(e.target.value) || 0 })}
                            className="w-20 px-2 py-1 text-xs border rounded border-blue-400"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">{(metric?.likes || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Comments */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.comments ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, comments: parseInt(e.target.value) || 0 })}
                            className="w-20 px-2 py-1 text-xs border rounded border-blue-400"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">{(metric?.comments || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Shares */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.shares ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, shares: parseInt(e.target.value) || 0 })}
                            className="w-20 px-2 py-1 text-xs border rounded border-blue-400"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">{(metric?.shares || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Saves */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempRow.saves ?? 0}
                            onChange={(e) => setTempRow({ ...tempRow, saves: parseInt(e.target.value) || 0 })}
                            className="w-20 px-2 py-1 text-xs border rounded border-blue-400"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">{(metric?.saves || 0).toLocaleString()}</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleSaveEdit(item?.code)}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-slate-500 hover:text-slate-700 text-xs px-1 cursor-pointer"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
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
