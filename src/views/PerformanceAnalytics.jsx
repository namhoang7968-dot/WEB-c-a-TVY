import React, { useState, useEffect } from 'react';
import { metricsService } from '@/services/otherDataService';
import { socialSyncService } from '@/services/socialSyncService';
import {
  Award,
  RefreshCw,
  Bookmark,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Eye,
  Heart,
  MessageSquare,
  Sparkles
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
import BookmarkletModal from '@/components/BookmarkletModal';

const CHART_PALETTE = ['#1D4ED8', '#E11D48', '#D97706', '#059669', '#475569'];

export default function PerformanceAnalytics({ contents = [], onShowToast }) {
  const [metrics, setMetrics] = useState(() => metricsService.get() || []);
  const [socialPosts, setSocialPosts] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBookmarkletModal, setShowBookmarkletModal] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('bar'); // 'bar' | 'area' | 'pie'

  const safeContents = Array.isArray(contents) ? contents : [];
  const safeMetrics = Array.isArray(metrics) ? metrics : [];

  // Load social posts from Supabase (social_metrics)
  const loadSocialMetrics = async () => {
    try {
      const posts = await socialSyncService.fetchMetrics();
      if (Array.isArray(posts)) {
        setSocialPosts(posts);
      }
    } catch (e) {
      console.warn('Lỗi tải social_metrics:', e);
    }
  };

  useEffect(() => {
    loadSocialMetrics();
  }, []);

  // Combine content items + metrics
  const mergedContents = safeContents.map(c => {
    const m = safeMetrics.find(item => item?.code === c?.code) || { views: 0, likes: 0, comments: 0, shares: 0 };
    const views = Number(m?.views) || 0;
    const likes = Number(m?.likes) || 0;
    const comments = Number(m?.comments) || 0;
    const shares = Number(m?.shares) || 0;
    return {
      ...c,
      name: c?.code?.replace('GSA-', '')?.substring(0, 16) || 'Bài',
      fullTitle: c?.topic || c?.code,
      channel: c?.channel || 'Chưa phân kênh',
      views,
      likes,
      comments,
      shares,
      totalEngagement: likes + comments + shares
    };
  });

  // Map synced social posts to the same structure
  const mappedSocialPosts = socialPosts.map((p, idx) => ({
    id: p.id || p.post_id || `social-${idx}`,
    code: p.post_id ? `#${String(p.post_id).slice(-6)}` : `SP-${idx + 1}`,
    name: p.post_id ? `#${String(p.post_id).slice(-6)}` : (p.platform === 'tiktok' ? 'TikTok' : 'FB'),
    fullTitle: p.title || `Bài đăng ${p.platform}`,
    channel: p.platform === 'tiktok' ? 'TikTok' : 'Facebook',
    views: Number(p.views) || 0,
    likes: Number(p.likes) || 0,
    comments: Number(p.comments) || 0,
    shares: Number(p.shares) || 0,
    totalEngagement: (Number(p.likes) || 0) + (Number(p.comments) || 0) + (Number(p.shares) || 0)
  }));

  // Complete list for charts
  const allChartData = [...mergedContents, ...mappedSocialPosts];

  const sortedByViews = [...allChartData].sort((a, b) => (b.views || 0) - (a.views || 0));
  const top3 = sortedByViews.slice(0, 3);

  // Platform breakdown data for PieChart
  const platformMap = {};
  allChartData.forEach(item => {
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
        loadSocialMetrics();
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
    <div className="space-y-6">
      {/* Top action toolbar */}
      <div className="tactile-card p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base">Phân tích hiệu quả đa kênh</h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              TikTok & Facebook
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Dữ liệu kết nối tự động từ TikTok @thuyvy.risetoshine và Facebook cá nhân
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sync TikTok Button */}
          <button
            onClick={handleSyncTikTok}
            disabled={isSyncing}
            className="tactile-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-60 border border-slate-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ TikTok'}</span>
          </button>

          {/* Bookmarklet instructions button */}
          <button
            onClick={() => setShowBookmarkletModal(true)}
            className="tactile-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer bg-white"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Bookmarklet quét số liệu</span>
          </button>
        </div>
      </div>

      {/* Recharts Growth Chart Area */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h4 className="font-semibold text-[#0F172A] text-sm sm:text-base">Diễn biến 3 chỉ số tương tác</h4>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Lượt xem, Tim (Likes) và Bình luận chi tiết từng nội dung</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveChartTab('bar')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeChartTab === 'bar' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cột (3 chỉ số)
            </button>
            <button
              onClick={() => setActiveChartTab('area')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeChartTab === 'area' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Vùng tương tác
            </button>
            <button
              onClick={() => setActiveChartTab('pie')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeChartTab === 'pie' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tỷ trọng kênh
            </button>
          </div>
        </div>

        {/* Charts Container with Hallmark Solid 1px Hairline Grid */}
        <div className="h-72 w-full">
          {activeChartTab === 'bar' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allChartData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <CartesianGrid stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#090D16] text-white p-3 rounded-lg text-xs shadow-xl border border-slate-800 space-y-1">
                          <p className="font-semibold truncate max-w-xs text-slate-200">{data.fullTitle}</p>
                          <p className="text-blue-400 font-mono">Lượt xem: {(data.views || 0).toLocaleString()}</p>
                          <p className="text-rose-400 font-mono">Tim (Likes): {(data.likes || 0).toLocaleString()}</p>
                          <p className="text-amber-400 font-mono">Bình luận: {(data.comments || 0).toLocaleString()}</p>
                          <p className="text-slate-400 font-mono text-[10px]">Kênh: {data.channel}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="views" name="Lượt xem (Views)" fill="#1D4ED8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="likes" name="Tim (Likes)" fill="#E11D48" radius={[3, 3, 0, 0]} />
                <Bar dataKey="comments" name="Bình luận (Comments)" fill="#D97706" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'area' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={allChartData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#090D16] text-white p-3 rounded-lg text-xs shadow-xl border border-slate-800 space-y-1">
                          <p className="font-semibold truncate max-w-xs text-slate-200">{data.fullTitle}</p>
                          <p className="text-blue-400 font-mono">Lượt xem: {(data.views || 0).toLocaleString()}</p>
                          <p className="text-rose-400 font-mono">Tim: {(data.likes || 0).toLocaleString()}</p>
                          <p className="text-amber-400 font-mono">Bình luận: {(data.comments || 0).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="views" name="Lượt xem (Views)" stroke="#1D4ED8" strokeWidth={1.5} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="likes" name="Tim (Likes)" stroke="#E11D48" strokeWidth={1.5} fillOpacity={1} fill="url(#colorLikes)" />
                <Area type="monotone" dataKey="comments" name="Bình luận (Comments)" stroke="#D97706" strokeWidth={1.5} fillOpacity={1} fill="url(#colorComments)" />
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
                  innerRadius={50}
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
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-[#0F172A]">Top nội dung có hiệu quả cao nhất</h3>
        </div>

        {top3.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {top3.map((item, idx) => (
              <div
                key={item?.id || idx}
                className={`p-4 rounded-xl border relative transition-all tactile-card ${
                  idx === 0
                    ? 'border-amber-200/80 bg-amber-50/15'
                    : 'border-slate-200/80 bg-slate-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                    idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">{item?.channel || 'N/A'}</span>
                </div>
                <p className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-2 mb-3 leading-snug">
                  {item?.fullTitle || 'Nội dung chưa đặt tiêu đề'}
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Lượt xem</span>
                    <span className="font-semibold text-blue-600">{(item?.views || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Tim / Thích</span>
                    <span className="font-semibold text-rose-600">{(item?.likes || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Bình luận</span>
                    <span className="font-semibold text-amber-600">{(item?.comments || 0).toLocaleString()}</span>
                  </div>
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
