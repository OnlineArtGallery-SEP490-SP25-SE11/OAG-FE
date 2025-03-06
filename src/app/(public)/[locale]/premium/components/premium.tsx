'use client'
import { useRouter } from 'next/navigation';
import { createPayment } from '@/service/payment.service';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from "react";
import { useServerAction } from 'zsa-react';
import { createPaymentAction } from '../../payment/actions';

export default function SubscriptionOptions() {
  const router = useRouter();

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { execute: createPayment, isPending } = useServerAction(createPaymentAction);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      // Create payment
      const paymentUrl = await createPayment({ amount: 4000 });

      // Redirect to payment page
      const [paymentData, error] = paymentUrl;
      if (paymentData?.paymentUrl) {
       router.push(paymentData.paymentUrl);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to process payment');
      toast({
        title: 'Error',
        description: 'Failed to process payment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with animation */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Choose the Premium plan that&apos;s right for you
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience unlimited art with Premium.
            Enjoy the highest quality and exclusive features.
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
                40,000 VND
                <span className="text-sm text-gray-500 font-normal">/month</span>
              </div>

              <div className="space-y-4 mb-8">
                <FeatureItem text="Unlimited 3D gallery views" />
                <FeatureItem text="4K Ultra HD image quality" />
                <FeatureItem text="Follow unlimited artists" />
                <FeatureItem text="Save unlimited favorite artworks" />
                <FeatureItem text="Cancel anytime" />
              </div>

              <button
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold 
                hover:from-violet-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-purple-200">
                Buy Now
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
            Terms and conditions apply. Offer not available for users who have previously had Premium.
          </p>
          <p className="text-sm text-gray-500">
            * Price includes VAT. Secure payment through encrypted payment gateways.
          </p>
        </div>
      </div>
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
