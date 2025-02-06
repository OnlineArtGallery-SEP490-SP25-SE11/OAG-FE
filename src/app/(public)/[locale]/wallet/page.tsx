import { ChevronDown, CreditCard, History, Plus } from 'lucide-react';
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
			<main className='container py-6'>
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
					<div className='grid gap-4 md:grid-cols-3'>
						<Link href='/wallet/deposit'>
							<Card className='transition-all hover:bg-muted/50'>
								<CardHeader className='flex flex-row items-center justify-between space-y-0'>
									<CardTitle className='text-sm font-medium'>
										Deposit
									</CardTitle>
									<Plus className='h-4 w-4 text-muted-foreground' />
								</CardHeader>
								<CardContent>
									<CardDescription>
										Add funds to your wallet
									</CardDescription>
								</CardContent>
							</Card>
						</Link>
						<Link href='/wallet/payment'>
							<Card className='transition-all hover:bg-muted/50'>
								<CardHeader className='flex flex-row items-center justify-between space-y-0'>
									<CardTitle className='text-sm font-medium'>
										Pay
									</CardTitle>
									<CreditCard className='h-4 w-4 text-muted-foreground' />
								</CardHeader>
								<CardContent>
									<CardDescription>
										Make a payment
									</CardDescription>
								</CardContent>
							</Card>
						</Link>
						<Link href='/wallet/history'>
							<Card className='transition-all hover:bg-muted/50'>
								<CardHeader className='flex flex-row items-center justify-between space-y-0'>
									<CardTitle className='text-sm font-medium'>
										History
									</CardTitle>
									<History className='h-4 w-4 text-muted-foreground' />
								</CardHeader>
								<CardContent>
									<CardDescription>
										View transaction history
									</CardDescription>
								</CardContent>
							</Card>
						</Link>
					</div>
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
