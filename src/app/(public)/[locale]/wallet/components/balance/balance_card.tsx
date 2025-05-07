'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { BalanceChart } from './balance_chart';

const PERIOD_OPTIONS = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
];

interface BalanceCardProps {
    balance: number;
    currency?: string;
}

export function BalanceCard({ balance, currency = 'VND' }: BalanceCardProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('7d');

    const selectedPeriodLabel = PERIOD_OPTIONS.find(
        option => option.value === selectedPeriod
    )?.label || 'Last 7 days';

    return (
        <Card className="border-primary/20">
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-base font-medium'>
                    Current Balance
                </CardTitle>
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                            {selectedPeriodLabel}
                            <ChevronDown className='ml-2 h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        {PERIOD_OPTIONS.map(option => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => setSelectedPeriod(option.value)}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu> */}
            </CardHeader>
            <CardContent>
                <div className='text-3xl font-bold text-green-500'>
                    {balance.toLocaleString()} {currency}
                </div>
                <div className='h-[200px]'>
                    <BalanceChart period={selectedPeriod} />
                </div>
            </CardContent>
        </Card>
    );
}
