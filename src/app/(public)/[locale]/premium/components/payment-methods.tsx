import Image from "next/image";

export const PaymentMethods = () => {
  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-black mb-4">
        Gói hợp túi tiền cho mọi hoàn cảnh
      </h2>
      <p className="text-black/80 mb-8 max-w-2xl mx-auto">
        Chọn một gói Premium để trải nghiệm nghệ thuật không giới hạn. Thanh toán theo nhu cầu. Hủy bất cứ lúc nào.
      </p>
      
      <div className="flex items-center justify-center gap-4">
        <Image 
          src="/images/visa.svg" 
          alt="Visa"
          width={40}
          height={25}
          className="h-8 w-auto"
        />
        <Image 
          src="/images/PayPal_Logo_Icon_2014.svg"
          alt="PayPal"
          width={40} 
          height={25}
          className="h-8 w-auto"
        />
        <Image
          src="/images/Logo-MoMo-Circle.webp"
          alt="MoMo"
          width={40}
          height={25} 
          className="h-8 w-auto"
        />
      </div>
    </div>
  );
};