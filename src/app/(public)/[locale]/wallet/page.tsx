'use client';

import { QuickActions } from './components/actions/quick_actions';
import { BalanceCard } from './components/balance/balance_card';
import { SectionHeader } from './components/section_header';
import { TransactionList } from './components/transactions/transaction_list';

export default function WalletDashboard() {
	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
			<SectionHeader title="My Wallet" backUrl={null} />
			<main className='container mx-auto py-6 px-4'>
				<div className='grid gap-6'>
					<BalanceCard balance={1234567} />
					<section>
						<QuickActions />
					</section>
					<TransactionList />
				</div>
			</main>
		</div>
	);
}
