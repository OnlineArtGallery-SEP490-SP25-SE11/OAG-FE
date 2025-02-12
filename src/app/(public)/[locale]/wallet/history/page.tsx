'use client';

import { useMemo, useState } from 'react';
import {
	ArrowLeft,
	Filter,
	Search,
	TrendingDown,
	TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import {
	AnimatePresence,
	motion,
	useScroll,
	useTransform
} from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const transactions = [
	{
		id: '1',
		type: 'deposit',
		amount: 500000,
		date: '2024-02-06T13:45:00',
		description: 'Bank Transfer Deposit',
		status: 'success',
		balance: 1500000
	},
	{
		id: '2',
		type: 'payment',
		amount: -200000,
		date: '2024-02-06T10:30:00',
		description: 'Service Payment',
		status: 'success',
		balance: 1300000
	},
	{
		id: '3',
		type: 'deposit',
		amount: 1000000,
		date: '2024-02-05T15:20:00',
		description: 'Credit Card Deposit',
		status: 'success',
		balance: 1500000
	},
	{
		id: '4',
		type: 'payment',
		amount: -150000,
		date: '2024-02-05T09:15:00',
		description: 'Monthly Subscription',
		status: 'success',
		balance: 500000
	},
	{
		id: '5',
		type: 'deposit',
		amount: 750000,
		date: '2024-02-04T14:30:00',
		description: 'E-Wallet Transfer',
		status: 'success',
		balance: 650000
	}
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2
		}
	}
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 120,
			damping: 14
		}
	},
	exit: {
		y: -20,
		opacity: 0,
		transition: {
			duration: 0.15
		}
	}
};

