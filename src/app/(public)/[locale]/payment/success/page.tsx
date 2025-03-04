'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { verifyPayment } from '@/service/payment.service';
import { useToast } from '@/hooks/use-toast';
import { useServerAction } from 'zsa-react';
import { verifyPaymentAction } from '../../payment/actions';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  // const code = searchParams.get('code');
  const id = searchParams.get('id');
  // const cancel = searchParams.get('cancel');
  // const status = searchParams.get('status');
  // const orderCode = searchParams.get('orderCode');
  const { toast } = useToast();
  const { execute: verifyPayment,  } = useServerAction(verifyPaymentAction);

  useEffect(() => {
    const paymentSuccess = async (paymentId: string) => {

      if (paymentId) {
        try {
          const result = await verifyPayment({ paymentId });
          if (result[0]?.paymentUrl) {
            toast({
              title: 'Success',
              description: 'Premium subscription activated successfully!',
              variant: 'success'
            });
            router.push('/');
          }
        } catch (error) {
          console.error('Verification error:', error);
          toast({
            title: 'Error',
            description: 'Failed to verify payment',
            variant: 'destructive'
          });
        }
      }
    };

    paymentSuccess(id!);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verifying your payment...</h1>
        <p className="text-gray-600 mt-2">Please wait while we activate your premium subscription.</p>
      </div>
    </div>
  );
}