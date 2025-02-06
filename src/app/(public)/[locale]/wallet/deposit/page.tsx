'use client';

import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter
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

const depositMethods = [
	{
		id: 'bank',
		name: 'Bank Transfer',
		description: 'Direct transfer from your bank account'
	},
	{
		id: 'card',
		name: 'Credit Card',
		description: 'Instant deposit using credit/debit card'
	},
	{
		id: 'ewallet',
		name: 'E-Wallet',
		description: 'Transfer from another e-wallet'
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
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setLoading(false);
		setShowConfirm(false);
		toast({
			title: 'Deposit successful',
			description: `${Number(
				amount
			).toLocaleString()} VND has been added to your wallet.`
		});
	};

	return (
		<div className='container max-w-xl py-6'>
			<div className='mb-6 flex items-center gap-4'>
				<Button variant='ghost' size='icon' asChild>
					<Link href='/'>
						<ArrowLeft className='h-4 w-4' />
						<span className='sr-only'>Back</span>
					</Link>
				</Button>
				<h1 className='text-lg font-semibold md:text-xl'>
					Deposit Funds
				</h1>
			</div>

			<form onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>Enter Amount</CardTitle>
						<CardDescription>
							Choose how much you want to deposit and select a
							payment method.
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='space-y-2'>
							<Label htmlFor='amount'>Amount (VND)</Label>
							<Input
								id='amount'
								placeholder='Enter amount'
								type='number'
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label>Select Deposit Method</Label>
							<RadioGroup
								defaultValue='bank'
								value={method}
								onValueChange={setMethod}
								className='grid gap-4 md:grid-cols-3'
							>
								{depositMethods.map((dm) => (
									<motion.div
										key={dm.id}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Label
											htmlFor={dm.id}
											className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary'
										>
											<RadioGroupItem
												value={dm.id}
												id={dm.id}
												className='sr-only'
											/>
											<h3 className='font-medium'>
												{dm.name}
											</h3>
											<p className='text-center text-sm text-muted-foreground'>
												{dm.description}
											</p>
										</Label>
									</motion.div>
								))}
							</RadioGroup>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							type='submit'
							className='w-full'
							disabled={!amount}
						>
							Continue
						</Button>
					</CardFooter>
				</Card>
			</form>

			<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deposit</DialogTitle>
						<DialogDescription>
							Please confirm your deposit details below.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='text-sm font-medium'>Amount:</div>
							<div className='text-sm'>
								{Number(amount).toLocaleString()} VND
							</div>
							<div className='text-sm font-medium'>Method:</div>
							<div className='text-sm'>
								{
									depositMethods.find(
										(dm) => dm.id === method
									)?.name
								}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setShowConfirm(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleConfirm} disabled={loading}>
							{loading ? (
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										duration: 1,
										repeat: Number.POSITIVE_INFINITY,
										ease: 'linear'
									}}
								>
									<Check className='h-4 w-4' />
								</motion.div>
							) : (
								'Confirm Deposit'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