export default function HistoryPage() {
	const [search, setSearch] = useState('');
	const [type, setType] = useState('all');
	const [period, setPeriod] = useState('7days');
	const [isFiltersVisible, setIsFiltersVisible] = useState(true);
	const { scrollY } = useScroll();
	const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
	const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);

	const accountStats = useMemo(() => {
		const initialBalance = transactions[0]?.balance || 0;
		const finalBalance =
			transactions[transactions.length - 1]?.balance || 0;

		const totalIncome = transactions
			.filter((t) => t.type === 'deposit')
			.reduce((sum, t) => sum + t.amount, 0);

		const totalExpense = Math.abs(
			transactions
				.filter((t) => t.type === 'payment')
				.reduce((sum, t) => sum + t.amount, 0)
		);

		const netChange = finalBalance - initialBalance;

		return {
			initialBalance,
			finalBalance,
			totalIncome,
			totalExpense,
			netChange
		};
	}, []);

	const filteredTransactions = useMemo(() => {
		return transactions.filter((transaction) => {
			if (type !== 'all' && transaction.type !== type) return false;
			return (
				search.toLowerCase() === '' ||
				transaction.description
					.toLowerCase()
					.includes(search.toLowerCase())
			);
		});
	}, [search, type]);

	return (
		<div className='min-h-screen bg-gradient-to-b from-background/50 to-background'>
			<motion.header
				style={{ opacity: headerOpacity, scale: headerScale }}
				className='sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b'
			>
				<div className='container max-w-screen-xl mx-auto py-4'>
				<div className='flex justify-between'>
						<div className='flex items-center gap-4'>
							<Button
								variant='ghost'
								size='icon'
								asChild
								className='hover:bg-primary/10'
							>
								<Link href='/wallet'>
									<ArrowLeft className='h-5 w-5 text-foreground' />
									<span className='sr-only'>Back</span>
								</Link>
							</Button>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								className='flex gap-2'
							>
								{/*<Wallet className='h-8 w-8 text-primary' />*/}
								<h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
									Transaction History
								</h1>
							</motion.div>
						</div>
						<Button
							variant='outline'
							onClick={() =>
								setIsFiltersVisible(!isFiltersVisible)
							}
							className='gap-2 border-primary/20 text-foreground hover:bg-primary/10'
						>
							<Filter className='h-4 w-4' />
							Filters
						</Button>
					</div>
				</div>
			</motion.header>

			<main className='container mx-auto max-w-7xl py-8'>
				<section className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8'>
					<Card className='lg:col-span-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'>
						<CardContent className='flex flex-col lg:flex-row items-center justify-between p-6'>
							<div className='space-y-2 text-center lg:text-left'>
								<p className='text-sm text-muted-foreground'>
									Current Balance
								</p>
								<motion.p
									key={accountStats.finalBalance}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className='text-4xl font-bold text-foreground'
								>
									{accountStats.finalBalance.toLocaleString()}{' '}
									VND
								</motion.p>
							</div>

							<div className='flex gap-6 mt-4 lg:mt-0'>
								<div className='text-center'>
									<p className='text-sm text-green-600 dark:text-green-400 flex items-center gap-1'>
										<TrendingUp className='h-4 w-4' />
										Total Income
									</p>
									<motion.p
										key={accountStats.totalIncome}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										className='text-2xl font-semibold text-green-600 dark:text-green-400'
									>
										+{' '}
										{accountStats.totalIncome.toLocaleString()}{' '}
										VND
									</motion.p>
								</div>

								<Separator
									orientation='vertical'
									className='h-auto'
								/>

								<div className='text-center'>
									<p className='text-sm text-red-600 dark:text-red-400 flex items-center gap-1'>
										<TrendingDown className='h-4 w-4' />
										Total Expense
									</p>
									<motion.p
										key={accountStats.totalExpense}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										className='text-2xl font-semibold text-red-600 dark:text-red-400'
									>
										-{' '}
										{accountStats.totalExpense.toLocaleString()}{' '}
										VND
									</motion.p>
								</div>
							</div>
						</CardContent>
					</Card>

					{accountStats.netChange !== 0 && (
						<Card className='lg:col-span-4'>
							<CardContent className='p-4'>
								<Alert
									variant={
										accountStats.netChange > 0
											? 'default'
											: 'destructive'
									}
									className='flex items-center'
								>
									{accountStats.netChange > 0 ? (
										<TrendingUp className='h-6 w-6 text-green-600 mr-4' />
									) : (
										<TrendingDown className='h-6 w-6 text-red-600 mr-4' />
									)}
									<div>
										<AlertTitle>
											{accountStats.netChange > 0
												? 'Balance Increased'
												: 'Balance Decreased'}
										</AlertTitle>
										<AlertDescription>
											Your account balance{' '}
											{accountStats.netChange > 0
												? 'increased'
												: 'decreased'}{' '}
											by{' '}
											{Math.abs(
												accountStats.netChange
											).toLocaleString()}{' '}
											VND compared to the previous period.
										</AlertDescription>
									</div>
								</Alert>
							</CardContent>
						</Card>
					)}
				</section>

				<AnimatePresence>
					{isFiltersVisible && (
						<motion.section
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className='mb-8'
						>
							<Card className='bg-background'>
								<CardContent className='p-6'>
									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										<div className='space-y-2'>
											<Label>Search</Label>
											<div className='relative'>
												<Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
												<Input
													placeholder='Search transactions...'
													value={search}
													onChange={(e) =>
														setSearch(
															e.target.value
														)
													}
													className='pl-10 h-11 focus-visible:ring-2 focus-visible:ring-primary'
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<Label>Transaction Type</Label>
											<Select
												value={type}
												onValueChange={setType}
											>
												<SelectTrigger className='h-11 focus:ring-2 focus:ring-primary'>
													<SelectValue placeholder='All Types' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='all'>
														All Transactions
													</SelectItem>
													<SelectItem value='deposit'>
														Deposits
													</SelectItem>
													<SelectItem value='payment'>
														Payments
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className='space-y-2'>
											<Label>Time Period</Label>
											<Select
												value={period}
												onValueChange={setPeriod}
											>
												<SelectTrigger className='h-11 focus:ring-2 focus:ring-primary'>
													<SelectValue placeholder='Select Period' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='7days'>
														Last 7 Days
													</SelectItem>
													<SelectItem value='30days'>
														Last 30 Days
													</SelectItem>
													<SelectItem value='90days'>
														Last 90 Days
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.section>
					)}
				</AnimatePresence>

				<motion.section
					variants={containerVariants}
					initial='hidden'
					animate='visible'
					className='space-y-4'
				>
					<AnimatePresence mode='popLayout'>
						{filteredTransactions.map((transaction) => (
							<motion.article
								key={transaction.id}
								variants={itemVariants}
								layout
								exit='exit'
								// whileHover={{ scale: 1.02 }}
								className='group relative overflow-hidden rounded-xl bg-background border shadow-sm hover:shadow-md transition-shadow'
							>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className='flex items-center justify-between p-4'>
												<div className='flex items-center gap-4'>
													

													<div>
														<h3 className='font-semibold text-lg'>
															{
																transaction.description
															}
														</h3>
														<div className='flex items-center gap-2 mt-1 text-muted-foreground'>
															<span className='text-sm'>
																{new Date(transaction.date).toLocaleDateString('en-GB', {
																	day: '2-digit',
																	month: 'short', 
																	year: 'numeric'
																})}
																{' • '}
																{new Date(transaction.date).toLocaleTimeString('en-GB', {
																	hour: '2-digit',
																	minute: '2-digit',
																	hour12: true
																})}
															</span>
														</div>
													</div>
												</div>

												<div className='flex items-center gap-6'>
													<motion.div
														className={cn(
															'flex flex-col gap-2 items-end'
														)}
													>
														<motion.div
															className={cn(
																'text-xl font-bold flex items-center gap-2',
																transaction.type === 'deposit'
																	? 'text-green-600'
																	: 'text-red-600'
															)}
															initial={{ opacity: 0, x: 20 }}
															animate={{ opacity: 1, x: 0 }}
															whileHover={{ scale: 1.05 }}
															transition={{
																type: 'spring',
																stiffness: 300,
																damping: 20
															}}
														>
															{transaction.type === 'deposit' ? (
																<TrendingUp className='h-5 w-5' />
															) : (
																<TrendingDown className='h-5 w-5' />
															)}
															<span className='font-mono tracking-tight'>
																{transaction.type === 'deposit' ? '+' : '-'}
																{Math.abs(transaction.amount).toLocaleString()}{' '}
																<span className='text-sm font-medium opacity-75'>VND</span>
															</span>
														</motion.div>
														<motion.div 
															className='text-sm text-muted-foreground/75 font-medium'
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															transition={{ delay: 0.1 }}
														>
															Balance: {transaction.balance.toLocaleString()} VND
														</motion.div>
													</motion.div>
												</div>
											</div>
										</TooltipTrigger>

										<TooltipContent side='top'>
											<p>View transaction details</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<motion.div
									className={cn(
										'absolute inset-0 -z-10 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity',
										transaction.type === 'deposit'
											? 'from-green-500/5 to-transparent'
											: 'from-red-500/5 to-transparent'
									)}
									initial={{ width: 0 }}
									whileHover={{ width: '100%' }}
								/>
							</motion.article>
						))}
					</AnimatePresence>
				</motion.section>

				{filteredTransactions.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-center py-12'
					>
						<p className='text-xl text-muted-foreground'>
							No transactions found matching your filter
						</p>
					</motion.div>
				)}
			</main>
		</div>
	);
}
