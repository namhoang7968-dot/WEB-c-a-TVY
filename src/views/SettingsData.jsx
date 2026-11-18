import React, { useState } from 'react';
import { settingsService } from '@/services/otherDataService';
import { contentService } from '@/services/contentService';
import { supabase, SUPABASE_CONFIG } from '@/services/supabaseClient';
import { Download, Upload, ShieldCheck, Check, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SettingsData({ onReloadData, onShowToast }) {
  const [settings, setSettings] = useState(() => settingsService.get());
  const [supabaseConfig, setSupabaseConfig] = useState({
    enabled: true,
    url: SUPABASE_CONFIG.url,
    anonKey: SUPABASE_CONFIG.anonKey,
    tableName: 'gsa_contents'
  });
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected'); // 'connected', 'testing', 'error'

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.from('gsa_contents').select('id').limit(1);
      if (error) throw error;
      setConnectionStatus('connected');
      onShowToast?.('Kết nối Supabase thành công! Dữ liệu đang đồng bộ mượt mà.', 'success');
    } catch (err) {
      setConnectionStatus('error');
      onShowToast?.('Không thể kết nối Supabase: ' + err.message, 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleExportJSON = () => {
    const fullData = {
      exportedAt: new Date().toISOString(),
      contents: contentService.getLocalCache(),
      settings: settingsService.get()
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GSA_Creator_Studio_Supabase_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    onShowToast?.('Đã xuất toàn bộ dữ liệu ra file JSON thành công!', 'success');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.contents)) {
          contentService.setLocalCache(parsed.contents);
          onReloadData?.();
          onShowToast?.('Đã nạp dữ liệu từ file JSON!', 'success');
        } else {
          onShowToast?.('File JSON không đúng cấu trúc!', 'error');
        }
      } catch (err) {
        onShowToast?.('Lỗi đọc file JSON: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Storage Mode Banner: Connected to Supabase */}
      <div className="tactile-card rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-[#0F172A]">Trạng thái lưu trữ dữ liệu</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Đồng bộ Supabase Cloud (Live)</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
              Toàn bộ dữ liệu của bạn (Lịch nội dung, Ngân hàng ý tưởng, Checklist, Số liệu thủ công) hiện đang được lưu trữ và đồng bộ hóa trực tiếp 2 chiều với dự án Supabase <span className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded text-[11px]">vmksmalbkveanjnqqivr</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Supabase Integration Details */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-[#0F172A]">Thông tin kết nối Supabase</h3>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="tactile-btn inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}</span>
          </button>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                readOnly
                value={supabaseConfig.url}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 bg-slate-50/70 text-slate-700 rounded-lg select-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                readOnly
                value={supabaseConfig.anonKey}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 bg-slate-50/70 text-slate-700 rounded-lg select-all"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50/80 border border-slate-200/70 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-medium text-slate-800">Cơ sở dữ liệu:</span>
              <span>PostgreSQL trên Supabase Cloud</span>
            </div>
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Đang kết nối</span>
            </span>
          </div>
        </div>
      </div>

      {/* Backup and Restore Data */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-1">Sao lưu dự phòng cục bộ (Local JSON Backup)</h3>
        <p className="text-xs text-slate-500 mb-3.5 font-normal">
          Xuất dữ liệu dự phòng về máy hoặc tải lên file JSON khi cần phục hồi.
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            className="tactile-btn inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Xuất file JSON</span>
          </button>

          <label className="tactile-btn inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Nạp từ file JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
