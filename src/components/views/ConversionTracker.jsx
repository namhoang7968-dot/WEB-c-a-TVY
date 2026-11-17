import React, { useState } from 'react';
import { Target, Link, Copy, Check, MousePointerClick, UserPlus, Award } from 'lucide-react';

export default function ConversionTracker({ onShowToast }) {
  const [copied, setCopied] = useState(false);
  const myUtmLink = 'https://ai.google.dev/plus?utm_source=creator&utm_campaign=gsa2024&utm_content=vn_ambassador';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(myUtmLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast?.('Đã sao chép link chiến dịch kèm UTM!', 'success');
  };

  const referralData = [
    { date: '22/10/2024', source: 'TikTok Bio Link', clicks: 312, signups: 42, conversionRate: '13.4%' },
    { date: '22/10/2024', source: 'Facebook Comment Pin', clicks: 184, signups: 28, conversionRate: '15.2%' },
    { date: '23/10/2024', source: 'TikTok Teaser Video CTA', clicks: 495, signups: 86, conversionRate: '17.3%' },
    { date: '24/10/2024', source: 'Threads Link', clicks: 120, signups: 14, conversionRate: '11.6%' },
  ];

  const totalClicks = referralData.reduce((acc, c) => acc + c.clicks, 0);
  const totalSignups = referralData.reduce((acc, c) => acc + c.signups, 0);
  const avgRate = ((totalSignups / totalClicks) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* UTM Generator Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Link tiếp thị chiến dịch cá nhân (Personal UTM Link)</h3>
        <p className="text-xs text-slate-500 mb-4">
          Dùng link này để kêu gọi khán giả đăng ký trải nghiệm Google AI Plus và ghi nhận thành tích cho bạn
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-700 truncate select-all flex items-center">
            {myUtmLink}
          </div>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép link'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-2">
            <MousePointerClick className="w-4 h-4 text-blue-500" />
            <span>Tổng lượt nhấp (Clicks)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalClicks.toLocaleString()}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-2">
            <UserPlus className="w-4 h-4 text-emerald-500" />
            <span>Đăng ký tham gia (Signups)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalSignups.toLocaleString()}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Tỷ lệ chuyển đổi (CVR)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{avgRate}%</p>
        </div>
      </div>

      {/* Conversion Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-900">Chi tiết lượt nhấp và chuyển đổi theo nguồn</h4>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Ngày</th>
              <th className="py-3 px-4">Nguồn dẫn (Placement)</th>
              <th className="py-3 px-4">Lượt nhấp (Clicks)</th>
              <th className="py-3 px-4">Đăng ký (Signups)</th>
              <th className="py-3 px-4">Tỷ lệ CVR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {referralData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="py-3 px-4 text-xs text-slate-600">{row.date}</td>
                <td className="py-3 px-4 font-semibold text-slate-800 text-xs">{row.source}</td>
                <td className="py-3 px-4 text-xs font-semibold text-slate-900">{row.clicks}</td>
                <td className="py-3 px-4 text-xs font-bold text-emerald-600">+{row.signups}</td>
                <td className="py-3 px-4 text-xs font-semibold text-blue-600">{row.conversionRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
