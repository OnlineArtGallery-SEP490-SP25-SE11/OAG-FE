'use client';

import { useState } from 'react';
import {
	ArrowLeft,
	Building2,
	CheckCircle2,
	CreditCard,
	DollarSign,
	Loader2,
	Wallet
} from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const depositMethods = [
	{
		id: 'bank',
		name: 'Bank Transfer',
		description: 'Direct transfer from your bank account',
		icon: Building2,
		color: 'text-blue-500'
	},
	{
		id: 'card',
		name: 'Credit Card',
		description: 'Instant deposit using credit/debit card',
		icon: CreditCard,
		color: 'text-purple-500'
	},
	{
		id: 'ewallet',
		name: 'E-Wallet',
		description: 'Transfer from another e-wallet',
		icon: Wallet,
		color: 'text-green-500'
	}
];

const transactionHistory = [
	{
		id: 1,
		amount: 1000000,
		method: 'Bank Transfer',
		date: '2025-01-01',
		status: 'Completed'
	},
	{
		id: 2,
		amount: 500000,
		method: 'Credit Card',
		date: '2025-01-15',
		status: 'Completed'
	},
	{
		id: 3,
		amount: 2000000,
		method: 'E-Wallet',
		date: '2025-02-01',
		status: 'Completed'
	}
];

