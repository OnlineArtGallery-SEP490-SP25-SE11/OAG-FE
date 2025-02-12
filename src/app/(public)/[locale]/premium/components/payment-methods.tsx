import Image from "next/image";

export const PaymentMethods = () => {
  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-black mb-4">
        Affordable plans for every situation
      </h2>
      <p className="text-black/80 mb-8 max-w-2xl mx-auto">
        Choose a Premium plan to experience unlimited art. Pay as you need. Cancel anytime.
      </p>
      
      <div className="flex items-center justify-center gap-4">
        <Image 
          src="https://res.cloudinary.com/djvlldzih/image/upload/v1739295868/gallery/svg/visa.png" 
          alt="Visa"
          width={40}
          height={25}
          className="h-8 w-auto"
        />
        <Image 
          src="https://res.cloudinary.com/djvlldzih/image/upload/v1739295869/gallery/svg/paypal.png"
          alt="PayPal"
          width={40} 
          height={25}
          className="h-8 w-auto"
        />
        <Image
          src="https://res.cloudinary.com/djvlldzih/image/upload/v1739295868/gallery/svg/momo.png"
          alt="MoMo"
          width={40}
          height={25} 
          className="h-8 w-auto"
        />
      </div>
    </div>
  );
};