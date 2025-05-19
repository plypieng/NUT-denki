'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { SendHorizontal } from 'lucide-react';

export default function FeedbackPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    type: 'bug', // Default to bug report
    title: '',
    description: '',
    email: session?.user?.email || '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send the feedback data to our API endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '送信中にエラーが発生しました');
      }
      
      toast.success('フィードバックを受け付けました。ありがとうございます！');
      
      // Reset form fields except email
      setFormData({
        type: 'bug',
        title: '',
        description: '',
        email: session?.user?.email || '',
        name: '',
      });
    } catch (error: any) {
      toast.error(error.message || '送信に失敗しました。後でもう一度お試しください。');
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">バグ報告・機能提案</h1>
        
        <div className="card p-6 mb-8">
          <p className="mb-4">
            学生図鑑にバグや問題を見つけた場合、または新しい機能のアイデアがある場合は、このフォームからお知らせください。
            たぶんすごいバッグあると思います。
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                フィードバックの種類 <span className="text-accent-nut-red">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                required
              >
                <option value="bug">バグ報告</option>
                <option value="suggestion">機能提案</option>
                <option value="other">その他</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                タイトル <span className="text-accent-nut-red">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="例: プロフィール編集時にエラーが発生する"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                詳細 <span className="text-accent-nut-red">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="問題の詳細や再現手順、または提案の詳細について教えてください"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                お名前
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="任意"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                メールアドレス <span className="text-accent-nut-red">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="返信が必要な場合に使用します"
                required
                readOnly={!!session}
              />
              {session && (
                <p className="text-xs text-gray-500 mt-1">
                  ログイン中のメールアドレスが自動的に入力されています
                </p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={isSubmitting}
              >
                <SendHorizontal size={18} />
                <span>{isSubmitting ? '送信中...' : '送信する'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
