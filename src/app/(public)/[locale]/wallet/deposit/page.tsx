'use client';

import { useToast } from '@/hooks/use-toast';
import { PaymentResponse } from '@/types/payment';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import paymentService from '../../payment/queries';

import { ConfirmationDialog } from '../components/deposit/confirmation_dialog';
import { DepositForm } from '../components/deposit/deposit_form';
import { DepositInfo } from '../components/deposit/deposit_info';
import { TransactionHistory } from '../components/deposit/transaction_history';
import { SectionHeader } from '../components/section_header';
import { depositMethods, presetAmounts } from './constants';

const pageVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 }
};

export default function DepositPage() {
	const [amount, setAmount] = useState('');
	const [method, setMethod] = useState('bank');
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	// Add pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 5; // Items per page
	const skip = (currentPage - 1) * pageSize;
	const take = pageSize;

	const handleDepositSubmit = (selectedAmount: string, selectedMethod: string) => {
		setAmount(selectedAmount);
		setMethod(selectedMethod);
		setShowConfirm(true);
	};

	const handleConfirm = async () => {
		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			toast({
				title: 'Payment Created',
				description: `Redirecting to payment gateway for ${Number(amount).toLocaleString()} VND deposit.`,
				className: 'bg-blue-600 text-white'
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create payment. Please try again.',
				variant: 'destructive'
			});
		} finally {
			setLoading(false);
			setShowConfirm(false);
		}
	};

	const { data, error, isLoading } = useQuery<PaymentResponse>({
		queryKey: ['payment', skip, take],
		queryFn: () => paymentService.get(skip, take),
		staleTime: 30000, // Keep data fresh for 30 seconds
	});

	return (
		<motion.div
			variants={pageVariants}
			initial='initial'
			animate='animate'
			exit='exit'
			className='min-h-screen bg-gradient-to-b from-background to-muted/20'
		>
			<SectionHeader title="Deposit Funds" />

			{/* Main Content */}
			<main className='container max-w-screen-xl mx-auto py-8 px-4'>
				<div className='grid gap-8 lg:grid-cols-[2fr,1fr]'>
					{/* Left Column - Deposit Form */}
					<div className='space-y-8'>
						<DepositForm
							depositMethods={depositMethods}
							presetAmounts={presetAmounts}
							onSubmit={handleDepositSubmit}
						/>

						{/* Transaction History */}
						<TransactionHistory
							transactions={data?.data.payment}
							totalItems={data?.data.total || 0}
							isLoading={isLoading}
							onPageChange={(page) => setCurrentPage(page)}
							pageSize={pageSize}
						/>
					</div>

					{/* Right Column - Tips & Info */}
					<DepositInfo />
				</div>
			</main>

			{/* Confirmation Dialog */}
			<ConfirmationDialog
				open={showConfirm}
				onOpenChange={setShowConfirm}
				amount={amount}
				method={method}
				depositMethods={depositMethods}
				loading={loading}
				onConfirm={handleConfirm}
			/>
		</motion.div>
	);
}