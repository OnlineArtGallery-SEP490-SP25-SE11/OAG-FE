'use client';

import { useQuery } from '@tanstack/react-query';
import { QuickActions } from './components/actions/quick_actions';
import { BalanceCard } from './components/balance/balance_card';
import { SectionHeader } from './components/section_header';
import { TransactionList } from './components/transactions/transaction_list';
import { walletService } from './queries';

export default function WalletDashboard() {
	const { data, error, isLoading, isFetching, refetch } = useQuery({
		queryKey: ['wallet'],
		queryFn: () => walletService.getWallet(),
		placeholderData: (previousData) => previousData,
		refetchOnWindowFocus: true
	});
	const balance = data?.data.balance || 123456;
	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
			<SectionHeader title="My Wallet" backUrl={null} />
			<main className='container mx-auto py-6 px-4'>
				<div className='grid gap-6'>
					<BalanceCard balance={balance} />
					<section>
						<QuickActions />
					</section>
					<TransactionList />
				</div>
			</main>
		</div>
	);
}
