'use client';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	type ChartOptions
} from 'chart.js';
import { useTheme } from 'next-themes';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const data = [
	{ date: 'Mon', balance: 1200000 },
	{ date: 'Tue', balance: 1150000 },
	{ date: 'Wed', balance: 1300000 },
	{ date: 'Thu', balance: 1234567 },
	{ date: 'Fri', balance: 1400000 },
	{ date: 'Sat', balance: 1350000 },
	{ date: 'Sun', balance: 1234567 }
];

export function BalanceChart() {
	const { theme } = useTheme();

	const chartData = {
		labels: data.map((item) => item.date),
		datasets: [
			{
				label: 'Balance',
				data: data.map((item) => item.balance),
				borderColor:
					theme === 'dark'
						? 'rgba(255, 255, 255, 0.8)'
						: 'rgba(0, 0, 0, 0.8)',
				backgroundColor:
					theme === 'dark'
						? 'rgba(255, 255, 255, 0.2)'
						: 'rgba(0, 0, 0, 0.2)',
				tension: 0.4
			}
		]
	};

	const options: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				grid: {
					color:
						theme === 'dark'
							? 'rgba(255, 255, 255, 0.1)'
							: 'rgba(0, 0, 0, 0.1)'
				},
				ticks: {
					color:
						theme === 'dark'
							? 'rgba(255, 255, 255, 0.8)'
							: 'rgba(0, 0, 0, 0.8)'
				}
			},
			y: {
				grid: {
					color:
						theme === 'dark'
							? 'rgba(255, 255, 255, 0.1)'
							: 'rgba(0, 0, 0, 0.1)'
				},
				ticks: {
					color:
						theme === 'dark'
							? 'rgba(255, 255, 255, 0.8)'
							: 'rgba(0, 0, 0, 0.8)',
					callback: (value) => `${Number(value).toLocaleString()} VND`
				}
			}
		},
		plugins: {
			legend: {
				display: false
			},
			tooltip: {
				mode: 'index',
				intersect: false,
				callbacks: {
					label: (context) =>
						`Balance: ${Number(
							context.parsed.y
						).toLocaleString()} VND`
				}
			}
		}
	};

	return (
		<div className='h-[200px] w-full'>
			<Line data={chartData} options={options} />
		</div>
	);
}
