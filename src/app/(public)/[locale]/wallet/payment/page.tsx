'use client';

import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { BalanceInfoCard } from '../components/payment/balance_info_card';
import { ConfirmationDialog } from '../components/payment/confirmation_dialog';
import { WithdrawalForm } from '../components/payment/withdrawal_form';
import { SectionHeader } from '../components/section_header';

export default function WithdrawalPage() {
	const [amount, setAmount] = useState('');
	const [selectedBank, setSelectedBank] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const currentBalance = 1234567;

	const handleSubmit = async (data: { bank: string; accountNumber: string; amount: string }) => {
		setSelectedBank(data.bank);
		setAccountNumber(data.accountNumber);
		setAmount(data.amount);
		setShowConfirm(true);
	};

	const handleConfirm = async () => {
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setLoading(false);
		setShowConfirm(false);

		toast({
			title: 'Withdrawal Initiated',
			description: `${Number(amount).toLocaleString()} VND will be transferred to your bank account.`,
			className: 'bg-green-600 text-white'
		});
	};

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
			<SectionHeader title="Withdraw Funds" />

			{/* Main Content */}
			<main className='container max-w-screen-xl mx-auto py-8 px-4'>
				<div className='grid gap-8 md:grid-cols-[2fr,1fr]'>
					{/* Left Column - Withdrawal Form */}
					<motion.div
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<WithdrawalForm
							currentBalance={currentBalance}
							onSubmit={handleSubmit}
						/>
					</motion.div>

					{/* Right Column - Balance & Info */}
					<motion.div
						initial={{ x: 20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<BalanceInfoCard
							currentBalance={currentBalance}
							withdrawalAmount={amount}
						/>
					</motion.div>
				</div>
			</main>

			{/* Confirmation Dialog */}
			<ConfirmationDialog
				open={showConfirm}
				onOpenChange={setShowConfirm}
				amount={amount}
				selectedBank={selectedBank}
				accountNumber={accountNumber}
				currentBalance={currentBalance}
				onConfirm={handleConfirm}
				loading={loading}
			/>
		</div>
	);
}
