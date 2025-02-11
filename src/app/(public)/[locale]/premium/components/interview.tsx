import { FeatureComparison } from "./feature-comparison";
import { PaymentMethods } from "./payment-methods";



export default function Interview() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-[hsl(350,100%,88%)] px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-4">
            40.000 đ cho cho các trải nghiệm nghệ thuật không giới hạn
          </h1>
          <p className="text-black/80 mb-8">
            Tận hưởng trải nghiệm chất lượng hình ảnh cao nhất, xem tranh không giới hạn và nhiều lợi ích khác. Hủy bất cứ lúc nào.
          </p>
          
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="py-16 px-4">
        <FeatureComparison />
      </div>

      {/* Payment Methods */}
      <div className="py-16 px-4 bg-gray-50">
        <PaymentMethods />
      </div>

      {/* Benefits Footer */}
      <footer className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-black mb-8">
            Lợi ích của tất cả các gói Premium
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 text-black/80">
            <li className="flex items-center space-x-2">
                <svg 
                    className="h-5 w-5 text-green-500 flex-shrink-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                    />
                </svg>
                <span>Số lượt xem phòng tranh 3D không giới hạn</span>
            </li>
            <li className="flex items-center space-x-2">
                <svg 
                    className="h-5 w-5 text-green-500 flex-shrink-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                    />
                </svg>
                <span>Chất lượng hình ảnh 4k ultra hd</span>
            </li>
            <li className="flex items-center space-x-2">
                <svg 
                    className="h-5 w-5 text-green-500 flex-shrink-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                    />
                </svg>
                <span>Số nghệ sỹ có thể follow không giới hạn</span>
            </li>
            <li className="flex items-center space-x-2">
                <svg 
                    className="h-5 w-5 text-green-500 flex-shrink-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                    />
                </svg>
                <span>Lưu tác phẩm yêu thích không giới hạn</span>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}