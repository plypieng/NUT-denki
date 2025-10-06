'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({
  error,
  resetError
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          申し訳ありません
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          予期しないエラーが発生しました。ページを再読み込みしてください。
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-4 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm">
            <summary className="cursor-pointer font-medium">エラーの詳細 (開発環境のみ)</summary>
            <pre className="mt-2 whitespace-pre-wrap text-red-600 dark:text-red-400">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={resetError}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw size={16} />
          再試行
        </button>
      </div>
    </div>
  );
};