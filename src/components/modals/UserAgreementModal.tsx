'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

type UserAgreementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export const UserAgreementModal = ({ isOpen, onClose, onAccept }: UserAgreementModalProps) => {
  const [agreed, setAgreed] = useState(false);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">学生プロフィールデータ利用規約</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>利用規約</h3>
            <p>長岡技術科学大学電気電子情報工学分野学生名簿システムへようこそ。プロフィールを登録する前に、以下の利用規約をお読みください。</p>
            
            <h4>1. データの収集と使用</h4>
            <p>本システムでは、以下の個人情報を収集します：</p>
            <ul>
              <li>学籍番号</li>
              <li>氏名</li>
              <li>生年月日</li>
              <li>出身地</li>
              <li>出身高校/高専</li>
              <li>趣味や専攻分野などの個人情報</li>
              <li>必要に応じてプロフィール画像</li>
            </ul>
            <p>これらの情報は以下の目的で使用されます：</p>
            <ul>
              <li>大学内での学生相互の交流促進</li>
              <li>専攻分野・研究室選択の参考情報</li>
              <li>教員による学生指導の補助資料</li>
            </ul>
            
            <h4>2. 情報の公開範囲</h4>
            <p>登録された情報は以下の範囲で公開されます：</p>
            <ul>
              <li>長岡技術科学大学の学生および教職員（本システムにログインできる者）</li>
              <li>あなたが入力した情報は、本学の電気電子情報工学分野内で共有されます</li>
              <li>外部への一般公開はされません</li>
            </ul>
            
            <h4>3. データの編集と削除</h4>
            <p>登録後も、以下の権利があります：</p>
            <ul>
              <li>自分のプロフィール情報をいつでも編集できます</li>
              <li>プロフィールの削除をリクエストすることができます</li>
              <li>個人情報の取り扱いについて質問がある場合は、管理者にお問い合わせください</li>
            </ul>
            
            <h4>4. 禁止事項</h4>
            <p>本システムの利用において、以下の行為は禁止されています：</p>
            <ul>
              <li>他者の個人情報を無断で収集・保存・共有すること</li>
              <li>虚偽の情報を登録すること</li>
              <li>システムの不正利用や妨害行為</li>
            </ul>
            
            <h4>5. 免責事項</h4>
            <p>本システムは学内利用を目的としており、登録情報の完全性や正確性を保証するものではありません。システムの利用によって生じた損害について、管理者は責任を負いません。</p>
          </div>
          
          <div className="mt-6 flex flex-col space-y-4">
            <label className="flex items-start gap-2">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="mt-1"
              />
              <span>上記の利用規約を読み、理解し、同意します。</span>
            </label>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={onAccept}
                disabled={!agreed}
                className={`px-4 py-2 rounded-md transition-colors ${
                  agreed 
                    ? 'bg-primary-nut-blue hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                }`}
              >
                同意して続ける
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
