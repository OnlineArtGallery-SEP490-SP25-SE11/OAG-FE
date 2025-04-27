import { checkPremium as checkPremiumAPI } from '@/service/premium';

export type PremiumStatus = 'active' | 'cancelled' | 'expired';

export interface PremiumCheckResult {
  isPremium: boolean;
  status: PremiumStatus;
  endDate?: string;
  message?: string;
}

/**
 * Kiểm tra trạng thái premium của người dùng
 * @param accessToken - Access token của người dùng
 * @returns Promise<PremiumCheckResult>
 */
export async function checkPremium(accessToken: string): Promise<PremiumCheckResult> {
  try {
    const response = await checkPremiumAPI(accessToken);
    if (!response.data) {
      throw new Error('Không có dữ liệu trả về');
    }
    const { premiumStatus, endDate, message } = response.data;
    
    // Xử lý các trạng thái cụ thể
    switch (premiumStatus) {
      case 'active':
        return {
          isPremium: true,
          status: premiumStatus,
          endDate,
          message: message || 'Gói Premium đang hoạt động'
        };
      case 'cancelled':
        return {
          isPremium: true, // Vẫn giữ quyền Premium cho đến khi hết hạn
          status: premiumStatus,
          endDate,
          message: message || 'Gói Premium sẽ hết hạn vào ' + new Date(endDate || '').toLocaleDateString('vi-VN')
        };
      case 'expired':
        return {
          isPremium: false, // Chỉ set false khi đã hết hạn
          status: premiumStatus,
          message: message || 'Gói Premium đã hết hạn'
        };
      default:
        return {
          isPremium: false,
          status: 'expired',
          message: 'Trạng thái không hợp lệ'
        };
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái Premium:', error);
    return {
      isPremium: false,
      status: 'expired',
      message: 'Không thể kiểm tra trạng thái Premium'
    };
  }
} 