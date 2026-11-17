import React, { useState } from 'react';
import { metricsService } from '../../services/otherDataService';
import { socialSyncService } from '../../services/socialSyncService';
import {
  Award,
  RefreshCw,
  Bookmark,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Video,
  ExternalLink,
  Sparkles,
  Share2
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

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#10B981', '#F59E0B', '#EF4444'];

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
        // Refresh metrics
        const refreshed = await metricsService.fetch();
        setMetrics(refreshed);
      } else {
        // Fallback required: Open bookmarklet modal
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
    <div className="space-y-6">
      {/* Top action toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">Phân tích & Đo lường hiệu quả đa kênh</h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              TikTok & Facebook
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu kết nối tự động với kênh TikTok @thuyvy.risetoshine và Facebook @thuyvy.vandinh
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync TikTok Button */}
          <button
            onClick={handleSyncTikTok}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-70"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ TikTok...' : 'Đồng bộ TikTok ngay'}</span>
          </button>

          {/* Bookmarklet instructions button */}
          <button
            onClick={() => setShowBookmarkletModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Bookmarklet Quét Số Liệu</span>
          </button>
        </div>
      </div>

      {/* Recharts Growth Chart Area */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Biểu Đồ Tăng Trưởng Lượt Xem & Tương Tác</h4>
            <p className="text-xs text-slate-500">Trực quan hóa số liệu thực tế qua thư viện Recharts</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveChartTab('bar')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeChartTab === 'bar' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cột (Views)
            </button>
            <button
              onClick={() => setActiveChartTab('area')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeChartTab === 'area' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Vùng tương tác
            </button>
            <button
              onClick={() => setActiveChartTab('pie')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeChartTab === 'pie' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-xl border border-slate-700">
                          <p className="font-bold mb-1">{data.fullTitle}</p>
                          <p className="text-blue-300">Lượt xem: {(data.views || 0).toLocaleString()}</p>
                          <p className="text-emerald-300">Tương tác: {(data.totalEngagement || 0).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="views" name="Lượt xem (Views)" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'area' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={merged} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="likes" name="Lượt thích (Likes)" stroke="#EF4444" fillOpacity={1} fill="url(#colorLikes)" />
                <Area type="monotone" dataKey="shares" name="Chia sẻ (Shares)" stroke="#10B981" fillOpacity={1} fill="url(#colorShares)" />
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
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => Number(value).toLocaleString() + ' lượt xem'} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top 3 Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">Top 3 Bài Có Lượt Xem Cao Nhất</h3>
        </div>

        {top3.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((item, idx) => (
              <div
                key={item?.id || idx}
                className={`p-4 rounded-xl border relative ${
                  idx === 0
                    ? 'border-amber-300 bg-amber-50/30 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{item?.channel || 'N/A'}</span>
                </div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 mb-3">
                  {item?.fullTitle || 'Nội dung chưa đặt tiêu đề'}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500">Lượt xem:</span>
                  <span className="font-bold text-blue-600">{(item?.views || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-500">Tương tác:</span>
                  <span className="font-semibold text-slate-700">{(item?.totalEngagement || 0).toLocaleString()}</span>
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
