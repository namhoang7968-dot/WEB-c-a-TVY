import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ExternalLink,
  FilterX,
  FileSpreadsheet
} from 'lucide-react';

export default function ContentCalendar({
  contents = [],
  onEdit,
  onDelete,
  onExportCSV,
  onCreateNew
}) {
  const safeContents = Array.isArray(contents) ? contents : [];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Đang làm');
  const [groupFilter, setGroupFilter] = useState('Tất cả nhóm');

  // Filtered contents
  const filteredContents = useMemo(() => {
    return safeContents.filter((item) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchSearch =
        !searchLower ||
        item?.code?.toLowerCase().includes(searchLower) ||
        item?.topic?.toLowerCase().includes(searchLower) ||
        item?.description?.toLowerCase().includes(searchLower) ||
        item?.channel?.toLowerCase().includes(searchLower);

      const matchStatus =
        statusFilter === 'Tất cả' || item?.status === statusFilter;

      const matchGroup =
        groupFilter === 'Tất cả nhóm' || item?.group === groupFilter;

      return matchSearch && matchStatus && matchGroup;
    });
  }, [safeContents, searchTerm, statusFilter, groupFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Tất cả');
    setGroupFilter('Tất cả nhóm');
  };

  return (
    <div className="space-y-4">
      {/* Filter and Action Toolbar */}
      <div className="tactile-card p-3 sm:p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã, chủ đề, kênh..."
            className="input-tactile w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 pl-9 pr-8 py-2 rounded-lg"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm leading-none p-1 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdowns & Export Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-tactile appearance-none text-xs sm:text-sm font-medium text-slate-700 pl-3 pr-8 py-2 rounded-lg cursor-pointer min-w-[130px]"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Đang làm">Đang làm</option>
              <option value="Đã đăng">Đã đăng</option>
              <option value="Chưa làm">Chưa làm</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Group Filter */}
          <div className="relative">
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="input-tactile appearance-none text-xs sm:text-sm font-medium text-slate-700 pl-3 pr-8 py-2 rounded-lg cursor-pointer min-w-[135px]"
            >
              <option value="Tất cả nhóm">Tất cả nhóm</option>
              <option value="Bài bắt buộc">Bài bắt buộc</option>
              <option value="Nội dung bổ sung">Nội dung bổ sung</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={() => onExportCSV(filteredContents)}
            className="tactile-btn inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg border border-slate-200/90 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
            title="Tải về file Excel CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table Container (Hallmark Editorial Table with Sentence-Case Headers) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                <th className="py-3 px-4 w-[200px] whitespace-nowrap">Mã / Nhóm</th>
                <th className="py-3 px-4 min-w-[320px]">Chủ đề & Mục tiêu</th>
                <th className="py-3 px-4 w-[160px] whitespace-nowrap">Kênh / Định dạng</th>
                <th className="py-3 px-4 w-[140px] whitespace-nowrap">Ngày dự kiến</th>
                <th className="py-3 px-4 w-[125px] whitespace-nowrap">Trạng thái</th>
                <th className="py-3 px-4 w-[95px] text-right whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredContents.length > 0 ? (
                filteredContents.map((item) => (
                  <tr
                    key={item.id}
                    className="row-tactile transition-colors group"
                  >
                    {/* MÃ / NHÓM */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="font-semibold text-[#0F172A] font-mono text-xs sm:text-sm">
                        {item.code}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                            item.group === 'Bài bắt buộc'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                          }`}
                        >
                          {item.group}
                        </span>
                      </div>
                    </td>

                    {/* CHỦ ĐỀ & MỤC TIÊU */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-[#0F172A] text-xs sm:text-sm leading-snug">
                        {item.topic}
                      </div>
                      {item.description && (
                        <div className="mt-1 text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">
                          {item.description}
                        </div>
                      )}
                      {item.link && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 hover:underline">
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <a href={item.link} target="_blank" rel="noreferrer" className="truncate max-w-xs">
                            {item.link}
                          </a>
                        </div>
                      )}
                    </td>

                    {/* KÊNH / ĐỊNH DẠNG */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-medium text-[#0F172A] text-xs sm:text-sm">
                        {item.channel}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.format}
                      </div>
                    </td>

                    {/* NGÀY DỰ KIẾN */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="text-xs sm:text-sm font-medium text-[#0F172A] font-mono">
                        {item.scheduledDate}
                      </div>
                      {item.deadline && (
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Hạn: {item.deadline}
                        </div>
                      )}
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="py-3.5 px-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Đang làm'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                            : item.status === 'Đã đăng'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'Đang làm'
                            ? 'bg-amber-500'
                            : item.status === 'Đã đăng'
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`} />
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* THAO TÁC */}
                    <td className="py-3.5 px-4 align-top text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="tactile-btn text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="tactile-btn text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                        <FilterX className="w-5 h-5" />
                      </div>
                      <p className="text-[#0F172A] font-semibold text-sm">
                        Không tìm thấy nội dung phù hợp
                      </p>
                      <p className="text-slate-500 text-xs mt-1 mb-3.5">
                        Thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="tactile-btn text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200/60 transition-colors cursor-pointer"
                      >
                        Đặt lại bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer info */}
        <div className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Hiển thị <span className="font-semibold text-slate-800 font-mono">{filteredContents.length}</span> / <span className="font-mono">{safeContents.length}</span> nội dung
          </div>
          <div className="text-[11px] text-slate-400">
            Dữ liệu đồng bộ trực tiếp hai chiều với Supabase Cloud
          </div>
        </div>
      </div>
    </div>
  );
}
