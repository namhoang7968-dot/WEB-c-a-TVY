import React, { useState } from 'react';
import { conversionService } from '../../services/otherDataService';
import { Copy, Check, MousePointerClick, UserPlus, Award } from 'lucide-react';

export default function ConversionTracker({ onShowToast }) {
  const [copied, setCopied] = useState(false);
  const myUtmLink = 'https://ai.google.dev/plus?utm_source=creator&utm_campaign=gsa2024&utm_content=vn_ambassador';

  const [referralData] = useState(() => conversionService.get() || []);
  const safeData = Array.isArray(referralData) ? referralData : [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(myUtmLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast?.('Đã sao chép link chiến dịch kèm UTM!', 'success');
  };

  const totalClicks = safeData.reduce((acc, c) => acc + (Number(c?.clicks) || 0), 0);
  const totalSignups = safeData.reduce((acc, c) => acc + (Number(c?.signups) || 0), 0);
  const avgRate = totalClicks > 0 ? ((totalSignups / totalClicks) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* UTM Generator Box */}
      <div className="tactile-card rounded-xl p-5 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-[#0F172A] mb-1">Link tiếp thị chiến dịch cá nhân (Personal UTM Link)</h3>
        <p className="text-xs text-slate-500 mb-3.5 font-normal">
          Dùng link này để kêu gọi khán giả đăng ký trải nghiệm Google AI Plus và ghi nhận thành tích cho bạn
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-700 truncate select-all flex items-center">
            {myUtmLink}
          </div>
          <button
            onClick={handleCopyLink}
            className="tactile-btn inline-flex items-center justify-center gap-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-2xs border border-slate-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép link'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Instrument Cluster) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
          <div className="p-5">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1.5">
              <MousePointerClick className="w-4 h-4 text-blue-600" />
              <span>Tổng lượt nhấp (Clicks)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">{totalClicks.toLocaleString()}</p>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1.5">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Đăng ký tham gia (Signups)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">{totalSignups.toLocaleString()}</p>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Tỷ lệ chuyển đổi (CVR)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">{avgRate}%</p>
          </div>
        </div>
      </div>

      {/* Conversion Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-[#0F172A]">Chi tiết lượt nhấp và chuyển đổi theo nguồn</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/60 text-xs font-medium text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ngày</th>
                <th className="py-3 px-4">Nguồn dẫn (Placement)</th>
                <th className="py-3 px-4">Lượt nhấp (Clicks)</th>
                <th className="py-3 px-4">Đăng ký (Signups)</th>
                <th className="py-3 px-4">Tỷ lệ CVR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeData.length > 0 ? (
                safeData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">{row?.date || ''}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 text-xs">{row?.source || ''}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[#0F172A] font-mono">{(row?.clicks || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-emerald-600 font-mono">+{(row?.signups || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-xs font-medium text-blue-600 font-mono">{row?.conversionRate || '0%'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-xs text-slate-400">
                    Chưa có dữ liệu chuyển đổi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