export default function DepositPage() {
	const [amount, setAmount] = useState('');
	const [method, setMethod] = useState('bank');
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setShowConfirm(true);
	};

	const handleConfirm = async () => {
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setLoading(false);
		setShowConfirm(false);
		toast({
			title: 'Deposit Successful',
			description: `${Number(
				amount
			).toLocaleString()} VND has been added to your wallet.`,
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
			<header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
				<div className='container max-w-screen-xl mx-auto py-4'>
					<div className='flex items-center gap-4'>
						<Button variant='ghost' size='icon' asChild>
							<Link href='/wallet'>
								<ArrowLeft className='h-5 w-5' />
								<span className='sr-only'>Back</span>
							</Link>
						</Button>
						{/*<h1 className='text-xl font-semibold'>Deposit Funds</h1>*/}
						<h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
							Deposit Funds
						</h1>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='container max-w-screen-xl mx-auto py-8 px-4'>
				<div className='grid gap-8 lg:grid-cols-[2fr,1fr]'>
					{/* Left Column - Deposit Form */}
					<div className='space-y-8'>
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<form onSubmit={handleSubmit}>
								<Card className='border-primary/20'>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<DollarSign className='h-6 w-6 text-green-500' />
											Deposit Amount
										</CardTitle>
										<CardDescription>
											Choose how much you want to deposit
											and select your preferred payment
											method
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-6'>
										<div className='space-y-2'>
											<Label htmlFor='amount'>
												Amount (VND)
											</Label>
											<div className='relative'>
												<Input
													id='amount'
													placeholder='Enter amount'
													type='number'
													value={amount}
													onChange={(e) =>
														setAmount(
															e.target.value
														)
													}
													className='h-12 text-lg pl-12'
													required
												/>
												<span className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground'>
													₫
												</span>
											</div>
										</div>

										<div className='space-y-4'>
											<Label>Select Deposit Method</Label>
											<RadioGroup
												defaultValue='bank'
												value={method}
												onValueChange={setMethod}
												className='grid gap-4 md:grid-cols-3'
											>
												{depositMethods.map((dm) => {
													const Icon = dm.icon;
													return (
														<motion.div
															key={dm.id}
															whileHover={{
																scale: 1.02
															}}
															whileTap={{
																scale: 0.98
															}}
														>
															<Label
																htmlFor={dm.id}
																className='flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary'
															>
																<RadioGroupItem
																	value={
																		dm.id
																	}
																	id={dm.id}
																	className='sr-only'
																/>
																<Icon
																	className={cn(
																		'h-8 w-8 mb-2',
																		dm.color
																	)}
																/>
																<h3 className='font-medium'>
																	{dm.name}
																</h3>
																<p className='text-center text-sm text-muted-foreground mt-1'>
																	{
																		dm.description
																	}
																</p>
															</Label>
														</motion.div>
													);
												})}
											</RadioGroup>
										</div>
									</CardContent>
									<CardFooter>
										<Button
											type='submit'
											size='lg'
											className='w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-opacity'
											disabled={!amount}
										>
											Continue to Deposit
										</Button>
									</CardFooter>
								</Card>
							</form>
						</motion.div>

						{/* Transaction History */}
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center gap-2'>
										<CheckCircle2 className='h-6 w-6 text-blue-500' />
										Recent Transactions
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='rounded-lg border'>
										<div className='overflow-x-auto'>
											<table className='w-full'>
												<thead>
													<tr className='border-b bg-muted/50'>
														<th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
															Date
														</th>
														<th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
															Method
														</th>
														<th className='h-12 px-4 text-right align-middle font-medium text-muted-foreground'>
															Amount
														</th>
														<th className='h-12 px-4 text-right align-middle font-medium text-muted-foreground'>
															Status
														</th>
													</tr>
												</thead>
												<tbody>
													{transactionHistory.map(
														(tx, idx) => (
															<motion.tr
																key={tx.id}
																initial={{
																	opacity: 0,
																	y: 10
																}}
																animate={{
																	opacity: 1,
																	y: 0
																}}
																transition={{
																	delay:
																		0.1 *
																		idx
																}}
																className='border-b transition-colors hover:bg-muted/50'
															>
																<td className='p-4 align-middle'>
																	{tx.date}
																</td>
																<td className='p-4 align-middle'>
																	{tx.method}
																</td>
																<td className='p-4 align-middle text-right'>
																	{Number(
																		tx.amount
																	).toLocaleString()}{' '}
																	₫
																</td>
																<td className='p-4 align-middle text-right'>
																	<Badge
																		variant='outline'
																		className='bg-green-500/10 text-green-500 hover:bg-green-500/20'
																	>
																		{
																			tx.status
																		}
																	</Badge>
																</td>
															</motion.tr>
														)
													)}
												</tbody>
											</table>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Right Column - Tips & Info */}
					<motion.div
						initial={{ x: 20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						<Card className='border-primary/20 sticky top-24'>
							<CardHeader>
								<CardTitle>Deposit Information</CardTitle>
								<CardDescription>
									Important tips and guidelines
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='space-y-4'>
									<h3 className='font-medium'>
										Processing Times
									</h3>
									<div className='grid gap-2 text-sm'>
										<div className='flex items-center justify-between'>
											<span className='text-muted-foreground'>
												Bank Transfer
											</span>
											<span>5-30 minutes</span>
										</div>
										<div className='flex items-center justify-between'>
											<span className='text-muted-foreground'>
												Credit Card
											</span>
											<span>Instant</span>
										</div>
										<div className='flex items-center justify-between'>
											<span className='text-muted-foreground'>
												E-Wallet
											</span>
											<span>Instant</span>
										</div>
									</div>
								</div>

								<div className='space-y-4'>
									<h3 className='font-medium'>
										Deposit Tips
									</h3>
									<ul className='space-y-2 text-sm text-muted-foreground'>
										<li className='flex items-start gap-2'>
											• Keep your account details
											up-to-date for smooth transactions
										</li>
										<li className='flex items-start gap-2'>
											• Double-check the deposit amount
											before confirming
										</li>
										<li className='flex items-start gap-2'>
											• Be aware of any potential fees
											from your payment provider
										</li>
										<li className='flex items-start gap-2'>
											• Contact support if you encounter
											any issues
										</li>
									</ul>
								</div>

								<div className='rounded-lg bg-blue-500/10 p-4 text-sm'>
									<p className='text-blue-500'>
										Need help with your deposit?
									</p>
									<p className='mt-1 text-muted-foreground'>
										Our support team is available 24/7 to
										assist you with any questions.
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</main>

			{/* Confirmation Dialog */}
			<AnimatePresence>
				{showConfirm && (
					<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
						<DialogContent className='sm:max-w-[425px]'>
							<motion.div
								initial={{ scale: 0.95 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0.95 }}
								transition={{ type: 'spring', stiffness: 300 }}
							>
								<DialogHeader>
									<DialogTitle>Confirm Deposit</DialogTitle>
									<DialogDescription>
										Please verify your deposit details
									</DialogDescription>
								</DialogHeader>

								<div className='grid gap-4 py-4'>
									<div className='grid grid-cols-2 gap-4 text-sm'>
										<div className='text-muted-foreground font-medium'>
											Amount:
										</div>
										<div className='font-semibold text-green-500'>
											{Number(amount).toLocaleString()}{' '}
											VND
										</div>
										<div className='text-muted-foreground font-medium'>
											Method:
										</div>
										<div className='font-semibold'>
											{
												depositMethods.find(
													(dm) => dm.id === method
												)?.name
											}
										</div>
									</div>
								</div>

								<DialogFooter className='gap-2'>
									<Button
										variant='outline'
										onClick={() => setShowConfirm(false)}
										className='flex-1'
									>
										Cancel
									</Button>
									<Button
										onClick={handleConfirm}
										disabled={loading}
										className='flex-1 bg-green-600 hover:bg-green-700'
									>
										{loading ? (
											<Loader2 className='h-5 w-5 animate-spin' />
										) : (
											'Confirm Deposit'
										)}
									</Button>
								</DialogFooter>
							</motion.div>
						</DialogContent>
					</Dialog>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
