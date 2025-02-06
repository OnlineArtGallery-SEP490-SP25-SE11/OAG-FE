'use client';

import { useState } from 'react';
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const transactions = [
	{
		id: '1',
		type: 'deposit',
		amount: 500000,
		date: '2024-02-06T13:45:00',
		description: 'Bank Transfer Deposit',
		status: 'success'
	},
	{
		id: '2',
		type: 'payment',
		amount: -200000,
		date: '2024-02-06T10:30:00',
		description: 'Service Payment',
		status: 'success'
	},
	{
		id: '3',
		type: 'deposit',
		amount: 1000000,
		date: '2024-02-05T15:20:00',
		description: 'Credit Card Deposit',
		status: 'success'
	},
	{
		id: '4',
		type: 'payment',
		amount: -150000,
		date: '2024-02-05T09:15:00',
		description: 'Monthly Subscription',
		status: 'success'
	},
	{
		id: '5',
		type: 'deposit',
		amount: 750000,
		date: '2024-02-04T14:30:00',
		description: 'E-Wallet Transfer',
		status: 'success'
	}
];

export default function HistoryPage() {
	const [search, setSearch] = useState('');
	const [type, setType] = useState('all');
	const [period, setPeriod] = useState('7days');

	const filteredTransactions = transactions.filter((transaction) => {
		if (type !== 'all' && transaction.type !== type) return false;
		if (
			search &&
			!transaction.description
				.toLowerCase()
				.includes(search.toLowerCase())
		)
			return false;
		return true;
	});

	return (
		<div className='container py-6'>
			<div className='mb-6 flex items-center gap-4'>
				<Button variant='ghost' size='icon' asChild>
					<Link href='/'>
						<ArrowLeft className='h-4 w-4' />
						<span className='sr-only'>Back</span>
					</Link>
				</Button>
				<h1 className='text-lg font-semibold md:text-xl'>
					Transaction History
				</h1>
			</div>

			<Card className='mb-6'>
				<CardHeader>
					<CardTitle>Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-3'>
						<div className='space-y-2'>
							<Label htmlFor='search'>Search</Label>
							<div className='relative'>
								<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									id='search'
									placeholder='Search transactions...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className='pl-8'
								/>
							</div>
						</div>

						<div className='space-y-2'>
							<Label>Type</Label>
							<Select value={type} onValueChange={setType}>
								<SelectTrigger>
									<SelectValue placeholder='Select type' />
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
							<Label>Period</Label>
							<Select value={period} onValueChange={setPeriod}>
								<SelectTrigger>
									<SelectValue placeholder='Select period' />
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

			<div className='space-y-4'>
				{filteredTransactions.map((transaction) => (
					<motion.div
						key={transaction.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className='overflow-hidden'
					>
						<div className='flex items-center justify-between space-x-4 rounded-lg border p-4 transition-all hover:bg-muted/50'>
							<div className='flex items-center space-x-4'>
								<div className='rounded-full border p-2'>
									{transaction.type === 'deposit' ? (
										<ArrowDownLeft className='h-4 w-4 text-green-500' />
									) : (
										<ArrowUpRight className='h-4 w-4 text-red-500' />
									)}
								</div>
								<div>
									<p className='text-sm font-medium leading-none'>
										{transaction.description}
									</p>
									<p className='text-sm text-muted-foreground'>
										{new Date(
											transaction.date
										).toLocaleString()}
									</p>
								</div>
							</div>
							<div
								className={cn(
									'text-sm font-medium',
									transaction.type === 'deposit'
										? 'text-green-500'
										: 'text-red-500'
								)}
							>
								{transaction.type === 'deposit' ? '+' : '-'}
								{Math.abs(
									transaction.amount
								).toLocaleString()}{' '}
								VND
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
