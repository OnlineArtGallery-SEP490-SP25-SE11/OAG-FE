'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { vietnamCurrency } from '@/utils/converters';
import TabChart from './tab-chart';
import { motion } from 'framer-motion';

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	BarElement
);

const getChartOptions = (isMobile: boolean) => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: isMobile ? ('bottom' as const) : ('top' as const),
			labels: {
				font: { size: isMobile ? 12 : 16, family: 'Inter, sans-serif' },
				padding: isMobile ? 10 : 20,
				color: '#6b7280' // Gray-600 for contrast
			}
		},
		tooltip: {
			backgroundColor: 'rgba(0, 128, 128, 0.85)', // Teal with transparency
			padding: isMobile ? 10 : 12,
			cornerRadius: 6,
			bodyFont: { size: isMobile ? 12 : 14, family: 'Inter, sans-serif' },
			titleFont: { size: isMobile ? 14 : 16, family: 'Inter, sans-serif' }
		}
	},
	scales: {
		x: {
			ticks: {
				font: { size: isMobile ? 12 : 14, family: 'Inter, sans-serif' },
				maxRotation: isMobile ? 45 : 0,
				minRotation: isMobile ? 45 : 0,
				color: '#6b7280'
			},
			grid: { display: false }
		},
		y: {
			ticks: {
				font: { size: isMobile ? 12 : 14, family: 'Inter, sans-serif' },
				color: '#6b7280'
			},
			grid: { color: 'rgba(0, 128, 128, 0.1)', borderDash: [5, 5] } // Teal grid
		}
	},
	animation: {
		duration: 1000,
		easing: 'easeOutQuart'
	}
});

export default function Dashboard() {
	const [timeFilter, setTimeFilter] = useState('week');
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const statusData = {
		labels: ['Total', 'Sold', 'Selling'],
		datasets: [
			{
				data: [15, 19, 5],
				backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'], // Emerald, Blue, Amber
				hoverBackgroundColor: ['#059669', '#2563EB', '#D97706'],
				borderWidth: 2,
				borderColor: '#ffffff'
			}
		]
	};

	const salesData = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
		datasets: [
			{
				label: 'Sales',
				data: [65, 59, 80, 81, 56, 55, 40],
				fill: true,
				backgroundColor: 'rgba(20, 184, 166, 0.15)', // Teal-500 with opacity
				borderColor: '#14B8A6', // Teal-500
				tension: 0.4,
				pointBackgroundColor: '#14B8A6',
				pointBorderColor: '#ffffff',
				pointHoverRadius: isMobile ? 6 : 8,
				pointRadius: isMobile ? 3 : 4,
				borderWidth: 2
			}
		]
	};

	const revenueData = {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'Revenue',
				data: [1200, 1900, 800, 1500, 2000, 1700, 1300],
				backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald-500
				borderColor: '#10B981', // Emerald-500
				borderWidth: 1,
				hoverBackgroundColor: '#10B981',
				barThickness: isMobile ? 20 : 40
			}
		]
	};

	const handleTimeFilterChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setTimeFilter(event.target.value);
	};

	const TimeFilter = () => (
		<select
			value={timeFilter}
			onChange={handleTimeFilterChange}
			className='border rounded-lg px-2 py-1.5 text-sm md:text-base bg-emerald-50 dark:bg-teal-900/30 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 w-full max-w-[160px] font-medium text-emerald-700 dark:text-emerald-200'
		>
			<option value='day'>Ngày</option>
			<option value='week'>Tuần</option>
			<option value='month'>Tháng</option>
		</select>
	);

	const StatCard = ({
		title,
		value,
		color
	}: {
		title: string;
		value: string | number;
		color: string;
	}) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Card className='hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700'>
				<CardHeader className='pb-1 md:pb-2'>
					<CardTitle className='text-xs md:text-sm font-medium text-teal-600 dark:text-teal-400 line-clamp-1'>
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p
						className={`text-xl md:text-3xl font-bold ${color} truncate`}
					>
						{value}
					</p>
				</CardContent>
			</Card>
		</motion.div>
	);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			className='p-3 md:p-6 space-y-4 md:space-y-6 max-w-6xl mx-auto'
		>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -15 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
				className={
					isMobile
						? 'space-y-3'
						: 'flex justify-between items-center gap-4'
				}
			>
				<h1 className='text-lg md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent'>
					Dashboard
				</h1>
				<TimeFilter />
			</motion.div>

			{/* Stats */}
			<div
				className={
					isMobile
						? 'space-y-3'
						: 'grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'
				}
			>
				<StatCard
					title='Total Artworks'
					value='39'
					color='text-emerald-600'
				/>
				<StatCard
					title='Total Collections'
					value='5'
					color='text-teal-600'
				/>
				<StatCard
					title='Total Sales'
					value='7'
					color='text-amber-600'
				/>
				<StatCard
					title='Total Revenue'
					value={vietnamCurrency(12000000)}
					color='text-cyan-600'
				/>
			</div>

			{/* Charts */}
			<div
				className={
					isMobile
						? 'space-y-4'
						: 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'
				}
			>
				<Card className='border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
					<CardHeader className='border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800'>
						<CardTitle className='text-sm md:text-lg font-semibold text-emerald-700 dark:text-emerald-200 line-clamp-1'>
							Phân bố trạng thái tác phẩm
						</CardTitle>
					</CardHeader>
					<CardContent className='p-3 md:p-6 h-[200px] md:h-[300px]'>
						<Doughnut
							data={statusData}
							options={{
								...getChartOptions(isMobile),
								cutout: isMobile ? '40%' : '60%'
							}}
						/>
					</CardContent>
				</Card>

				<Card className='border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
					<CardHeader className='border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800'>
						<CardTitle className='text-sm md:text-lg font-semibold text-emerald-700 dark:text-emerald-200 line-clamp-1'>
							Xu hướng doanh số
						</CardTitle>
					</CardHeader>
					<CardContent className='p-3 md:p-6 h-[200px] md:h-[300px]'>
						<Line
							data={salesData}
							options={getChartOptions(isMobile)}
						/>
					</CardContent>
				</Card>

				{isMobile && (
					<div className='shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
						<TabChart />
					</div>
				)}
			</div>

			{!isMobile && (
				<div className='shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
					<TabChart />
				</div>
			)}

			<Card className='border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
				<CardHeader className='border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800'>
					<CardTitle className='text-sm md:text-lg font-semibold text-emerald-700 dark:text-emerald-200 line-clamp-1'>
						Tổng quan doanh thu
					</CardTitle>
				</CardHeader>
				<CardContent className='p-3 md:p-6 h-[250px] md:h-[350px]'>
					<Bar
						data={revenueData}
						options={getChartOptions(isMobile)}
					/>
				</CardContent>
			</Card>
		</motion.div>
	);
}
