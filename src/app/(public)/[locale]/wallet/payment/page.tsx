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
import { useToast } from '@/hooks/use-toast';

export default function PaymentPage() {
	const [amount, setAmount] = useState('');
	const [description, setDescription] = useState('');
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const currentBalance = 1234567; // This would come from your state management
	const canPay = Number(amount) <= currentBalance;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!canPay) {
			toast({
				title: 'Insufficient balance',
				description:
					'Please enter an amount less than your current balance.',
				variant: 'destructive'
			});
			return;
		}
		setShowConfirm(true);
	};

	const handleConfirm = async () => {
		setLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setLoading(false);
		setShowConfirm(false);
		toast({
			title: 'Payment successful',
			description: `${Number(amount).toLocaleString()} VND has been paid.`
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
					Make Payment
				</h1>
			</div>

			<form onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>Payment Details</CardTitle>
						<CardDescription>
							Enter the amount and description for your payment.
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='rounded-lg border bg-muted/50 p-4'>
							<div className='text-sm font-medium'>
								Current Balance
							</div>
							<div className='mt-1 text-2xl font-bold'>
								{currentBalance.toLocaleString()} VND
							</div>
						</div>

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
							{Number(amount) > currentBalance && (
								<p className='text-sm text-destructive'>
									Amount exceeds current balance
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='description'>Description</Label>
							<Input
								id='description'
								placeholder='Enter payment description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</div>

						{amount && (
							<div className='rounded-lg border bg-muted/50 p-4'>
								<div className='text-sm font-medium'>
									Balance After Payment
								</div>
								<div className='mt-1 text-2xl font-bold'>
									{Math.max(
										0,
										currentBalance - Number(amount)
									).toLocaleString()}{' '}
									VND
								</div>
							</div>
						)}
					</CardContent>
					<CardFooter>
						<Button
							type='submit'
							className='w-full'
							disabled={!amount || !canPay}
						>
							Continue
						</Button>
					</CardFooter>
				</Card>
			</form>

			<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Payment</DialogTitle>
						<DialogDescription>
							Please confirm your payment details below.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='text-sm font-medium'>Amount:</div>
							<div className='text-sm'>
								{Number(amount).toLocaleString()} VND
							</div>
							<div className='text-sm font-medium'>
								Description:
							</div>
							<div className='text-sm'>{description}</div>
							<div className='text-sm font-medium'>
								Balance After:
							</div>
							<div className='text-sm'>
								{Math.max(
									0,
									currentBalance - Number(amount)
								).toLocaleString()}{' '}
								VND
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
								'Confirm Payment'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
