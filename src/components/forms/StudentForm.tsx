'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, type StudentFormValues } from '@/lib/validations/student';
import { Specialty, SpecialtyLabels } from '@/types/schema';
import { CldUploadWidget } from 'next-cloudinary';
import { getStarSign } from '@/lib/utils/starSign';
import { toast } from 'sonner';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save,
  Upload,
  X
} from 'lucide-react';

// フォームステップ
enum FormStep {
  BasicInfo = 0,
  Origin = 1,
  University = 2,
  Personal = 3,
  Notes = 4,
}

type StudentFormProps = {
  initialData?: StudentFormValues & { id?: string };
  isEditing?: boolean;
};

export function StudentForm({ initialData, isEditing = false }: StudentFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.BasicInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [starSign, setStarSign] = useState<string | null>(initialData?.starSign || null);
  
  // Check if user is admin
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  
  // Get email username for non-admin users
  const emailUsername = session?.user?.email ? session.user.email.split('@')[0] : '';

  // 学生IDの変換: s253149 -> 253149XX (大学コードは入力必要)
  const getBaseStudentIdFromEmail = (email: string | null | undefined): string => {
    if (!email) return '';
    
    const username = email.split('@')[0];
    if (username.startsWith('s') && username.length >= 7) {
      // "s" を除去して数字部分を取得
      return username.substring(1);
    }
    return username;
  };
  
  // Add debug for initialData
  useEffect(() => {
    console.log('Student form initialData:', initialData);
  }, [initialData]);
  
  // フォームのセットアップ
  const methods = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      // 非管理者の場合は学生IDのベース部分をメールから取得して初期化
      studentId: !isAdmin && !isEditing ? getBaseStudentIdFromEmail(session?.user?.email) : '',
      fullName: '',
      nickname: '',
      birthDate: '',
      bloodType: '',
      hometown: '',
      almaMater: '',
      targetCourse: Specialty.DENKI_ENERGY_CONTROL,
      year: '',
      imageUrl: null,
      starSign: null,
      kosenDepartment: null,
      kosenThesis: null,
      mbti: null,
      hobby: null,
      circle: null,
      caption: null,
      lineUrl: null,
      instagramUrl: null,
      xUrl: null,
      likes: null,
      dislikes: null,
      goodSubjects: null,
      etcNote: null,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  // 生年月日が変更されたときに星座を計算
  const birthDate = watch('birthDate');
  
  useEffect(() => {
    if (birthDate) {
      const date = new Date(birthDate);
      if (!isNaN(date.getTime())) {
        const sign = getStarSign(date);
        setStarSign(sign);
        setValue('starSign', sign);
      }
    }
  }, [birthDate, setValue]);

  // フォーム送信処理
  const onSubmit = async (data: StudentFormValues) => {
    setIsSubmitting(true);

    try {
      // 編集時は学生IDごとのエンドポイントを使用
      const endpoint = isEditing 
        ? `/api/students/${initialData?.id}` 
        : '/api/students';
      const method = isEditing ? 'PATCH' : 'POST';
      
      // 編集時はidをペイロードに含めない（URLに含まれるため）
      const payload = data;
      console.log('Submitting to endpoint:', endpoint, 'with method:', method);
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '保存に失敗しました');
      }

      const result = await response.json();

      toast.success(
        isEditing ? '学生情報を更新しました' : '新しい学生を追加しました'
      );

      // 詳細ページへリダイレクト
      router.push(`/student/${result.id}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || '保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ステップを進める
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, FormStep.Notes));
  };

  // ステップを戻る
  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, FormStep.BasicInfo));
  };

  // ステップを直接選択
  const goToStep = (step: FormStep) => {
    setCurrentStep(step);
  };

  // Cloudinaryアップロード完了時の処理
  const handleUploadSuccess = (result: any) => {
    setValue('imageUrl', result.info.secure_url);
    toast.success('画像をアップロードしました');
    
    // Fix scrollbar issue caused by Cloudinary widget
    setTimeout(() => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      
      // Force layout recalculation
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };

  // 画像の削除
  const handleRemoveImage = () => {
    setValue('imageUrl', null);
  };

  // 現在のステップに基づいてフォームの内容を表示
  const renderFormStep = () => {
    switch (currentStep) {
      case FormStep.BasicInfo:
        return (
          <div className="space-y-6" key="basic-info-step">
            <h3 className="text-xl font-bold">基本情報</h3>

            {/* 写真アップロード */}
            <div className="flex flex-col items-center mb-6">
              <label className="block text-sm font-medium mb-2">写真</label>
              
              {watch('imageUrl') ? (
                <div className="relative w-40 h-40 mb-2">
                  <Image
                    src={watch('imageUrl') as string}
                    alt="学生写真(顔を含めてくださいね！)"
                    fill
                    className="object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-accent-nut-red text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                  onSuccess={handleUploadSuccess}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-40 h-40 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-nut-blue dark:hover:border-primary-nut-blue transition-colors"
                    >
                      <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                        <Upload size={32} />
                        <span className="mt-2 text-sm">画像をアップロード</span>
                      </div>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>

            {/* 氏名 */}
            <div className="form-group">
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                氏名 <span className="text-accent-nut-red">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                {...methods.register('fullName')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              />
              {errors.fullName && (
                <p className="text-accent-nut-red text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* ニックネーム */}
            <div className="form-group">
              <label htmlFor="nickname" className="block text-sm font-medium mb-1">
                ニックネーム <span className="text-xs text-gray-500">(バナーに表示されます)</span>
              </label>
              <input
                type="text"
                id="nickname"
                {...methods.register('nickname')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="例: はなちゃん"
                maxLength={30}
              />
              {errors.nickname && (
                <p className="text-accent-nut-red text-sm mt-1">{errors.nickname.message}</p>
              )}
            </div>

            {/* メールアドレス */}
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                メールアドレス <span className="text-accent-nut-red">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={session?.user?.email || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-gray-100 dark:bg-gray-700"
              />
              <p className="text-gray-500 text-xs mt-1">メールアドレスは変更できません</p>
            </div>

            {/* 学籍番号 */}
            <div className="form-group">
              <label htmlFor="studentId" className="block text-sm font-medium mb-1">
                学籍番号 <span className="text-accent-nut-red">*</span>
                {!isAdmin && (
                  <span className="ml-2 text-xs text-gray-500">(一部自動設定)</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="studentId"
                  {...methods.register('studentId')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                />
                {!isAdmin && !isEditing && (
                  <div className="absolute text-xs text-gray-500 right-3 top-2.5">
                    大学コードを追加してください
                  </div>
                )}
              </div>
              {errors.studentId && (
                <p className="text-accent-nut-red text-sm mt-1">{errors.studentId.message}</p>
              )}
              {!isAdmin && (
                <p className="text-gray-500 text-xs mt-1">学籍番号はメールから取得した基本番号({getBaseStudentIdFromEmail(session?.user?.email)})に<span className="font-bold">個人の大学コード（2桁）を追加</span>してください。例: {getBaseStudentIdFromEmail(session?.user?.email)}86</p>
              )}
            </div>

            {/* 生年月日 */}
            <div className="form-group">
              <label htmlFor="birthDate" className="block text-sm font-medium mb-1">
                生年月日 <span className="text-accent-nut-red">*</span>
              </label>
              <input
                type="date"
                id="birthDate"
                {...methods.register('birthDate')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              />
              {starSign && <p className="text-sm text-gray-500 mt-1">星座: {starSign}</p>}
              {errors.birthDate && (
                <p className="text-accent-nut-red text-sm mt-1">{errors.birthDate.message}</p>
              )}
            </div>

            {/* 学年 */}
            <div className="form-group">
              <label htmlFor="year" className="block text-sm font-medium mb-1">
                学年 <span className="text-accent-nut-red">*</span>
              </label>
              <select
                id="year"
                {...methods.register('year')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              >
                <option value="">選択してください</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="B3">B3</option>
                <option value="B4">B4</option>
              </select>
              {errors.year && <p className="text-accent-nut-red text-sm mt-1">{errors.year.message}</p>}
            </div>
          </div>
        );

      case FormStep.Origin:
        return (
          <div className="space-y-6" key="origin-step">
            <h3 className="text-xl font-bold">出身</h3>

            {/* 出身地 */}
            <div className="form-group">
              <label htmlFor="hometown" className="block text-sm font-medium mb-1">
                出身地 <span className="text-accent-nut-red">*</span>
              </label>
              <input
                type="text"
                id="hometown"
                {...methods.register('hometown')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="例: 東京都千代田区"
              />
              {errors.hometown && (
                <p className="text-accent-nut-red text-sm mt-1">{errors.hometown.message}</p>
              )}
            </div>

            {/* 出身高校/高専 */}
            <div className="form-group">
              <label htmlFor="almaMater" className="block text-sm font-medium mb-1">
                出身高校/高専 <span className="text-accent-nut-red">*</span>
              </label>
              <input
                type="text"
                id="almaMater"
                {...methods.register('almaMater')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              />
              {errors.almaMater && (
                <p className="text-accent-nut-red text-sm mt-1">{errors.almaMater.message}</p>
              )}
            </div>

            {/* 高専学科（任意） */}
            <div className="form-group">
              <label htmlFor="kosenDepartment" className="block text-sm font-medium mb-1">
                高専学科（高専出身の場合）
              </label>
              <input
                type="text"
                id="kosenDepartment"
                {...methods.register('kosenDepartment')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              />
            </div>

            {/* 卒研テーマ（任意） */}
            <div className="form-group">
              <label htmlFor="kosenThesis" className="block text-sm font-medium mb-1">
                卒研テーマ（高専出身の場合）
              </label>
              <textarea
                id="kosenThesis"
                {...methods.register('kosenThesis')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                rows={3}
              />
            </div>
          </div>
        );

      case FormStep.University:
        return (
          <div className="space-y-6" key="university-step">
            <h3 className="text-xl font-bold">大学での情報</h3>

            {/* 志望専門コース */}
            <div className="form-group">
              <label htmlFor="targetCourse" className="block text-sm font-medium mb-1">
                志望専門コース <span className="text-accent-nut-red">*</span>
              </label>
              <select
                id="targetCourse"
                {...methods.register('targetCourse')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              >
                <option value="" disabled>専門コースを選択してください</option>
                <optgroup label="電気電子情報工学分野">
                  <option value={Specialty.DENKI_ENERGY_CONTROL}>
                    {SpecialtyLabels[Specialty.DENKI_ENERGY_CONTROL]}
                  </option>
                  <option value={Specialty.DENSHI_DEVICE_OPTICAL}>
                    {SpecialtyLabels[Specialty.DENSHI_DEVICE_OPTICAL]}
                  </option>
                  <option value={Specialty.JOHO_COMMUNICATION}>
                    {SpecialtyLabels[Specialty.JOHO_COMMUNICATION]}
                  </option>
                </optgroup>
                <optgroup label="その他の分野">
                  <option value={Specialty.KIKAI_SYSTEM}>
                    {SpecialtyLabels[Specialty.KIKAI_SYSTEM]}
                  </option>
                  <option value={Specialty.BUSSHITSU_MATERIALS}>
                    {SpecialtyLabels[Specialty.BUSSHITSU_MATERIALS]}
                  </option>
                </optgroup>
              </select>
              {errors.targetCourse && (
                <p className="text-accent-nut-red text-sm mt-1">{errors.targetCourse.message}</p>
              )}
            </div>

            {/* 得意科目（任意） */}
            <div className="form-group">
              <label htmlFor="goodSubjects" className="block text-sm font-medium mb-1">
                得意科目
              </label>
              <input
                type="text"
                id="goodSubjects"
                {...methods.register('goodSubjects')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="例: 数学、電子回路"
              />
            </div>

            {/* サークル（任意） */}
            <div className="form-group">
              <label htmlFor="circle" className="block text-sm font-medium mb-1">
                サークル
              </label>
              <input
                type="text"
                id="circle"
                {...methods.register('circle')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              />
            </div>
            
            {/* 自己紹介キャプション（任意） - 最大100文字 */}
            <div className="form-group">
              <label htmlFor="caption" className="block text-sm font-medium mb-1">
                自己紹介キャプション <span className="text-xs text-gray-500">(最大100文字)</span>
              </label>
              <textarea
                id="caption"
                {...methods.register('caption')}
                maxLength={100}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="プロフィールページと一覧画面に表示される自己紹介メッセージを入力してください"
              />
              <div className="text-xs text-gray-500 mt-1">
                <span className="js-caption-length">{watch('caption')?.length || 0}</span>/100文字
              </div>
            </div>
          </div>
        );

      case FormStep.Personal:
        return (
          <div className="space-y-6" key="personal-step">
            <h3 className="text-xl font-bold">パーソナル</h3>

            {/* 血液型（任意） */}
            <div className="form-group">
              <label htmlFor="bloodType" className="block text-sm font-medium mb-1">
                血液型
              </label>
              <select
                id="bloodType"
                {...methods.register('bloodType')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              >
                <option value="">選択してください</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* MBTI（任意） */}
            <div className="form-group">
              <label htmlFor="mbti" className="block text-sm font-medium mb-1">
                MBTI
              </label>
              <input
                type="text"
                id="mbti"
                {...methods.register('mbti')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="例: INTJ"
              />
            </div>

            {/* 趣味（任意） */}
            <div className="form-group">
              <label htmlFor="hobby" className="block text-sm font-medium mb-1">
                趣味
              </label>
              <input
                type="text"
                id="hobby"
                {...methods.register('hobby')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              />
            </div>

            {/* 好き（任意） */}
            <div className="form-group">
              <label htmlFor="likes" className="block text-sm font-medium mb-1">
                好き
              </label>
              <input
                type="text"
                id="likes"
                {...methods.register('likes')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              />
            </div>

            {/* 嫌い（任意） */}
            <div className="form-group">
              <label htmlFor="dislikes" className="block text-sm font-medium mb-1">
                嫌い
              </label>
              <input
                type="text"
                id="dislikes"
                {...methods.register('dislikes')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
              />
            </div>

            {/* ソーシャル（任意） */}
            <div className="form-group">
              <label htmlFor="lineUrl" className="block text-sm font-medium mb-1">LINEアカウントURL</label>
              <input
                type="url"
                id="lineUrl"
                {...methods.register('lineUrl')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="https://line.me/…"
              />
            </div>
            <div className="form-group">
              <label htmlFor="instagramUrl" className="block text-sm font-medium mb-1">InstagramアカウントURL</label>
              <input
                type="url"
                id="instagramUrl"
                {...methods.register('instagramUrl')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="https://www.instagram.com/…"
              />
            </div>
            <div className="form-group">
              <label htmlFor="xUrl" className="block text-sm font-medium mb-1">XアカウントURL</label>
              <input
                type="url"
                id="xUrl"
                {...methods.register('xUrl')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                placeholder="https://twitter.com/…"
              />
            </div>
          </div>
        );

      case FormStep.Notes:
        return (
          <div className="space-y-6" key="notes-step">
            <h3 className="text-xl font-bold">その他</h3>

            {/* 備考（任意） */}
            <div className="form-group">
              <label htmlFor="etcNote" className="block text-sm font-medium mb-1">
                備考
              </label>
              <textarea
                id="etcNote"
                {...methods.register('etcNote')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-800"
                rows={5}
                placeholder="その他、共有したい情報があれば入力してください"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ステップを表示するタブを生成
  const renderStepTabs = () => {
    const steps = [
      { step: FormStep.BasicInfo, label: '基本情報' },
      { step: FormStep.Origin, label: '出身' },
      { step: FormStep.University, label: '大学情報' },
      { step: FormStep.Personal, label: 'パーソナル' },
      { step: FormStep.Notes, label: 'その他' },
    ];

    return (
      <div className="flex flex-wrap mb-6 border-b border-gray-200 dark:border-gray-700">
        {steps.map(({ step, label }) => (
          <button
            key={step}
            type="button"
            onClick={() => goToStep(step)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentStep === step
                ? 'border-b-2 border-primary-nut-blue text-primary-nut-blue dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
        {renderStepTabs()}

        <div className="card mb-6">
          {renderFormStep()}
        </div>

        <div className="flex justify-between">
          <div>
            {currentStep > FormStep.BasicInfo && (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex items-center gap-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-nut-blue dark:hover:text-blue-400 transition-colors"
                disabled={isSubmitting}
              >
                <ChevronLeft size={16} />
                <span>前へ</span>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {currentStep < FormStep.Notes ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="btn-primary"
                disabled={isSubmitting}
              >
                <span>次へ</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                <Save size={16} />
                <span>{isEditing ? '更新' : '保存'}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
