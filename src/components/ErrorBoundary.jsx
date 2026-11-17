import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 my-4 bg-white rounded-2xl border border-rose-200 shadow-sm max-w-2xl mx-auto text-center animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {this.props.fallbackTitle || 'Đã xảy ra lỗi khi hiển thị mục này'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            Hệ thống đã tự động ngăn chặn sự cố màn hình trắng. Dữ liệu của bạn trên Supabase và máy vẫn an toàn.
          </p>

          {this.state.error && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg text-left text-xs font-mono text-rose-600 border border-slate-200 overflow-x-auto max-h-32">
              {this.state.error.toString()}
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử tải lại</span>
            </button>
            <button
              onClick={() => {
                this.handleReset();
                if (window.location.hash) window.location.hash = '';
                window.location.reload();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Tải lại toàn bộ trang</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
