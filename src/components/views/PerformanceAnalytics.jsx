import React, { useState } from 'react';
import { metricsService } from '../../services/otherDataService';
import { socialSyncService } from '../../services/socialSyncService';
import {
  Award,
  RefreshCw,
  Bookmark,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import BookmarkletModal from '../BookmarkletModal';

const CHART_PALETTE = ['#2563EB', '#0D9488', '#6366F1', '#F59E0B', '#EC4899', '#64748B'];

export default function PerformanceAnalytics({ contents = [], onShowToast }) {
  const [metrics, setMetrics] = useState(() => metricsService.get() || []);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBookmarkletModal, setShowBookmarkletModal] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('bar'); // 'bar' | 'area' | 'pie'

  const safeContents = Array.isArray(contents) ? contents : [];
  const safeMetrics = Array.isArray(metrics) ? metrics : [];

  // Combine content + metrics safely
  const merged = safeContents.map(c => {
    const m = safeMetrics.find(item => item?.code === c?.code) || { views: 0, likes: 0, comments: 0, shares: 0 };
    const views = Number(m?.views) || 0;
    const likes = Number(m?.likes) || 0;
    const comments = Number(m?.comments) || 0;
    const shares = Number(m?.shares) || 0;
    return {
      ...c,
      name: c?.code?.replace('GSA-', '')?.substring(0, 16) || 'Bài',
      fullTitle: c?.topic || c?.code,
      views,
      likes,
      comments,
      shares,
      totalEngagement: likes + comments + shares
    };
  });

  const sortedByViews = [...merged].sort((a, b) => (b.views || 0) - (a.views || 0));
  const top3 = sortedByViews.slice(0, 3);

  // Platform breakdown data for PieChart
  const platformMap = {};
  merged.forEach(item => {
    const ch = item?.channel || 'Khác';
    if (!platformMap[ch]) platformMap[ch] = { name: ch, value: 0 };
    platformMap[ch].value += item.views || 0;
  });
  const pieData = Object.values(platformMap);

  // Sync TikTok handler
  const handleSyncTikTok = async () => {
    setIsSyncing(true);
    try {
      const res = await socialSyncService.syncTikTok();
      if (res?.success) {
        onShowToast?.(`Đã đồng bộ ${res.videosCount || 0} video từ TikTok @${res.handle}!`, 'success');
        const refreshed = await metricsService.fetch();
        setMetrics(refreshed || []);
      } else {
        onShowToast?.('TikTok yêu cầu bảo mật. Hãy sử dụng Bookmarklet 1-click để đồng bộ trực tiếp!', 'info');
        setShowBookmarkletModal(true);
      }
    } catch (err) {
      onShowToast?.('Lỗi kết nối máy chủ TikTok: ' + err.message, 'error');
      setShowBookmarkletModal(true);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top action toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 text-sm">Phân tích hiệu quả đa kênh</h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              TikTok & Facebook
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Dữ liệu kết nối tự động với kênh TikTok @thuyvy.risetoshine và Facebook cá nhân
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync TikTok Button */}
          <button
            onClick={handleSyncTikTok}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ TikTok'}</span>
          </button>

          {/* Bookmarklet instructions button */}
          <button
            onClick={() => setShowBookmarkletModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Bookmarklet Quét Số Liệu</span>
          </button>
        </div>
      </div>

      {/* Recharts Growth Chart Area */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">Biểu đồ tăng trưởng lượt xem & tương tác</h4>
            <p className="text-xs text-slate-500 font-normal">Trực quan hóa diễn biến theo từng bài viết và nền tảng</p>
          </div>

          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveChartTab('bar')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeChartTab === 'bar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cột (Views)
            </button>
            <button
              onClick={() => setActiveChartTab('area')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeChartTab === 'area' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Vùng tương tác
            </button>
            <button
              onClick={() => setActiveChartTab('pie')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeChartTab === 'pie' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tỷ trọng kênh
            </button>
          </div>
        </div>

        {/* Charts Container */}
        <div className="h-72 w-full">
          {activeChartTab === 'bar' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={merged} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-xl border border-slate-800">
                          <p className="font-semibold mb-1 truncate max-w-xs">{data.fullTitle}</p>
                          <p className="text-blue-300 font-mono">Lượt xem: {(data.views || 0).toLocaleString()}</p>
                          <p className="text-emerald-300 font-mono">Tương tác: {(data.totalEngagement || 0).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="views" name="Lượt xem (Views)" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'area' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={merged} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-xl border border-slate-800">
                          <p className="font-semibold mb-1 truncate max-w-xs">{data.fullTitle}</p>
                          <p className="text-blue-300 font-mono">Lượt thích: {(data.likes || 0).toLocaleString()}</p>
                          <p className="text-teal-300 font-mono">Chia sẻ: {(data.shares || 0).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="likes" name="Lượt thích (Likes)" stroke="#2563EB" strokeWidth={1.5} fillOpacity={1} fill="url(#colorLikes)" />
                <Area type="monotone" dataKey="shares" name="Chia sẻ (Shares)" stroke="#0D9488" strokeWidth={1.5} fillOpacity={1} fill="url(#colorShares)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'pie' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={95}
                  innerRadius={45}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => Number(value).toLocaleString() + ' lượt xem'} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top 3 Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
        <div className="flex items-center gap-2 mb-3.5">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-900">Top bài có lượt xem cao nhất</h3>
        </div>

        {top3.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {top3.map((item, idx) => (
              <div
                key={item?.id || idx}
                className={`p-4 rounded-xl border relative transition-colors ${
                  idx === 0
                    ? 'border-amber-200/80 bg-amber-50/20 shadow-2xs'
                    : 'border-slate-200/80 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold font-mono ${
                    idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">{item?.channel || 'N/A'}</span>
                </div>
                <p className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-2 mb-3 leading-snug">
                  {item?.fullTitle || 'Nội dung chưa đặt tiêu đề'}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500">Lượt xem:</span>
                  <span className="font-semibold text-blue-600 font-mono">{(item?.views || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-500">Tương tác:</span>
                  <span className="font-medium text-slate-700 font-mono">{(item?.totalEngagement || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            Chưa có bài viết nào để phân tích
          </div>
        )}
      </div>

      {/* Bookmarklet Modal */}
      <BookmarkletModal
        isOpen={showBookmarkletModal}
        onClose={() => setShowBookmarkletModal(false)}
      />
    </div>
  );
}
