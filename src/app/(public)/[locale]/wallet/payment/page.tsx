'use client';

import { useState } from 'react';
import {
	ArrowLeft,
	Building2,
	Check,
	DollarSign,
	AlertCircle,
	ArrowRight,
	CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const bankOptions = [
	{ id: 'vcb', name: 'Vietcombank', color: 'bg-emerald-500' },
	{ id: 'mb', name: 'MB Bank', color: 'bg-purple-500' },
	{ id: 'tcb', name: 'Techcombank', color: 'bg-red-500' },
	{ id: 'tpb', name: 'TPBank', color: 'bg-violet-500' }
];

export default function WithdrawalPage() {
	const [amount, setAmount] = useState('');
	const [selectedBank, setSelectedBank] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const currentBalance = 1234567;
	const canWithdraw =
		Number(amount) <= currentBalance && selectedBank && accountNumber;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!canWithdraw) {
			toast({
				title: 'Unable to process withdrawal',
				description:
					'Please check your balance and fill in all required fields.',
				variant: 'destructive'
			});
			return;
		}
		setShowConfirm(true);
	};

	const handleConfirm = async () => {
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setLoading(false);
		setShowConfirm(false);
		toast({
			title: 'Withdrawal Initiated',
			description: `${Number(
				amount
			).toLocaleString()} VND will be transferred to your bank account.`,
			className: 'bg-green-600 text-white'
		});
	};

	const pageVariants = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 }
	};

	return (
		<motion.div
			variants={pageVariants}
			initial='initial'
			animate='animate'
			exit='exit'
			className='min-h-screen bg-gradient-to-b from-background to-muted/20'
		>
			{/* Header */}
			<header className='border-b'>
				<div className='container max-w-screen-xl mx-auto py-4'>
					<div className='flex items-center gap-4'>
						<Button variant='ghost' size='icon' asChild>
							<Link href='/wallet'>
								<ArrowLeft className='h-5 w-5' />
								<span className='sr-only'>Back</span>
							</Link>
						</Button>
						<h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
							Withdraw Funds
						</h1>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='container max-w-screen-xl mx-auto py-8'>
				<div className='grid gap-8 md:grid-cols-[2fr,1fr]'>
					{/* Left Column - Withdrawal Form */}
					<motion.div
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<form onSubmit={handleSubmit}>
							<Card className='border-primary/20'>
								<CardHeader>
									<CardTitle className='flex items-center gap-2'>
										<CreditCard className='h-6 w-6 text-blue-500' />
										Withdrawal Form
									</CardTitle>
									<CardDescription>
										Transfer money to your bank account
									</CardDescription>
								</CardHeader>

								<CardContent className='space-y-6'>
									<div className='space-y-4'>
										<div className='space-y-2'>
											<Label className='text-muted-foreground'>
												Select Bank
											</Label>
											<Select
												onValueChange={setSelectedBank}
												required
											>
												<SelectTrigger className='h-12'>
													<SelectValue placeholder='Choose your bank' />
												</SelectTrigger>
												<SelectContent>
													{bankOptions.map((bank) => (
														<SelectItem
															key={bank.id}
															value={bank.id}
															className='flex items-center gap-2'
														>
															<div
																className={cn(
																	'w-2 h-2 rounded-full',
																	bank.color
																)}
															/>
															{bank.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className='space-y-2'>
											<Label className='text-muted-foreground'>
												Account Number
											</Label>
											<Input
												placeholder='Enter your bank account number'
												value={accountNumber}
												onChange={(e) =>
													setAccountNumber(
														e.target.value
													)
												}
												className='h-12'
												required
											/>
										</div>

										<div className='space-y-2'>
											<Label className='text-muted-foreground'>
												Amount (VND)
											</Label>
											<Input
												placeholder='Enter amount to withdraw'
												type='number'
												value={amount}
												onChange={(e) =>
													setAmount(e.target.value)
												}
												className='h-12 text-lg'
												required
											/>
											<AnimatePresence>
												{Number(amount) >
													currentBalance && (
													<motion.p
														initial={{
															opacity: 0,
															height: 0
														}}
														animate={{
															opacity: 1,
															height: 'auto'
														}}
														exit={{
															opacity: 0,
															height: 0
														}}
														className='flex items-center gap-2 text-sm text-red-500'
													>
														<AlertCircle className='h-4 w-4' />
														Insufficient balance
													</motion.p>
												)}
											</AnimatePresence>
										</div>
									</div>
								</CardContent>

								<CardFooter>
									<Button
										type='submit'
										className='w-full h-12 text-lg bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity'
										disabled={!canWithdraw}
									>
										Continue to Withdraw
										<ArrowRight className='ml-2 h-5 w-5' />
									</Button>
								</CardFooter>
							</Card>
						</form>
					</motion.div>

					{/* Right Column - Balance & Info */}
					<motion.div
						initial={{ x: 20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
						className='space-y-6'
					>
						{/* Balance Card */}
						<Card className='border-primary/20'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<DollarSign className='h-6 w-6 text-green-500' />
									Available Balance
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-3xl font-bold text-green-500'>
									{currentBalance.toLocaleString()} VND
								</div>
							</CardContent>
						</Card>

						{/* Bank Info Card */}
						<Card className='border-primary/20'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Building2 className='h-6 w-6 text-blue-500' />
									Bank Information
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{amount && (
									<div className='space-y-2'>
										<div className='text-sm text-muted-foreground'>
											Remaining Balance After Withdrawal
										</div>
										<div className='text-2xl font-bold'>
											{Math.max(
												0,
												currentBalance - Number(amount)
											).toLocaleString()}{' '}
											VND
										</div>
									</div>
								)}
								<div className='text-sm text-muted-foreground'>
									• Processing time: 5-30 minutes
									<br />
									• Maximum daily limit: 500,000,000 VND
									<br />• No withdrawal fee
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</main>

			{/* Confirmation Dialog */}
			<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
				<DialogContent className='border-primary/20 sm:max-w-[425px]'>
					<motion.div
						initial={{ scale: 0.95 }}
						animate={{ scale: 1 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						<DialogHeader>
							<DialogTitle className='flex items-center gap-2 text-blue-500'>
								<CreditCard className='h-6 w-6' />
								Confirm Withdrawal
							</DialogTitle>
							<DialogDescription>
								Please verify your withdrawal details
							</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
							<div className='grid grid-cols-2 gap-4 text-sm'>
								<div className='text-muted-foreground font-medium'>
									Amount:
								</div>
								<div className='font-semibold text-blue-500'>
									{Number(amount).toLocaleString()} VND
								</div>

								<div className='text-muted-foreground font-medium'>
									Bank:
								</div>
								<div className='font-semibold'>
									{
										bankOptions.find(
											(b) => b.id === selectedBank
										)?.name
									}
								</div>

								<div className='text-muted-foreground font-medium'>
									Account:
								</div>
								<div className='font-semibold'>
									{accountNumber}
								</div>

								<div className='text-muted-foreground font-medium'>
									Remaining Balance:
								</div>
								<div className='font-semibold'>
									{Math.max(
										0,
										currentBalance - Number(amount)
									).toLocaleString()}{' '}
									VND
								</div>
							</div>
						</div>

						<DialogFooter className='gap-2'>
							<Button
								variant='outline'
								onClick={() => setShowConfirm(false)}
								className='flex-1 border-blue-500/20 hover:bg-blue-500/10'
							>
								Cancel
							</Button>
							<Button
								onClick={handleConfirm}
								disabled={loading}
								className='flex-1 bg-green-600 hover:bg-green-700 text-white'
							>
								{loading ? (
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: 'linear'
										}}
										className='h-5 w-5'
									>
										<Check className='h-5 w-5' />
									</motion.div>
								) : (
									'Confirm Withdrawal'
								)}
							</Button>
						</DialogFooter>
					</motion.div>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}
