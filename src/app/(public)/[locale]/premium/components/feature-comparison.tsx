'use client';

import { Check } from 'lucide-react';

interface Feature {
  name: string;
  freeSupported: string | boolean;
  premiumSupported: string | boolean;
}

const features: Feature[] = [
  {
    name: 'Số lượt xem phòng tranh 3D',
    freeSupported: '5 lượt/ngày',
    premiumSupported: 'Không giới hạn'
  },
  {
    name: 'Chất lượng hình ảnh',
    freeSupported: 'HD (1080p)',
    premiumSupported: '4K Ultra HD'
  },
  
  {
    name: 'số nghệ sỹ có thể follow',
    freeSupported: '10 nghệ sỹ',
    premiumSupported: 'Không giới hạn'
  },
 
  {
    name: 'Lưu tác phẩm yêu thích',
    freeSupported: '3 tác phẩm',
    premiumSupported: 'Không giới hạn'
  }
];

export const FeatureComparison = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
        So sánh tính năng các gói
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Trải nghiệm nghệ thuật không giới hạn với gói Premium
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* Header */}
        <div className="col-span-1" />
        <div className="text-center font-medium text-gray-900 pb-4 border-b">
          Gói Free
        </div>
        <div className="text-center font-medium text-gray-900 pb-4 border-b">
          Gói Premium
        </div>

        {/* Features */}
        {features.map((feature, index) => (
          <div key={index} className="contents">
            <div className="py-4 text-gray-700 border-b">{feature.name}</div>
            <div className="flex justify-center items-center py-4 text-sm text-gray-600 border-b">
              {typeof feature.freeSupported === 'boolean' ? (
                feature.freeSupported ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-red-500">✕</span>
                )
              ) : (
                feature.freeSupported
              )}
            </div>
            <div className="flex justify-center items-center py-4 text-sm text-gray-600 border-b">
              {typeof feature.premiumSupported === 'boolean' ? (
                feature.premiumSupported ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-red-500">✕</span>
                )
              ) : (
                <span className="font-medium text-indigo-600">
                  {feature.premiumSupported}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};