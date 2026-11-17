import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Download,
  Edit3,
  Trash2,
  ExternalLink,
  Plus,
  FilterX,
  FileSpreadsheet
} from 'lucide-react';

export default function ContentCalendar({
  contents,
  onEdit,
  onDelete,
  onExportCSV,
  onCreateNew
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Đang làm'); // Default as in screenshot
  const [groupFilter, setGroupFilter] = useState('Tất cả nhóm');

  // Filtered contents
  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      // Search by code, topic, channel, description
      const searchLower = searchTerm.toLowerCase().trim();
      const matchSearch =
        !searchLower ||
        item.code?.toLowerCase().includes(searchLower) ||
        item.topic?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.channel?.toLowerCase().includes(searchLower);

      // Status filter
      const matchStatus =
        statusFilter === 'Tất cả' || item.status === statusFilter;

      // Group filter
      const matchGroup =
        groupFilter === 'Tất cả nhóm' || item.group === groupFilter;

      return matchSearch && matchStatus && matchGroup;
    });
  }, [contents, searchTerm, statusFilter, groupFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Tất cả');
    setGroupFilter('Tất cả nhóm');
  };

  return (
    <div className="space-y-4">
      {/* Filter and Action Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        {/* Search input */}
        <div className="relative flex-1 min-w-[260px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã, chủ đề, kênh..."
            className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-3.5 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
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
              className="appearance-none bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 pl-3.5 pr-8 py-2 rounded-lg border border-blue-400/80 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-w-[125px]"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Đang làm">Đang làm</option>
              <option value="Đã đăng">Đã đăng</option>
              <option value="Chưa làm">Chưa làm</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Group Filter */}
          <div className="relative">
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="appearance-none bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 pl-3.5 pr-8 py-2 rounded-lg border border-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-w-[140px]"
            >
              <option value="Tất cả nhóm">Tất cả nhóm</option>
              <option value="Bài bắt buộc">Bài bắt buộc</option>
              <option value="Nội dung bổ sung">Nội dung bổ sung</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={() => onExportCSV(filteredContents)}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-medium px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="Tải về file Excel CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-[210px] whitespace-nowrap">MÃ / NHÓM</th>
                <th className="py-3 px-4 min-w-[320px]">CHỦ ĐỀ & MỤC TIÊU</th>
                <th className="py-3 px-4 w-[160px] whitespace-nowrap">KÊNH / ĐỊNH DẠNG</th>
                <th className="py-3 px-4 w-[140px] whitespace-nowrap">NGÀY DỰ KIẾN</th>
                <th className="py-3 px-4 w-[130px] whitespace-nowrap">TRẠNG THÁI</th>
                <th className="py-3 px-4 w-[100px] text-center whitespace-nowrap">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredContents.length > 0 ? (
                filteredContents.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* MÃ / NHÓM */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">
                        {item.code}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                            item.group === 'Bài bắt buộc'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}
                        >
                          {item.group}
                        </span>
                      </div>
                    </td>

                    {/* CHỦ ĐỀ & MỤC TIÊU */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-bold text-slate-900 text-sm leading-snug">
                        {item.topic}
                      </div>
                      {item.description && (
                        <div className="mt-1 text-xs text-slate-500 leading-relaxed font-normal">
                          {item.description}
                        </div>
                      )}
                      {item.link && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-blue-600 hover:underline">
                          <ExternalLink className="w-3 h-3" />
                          <a href={item.link} target="_blank" rel="noreferrer" className="truncate max-w-xs">
                            {item.link}
                          </a>
                        </div>
                      )}
                    </td>

                    {/* KÊNH / ĐỊNH DẠNG */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-800 text-sm">
                        {item.channel}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.format}
                      </div>
                    </td>

                    {/* NGÀY DỰ KIẾN */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="text-xs sm:text-sm font-semibold text-slate-800">
                        {item.scheduledDate}
                      </div>
                      {item.deadline && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          Hạn: {item.deadline}
                        </div>
                      )}
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="py-3.5 px-4 align-top">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                          item.status === 'Đang làm'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.status === 'Đã đăng'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* THAO TÁC */}
                    <td className="py-3.5 px-4 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors py-0.5 px-1.5 rounded cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors py-0.5 px-1.5 rounded cursor-pointer"
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
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <FilterX className="w-6 h-6" />
                      </div>
                      <p className="text-slate-700 font-semibold text-sm">
                        Không tìm thấy nội dung phù hợp
                      </p>
                      <p className="text-slate-400 text-xs mt-1 mb-4">
                        Thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
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
        <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            Hiển thị <span className="font-semibold text-slate-700">{filteredContents.length}</span> / {contents.length} nội dung
          </div>
          <div className="text-[11px] text-slate-400">
            Mẹo: Nhấn nút "Sửa" hoặc "+ Tạo nội dung" để cập nhật dữ liệu trực tiếp
          </div>
        </div>
      </div>
    </div>
  );
}
