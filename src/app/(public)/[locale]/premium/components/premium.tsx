'use client'
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserBalance, buyPremium, checkPremium, cancelPremium } from '@/service/premium';
import { useSession } from 'next-auth/react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertCircle, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SubscriptionOptions() {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState('');

  // Lấy số dư ví của người dùng
  const { data: balanceData } = useQuery({
    queryKey: ['userBalance'],
    queryFn: () => getUserBalance(session?.user.accessToken as string),
    enabled: !!session?.user.accessToken
  });

  // Kiểm tra xem người dùng đã là Premium chưa
  const { data: premiumStatus } = useQuery({
    queryKey: ['isPremium'],
    queryFn: () => checkPremium(session?.user.accessToken as string),
    enabled: !!session?.user.accessToken
  });

  const userBalance = balanceData?.data?.balance || 0;
  const isPremium = premiumStatus?.data?.isPremium || false;

  // Mutation để mua gói Premium
  const purchaseMutation = useMutation({
    mutationFn: () => buyPremium(session?.user.accessToken as string),
    onSuccess: (response) => {
      if (response.status === 200) {
        setShowBuyConfirm(false);
        setShowSuccess(true);

        // Thay đổi toast hiển thị để giống với giao diện (màu đỏ và nội dung tiếng Anh)
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Premium subscription activated successfully'
        });

        // Cập nhật lại thông tin số dư và trạng thái Premium
        queryClient.invalidateQueries({ queryKey: ['userBalance'] });
        queryClient.invalidateQueries({ queryKey: ['isPremium'] });

        // Tự động reload lại trang sau 1 giây
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        if (response.message?.includes('không đủ')) {
          toast({
            title: t('wallet.insufficient_balance'),
            description: t('premium.subscription.insufficient_balance'),
            variant: 'destructive'
          });
          router.push('/wallet/deposit');
        } else {
          toast({
            title: t('common.error'),
            description: response.message || t('error.somethingWentWrong'),
            variant: 'destructive'
          });
        }
      }
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: t('common.error'),
        description: error.message || t('error.somethingWentWrong'),
        variant: 'destructive'
      });
    }
  });

  // Mutation để hủy gói Premium
  const cancelMutation = useMutation({
    mutationFn: () => cancelPremium(session?.user.accessToken as string),
    onSuccess: (response) => {
      if (response.status === 200) {
        setShowCancelConfirm(false);
        toast({
          variant: 'success',
          title: t('common.success'),
          description: t('premium.subscription.cancel_success', { defaultMessage: 'Bạn đã hủy gia hạn gói Premium thành công! Bạn vẫn có thể sử dụng các tính năng Premium cho đến hết thời hạn.' })
        });

        // Cập nhật lại trạng thái Premium
        queryClient.invalidateQueries({ queryKey: ['isPremium'] });

        // Tự động reload lại trang sau 1 giây
        setTimeout(() => {
          router.push('/premium');
        }, 1000);
      } else {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: response.message || t('premium.subscription.cancel_error', { defaultMessage: 'Không thể hủy gói Premium' })
        });
      }
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: t('common.error'),
        description: error.message || t('premium.subscription.cancel_error', { defaultMessage: 'Không thể hủy gói Premium' }),
        variant: 'destructive'
      });
    }
  });

  const handleSubscribe = () => {
    if (!session) {
      toast({
        title: t('auth.loginTitle'),
        description: t('premium.subscription.login_required', { defaultMessage: 'Bạn cần đăng nhập để mua gói Premium' }),
        variant: 'destructive'
      });
      router.push('/auth/login');
      return;
    }

    if (isPremium) {
      // Hiển thị dialog xác nhận hủy Premium thay vì thông báo
      setShowCancelConfirm(true);
      return;
    }

    setShowBuyConfirm(true);
  };

  const confirmBuy = () => {
    if (45000 > userBalance) {
      toast({
        title: t('wallet.insufficient_balance'),
        description: t('premium.subscription.insufficient_balance', { defaultMessage: 'Số dư ví của bạn không đủ để mua gói Premium' }),
        variant: 'destructive'
      });
      setShowBuyConfirm(false);
      router.push('/wallet/deposit');
      return;
    }

    purchaseMutation.mutate();
  };

  const confirmCancel = () => {
    cancelMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with animation */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {t('premium.subscription.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('premium.subscription.subtitle')}
          </p>
        </div>

        {/* Plans Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Empty column for centering */}
          <div className="hidden md:block"></div>

          {/* Premium Plan */}
          <div className="relative group transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-300 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100">
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
                  Premium
                </span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">Premium</h3>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                45,000 VND
                <span className="text-sm text-gray-500 font-normal">/tháng</span>
              </div>

              {userBalance !== null && !isPremium && (
                <div className="mb-4 text-sm">
                  {userBalance < 45000 && (
                    <p className="text-red-500 text-xs mt-1">{t('wallet.insufficient_balance')}</p>
                  )}
                </div>
              )}

              <div className="space-y-4 mb-8">
                <FeatureItem text={t('premium.subscription.plan.features.gallery')} />
                <FeatureItem text={t('premium.subscription.plan.features.quality')} />
                <FeatureItem text={t('premium.subscription.plan.features.follows')} />
                <FeatureItem text={t('premium.subscription.plan.features.favorites')} />
                <FeatureItem text={t('premium.subscription.plan.features.cancel')} />
              </div>

              <button
                onClick={handleSubscribe}
                disabled={purchaseMutation.isPending || cancelMutation.isPending || (!isPremium && userBalance !== null && userBalance < 45000)}
                className={`w-full py-4 px-6 rounded-xl font-semibold transform hover:-translate-y-1 transition-all duration-300 shadow-lg 
                ${isPremium
                    ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-red-200'
                    : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 hover:shadow-purple-200'
                  }
                disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isPremium
                  ? (cancelMutation.isPending ? t('common.processing') : t('premium.subscription.cancel_subscription', { defaultMessage: 'Hủy gia hạn' }))
                  : (purchaseMutation.isPending ? t('common.processing') : t('premium.subscription.plan.cta'))
                }
              </button>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
          </div>

          {/* Empty column for centering */}
          <div className="hidden md:block"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-gray-600">
            {t('premium.subscription.footer.terms')}
          </p>
          <p className="text-sm text-gray-500">
            {t('premium.subscription.footer.vat')}
          </p>
        </div>
      </div>

      {/* Dialog xác nhận mua */}
      <AlertDialog open={showBuyConfirm} onOpenChange={setShowBuyConfirm}>
        <AlertDialogContent className="bg-white border text-black">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('premium.subscription.confirm_purchase', { defaultMessage: 'Xác nhận đăng ký Premium' })}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-800">
              <div className="space-y-4 my-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-1">{t('premium.subscription.plan_title', { defaultMessage: 'Gói Premium' })}</h3>
                  <p className="text-sm text-gray-700">{t('premium.subscription.duration', { defaultMessage: 'Thời hạn: 1 tháng' })}</p>
                  <p className="text-xl font-bold mt-2">45,000 VND</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>{t('wallet.current_balance')}:</span>
                    <span className="font-medium">{userBalance?.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>{t('wallet.after_purchase')}:</span>
                    <span className={`font-medium ${userBalance < 45000 ? 'text-red-600' : ''}`}>
                      {(userBalance - 45000)?.toLocaleString()} VND
                    </span>
                  </div>

                  {userBalance < 45000 && (
                    <div className="mt-2 flex items-start gap-2 text-red-600 bg-red-50 p-2 rounded">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{t('wallet.insufficient_balance')}</p>
                    </div>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-0">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBuy}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={userBalance < 45000 || purchaseMutation.isPending}
            >
              {purchaseMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('common.processing')}
                </>
              ) : (
                t('premium.subscription.confirm_buy', { defaultMessage: 'Xác nhận mua' })
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog xác nhận hủy Premium */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="bg-white border text-black">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('premium.subscription.confirm_cancel', { defaultMessage: 'Xác nhận hủy gia hạn Premium' })}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-800">
              <div className="space-y-4 my-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-700">{t('premium.subscription.confirm_cancel_description', { defaultMessage: 'Bạn có chắc chắn muốn hủy gia hạn gói Premium không?' })}</p>
                  <p className="text-sm text-gray-700 mt-2">{t('premium.subscription.note', { defaultMessage: 'Lưu ý:' })}</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700 mt-1">
                    <li>{t('premium.subscription.note_item1', { defaultMessage: 'Bạn vẫn sẽ là người dùng Premium và có thể sử dụng đầy đủ tính năng Premium cho đến khi hết hạn' })}</li>
                    <li>{t('premium.subscription.note_item2', { defaultMessage: 'Bạn sẽ không được hoàn tiền cho thời gian còn lại' })}</li>
                    <li>{t('premium.subscription.note_item3', { defaultMessage: 'Sau khi hết hạn, bạn sẽ tự động trở về gói miễn phí' })}</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-0">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('common.processing')}
                </>
              ) : (
                t('premium.subscription.confirm_cancel_button', { defaultMessage: 'Xác nhận hủy gia hạn' })
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog thông báo thành công */}
      <AlertDialog open={showSuccess} onOpenChange={(open) => {
        setShowSuccess(open);
        if (!open) {
          // Reload lại trang khi đóng dialog thành công
          window.location.reload();
        }
      }}>
        <AlertDialogContent className="bg-white border text-black">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('premium.subscription.success_title', { defaultMessage: 'Đăng ký Premium thành công' })}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-800">
              <div className="text-center my-4 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <p>{t('premium.subscription.success_description1', { defaultMessage: 'Cảm ơn bạn đã đăng ký gói Premium!' })}</p>
                <p className="text-sm">{t('premium.subscription.success_description2', { defaultMessage: 'Bây giờ bạn có thể trải nghiệm đầy đủ tính năng của trang web.' })}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogAction
              onClick={() => {
                setShowSuccess(false);
                router.push('/premium');
              }}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {t('common.close')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Helper component for feature items
function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center space-x-3">
      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}
