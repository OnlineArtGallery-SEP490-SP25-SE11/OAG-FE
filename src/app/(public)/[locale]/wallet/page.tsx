'use client';
import {
	ArrowLeft,
	ChevronDown,
	CreditCard,
	History,
	Plus
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { BalanceChart } from './components/balance-chart';
// import { NotificationBell } from "./notification-bell"
import { TransactionList } from './components/transaction-list';
import { motion } from 'framer-motion';

export default function WalletDashboard() {
	return (
		<div className='min-h-screen bg-background'>
			{/*<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">*/}
			{/*	<div className="container flex h-14 items-center">*/}
			{/*		<div className="flex items-center gap-2 font-semibold">*/}
			{/*			<CreditCard className="h-6 w-6" />*/}
			{/*			<span>MyWallet v0</span>*/}
			{/*		</div>*/}
			{/*		<div className="ml-auto flex items-center gap-4">*/}
			{/*			<NotificationBell />*/}
			{/*			<DropdownMenu>*/}
			{/*				<DropdownMenuTrigger asChild>*/}
			{/*					<Button variant="ghost" size="icon">*/}
			{/*						<Settings className="h-4 w-4" />*/}
			{/*						<span className="sr-only">Settings</span>*/}
			{/*					</Button>*/}
			{/*				</DropdownMenuTrigger>*/}
			{/*				<DropdownMenuContent align="end">*/}
			{/*					<DropdownMenuLabel>Quick Settings</DropdownMenuLabel>*/}
			{/*					<DropdownMenuSeparator />*/}
			{/*					<DropdownMenuItem>Help</DropdownMenuItem>*/}
			{/*					<DropdownMenuItem>Contact Support</DropdownMenuItem>*/}
			{/*				</DropdownMenuContent>*/}
			{/*			</DropdownMenu>*/}
			{/*		</div>*/}
			{/*	</div>*/}
			{/*</header>*/}
			<header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
				<div className='container max-w-screen-xl mx-auto py-4'>
					<div className='flex justify-between'>
						<div className='flex items-center gap-4'>
							<Button variant='ghost' size='icon' asChild>
								<Link href='/wallet'>
									<ArrowLeft className='h-5 w-5' />
									<span className='sr-only'>Back</span>
								</Link>
							</Button>
							<h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
								My Wallet
							</h1>
						</div>
					</div>
				</div>
			</header>
			<main className='container mx-auto py-6'>
				<div className='grid gap-6'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-base font-medium'>
								Current Balance
							</CardTitle>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='sm'>
										Last 7 days
										<ChevronDown className='ml-2 h-4 w-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem>
										Last 24 hours
									</DropdownMenuItem>
									<DropdownMenuItem>
										Last 7 days
									</DropdownMenuItem>
									<DropdownMenuItem>
										Last 30 days
									</DropdownMenuItem>
									<DropdownMenuItem>
										Last 90 days
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</CardHeader>
						<CardContent>
							<div className='text-3xl font-bold'>
								1,234,567 VND
							</div>
							<div className='h-[200px]'>
								<BalanceChart />
							</div>
						</CardContent>
					</Card>
					<section>
						<div className='grid gap-6 md:grid-cols-3'>
							{[
								{
									href: '/wallet/deposit',
									title: 'Deposit',
									icon: Plus,
									desc: 'Add funds to your wallet',
									color: 'bg-green-500'
								},
								{
									href: '/wallet/payment',
									title: 'Wi',
									icon: CreditCard,
									desc: 'Make a payment',
									color: 'bg-blue-500'
								},
								{
									href: '/wallet/history',
									title: 'History',
									icon: History,
									desc: 'View transaction history',
									color: 'bg-gray-500'
								}
							].map(
								(
									{ href, title, icon: Icon, desc, color },
									idx
								) => (
									<Link key={idx} href={href}>
										<motion.div whileTap={{ scale: 0.95 }}>
											<Card
												className={`transition-all hover:${color}/80 ${color} text-white`}
											>
												<CardHeader className='flex flex-row items-center justify-between space-y-0'>
													<CardTitle className='text-lg font-medium'>
														{title}
													</CardTitle>
													<Icon className='h-6 w-6' />
												</CardHeader>
												<CardContent>
													<CardDescription className='text-white/80'>
														{desc}
													</CardDescription>
												</CardContent>
											</Card>
										</motion.div>
									</Link>
								)
							)}
						</div>
					</section>
					<Card>
						<CardHeader>
							<CardTitle>Recent Transactions</CardTitle>
						</CardHeader>
						<CardContent>
							<TransactionList />
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
