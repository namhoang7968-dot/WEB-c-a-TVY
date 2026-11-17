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
    <div className="space-y-5">
      {/* UTM Generator Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Link tiếp thị chiến dịch cá nhân (Personal UTM Link)</h3>
        <p className="text-xs text-slate-500 mb-3.5 font-normal">
          Dùng link này để kêu gọi khán giả đăng ký trải nghiệm Google AI Plus và ghi nhận thành tích cho bạn
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <div className="flex-1 bg-slate-50/80 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-700 truncate select-all flex items-center">
            {myUtmLink}
          </div>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép link'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1.5">
            <MousePointerClick className="w-4 h-4 text-blue-600" />
            <span>Tổng lượt nhấp (Clicks)</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{totalClicks.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1.5">
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Đăng ký tham gia (Signups)</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{totalSignups.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Tỷ lệ chuyển đổi (CVR)</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{avgRate}%</p>
        </div>
      </div>

      {/* Conversion Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-900">Chi tiết lượt nhấp và chuyển đổi theo nguồn</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/90">
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
                  <tr key={idx} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">{row?.date || ''}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 text-xs">{row?.source || ''}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-900 font-mono">{(row?.clicks || 0).toLocaleString()}</td>
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
