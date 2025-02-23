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
import { useState } from 'react';
import { vietnamCurrency } from '@/utils/converters';
import TabChart from './tab-chart';

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

export default function Dashboard() {
	const [timeFilter, setTimeFilter] = useState('week');

	const statusData = {
		labels: ['Total', 'Sold', 'Selling'],
		datasets: [
			{
				data: [15, 19, 5],
				backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
				hoverBackgroundColor: [
					'#059669',
					'#2563EB',
					'#D97706'
				]
			}
		]
	};

	const salesData = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
		datasets: [
			{
				label: 'Sales',
				data: [65, 59, 80, 81, 56, 55, 40],
				fill: false,
				borderColor: '#3B82F6',
				tension: 0.1
			}
		]
	};

	const revenueData = {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'Revenue',
				data: [1200, 1900, 800, 1500, 2000, 1700, 1300],
				backgroundColor: '#3B82F6',
			}
		]
	};

	const handleTimeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setTimeFilter(event.target.value);
	};

	const TimeFilter = () => (
		<select
			value={timeFilter}
			onChange={handleTimeFilterChange}
			className="border rounded-md p-1 text-sm"
		>
			<option value="day">Day</option>
			<option value="week">Week</option>
			<option value="month">Month</option>
		</select>
	);

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className='text-3xl font-bold'>Dashboard</h1>
				<TimeFilter />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
				<Card>
					<CardHeader>
						<CardTitle>Total Artworks</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-4xl font-bold'>39</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Total Collections</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-4xl font-bold'>5</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Total Sales</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-4xl font-bold'>7</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Total Revenue</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-4xl font-bold'>{vietnamCurrency(12000000)}</p>
					</CardContent>
				</Card>
				
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Artwork Status Distribution</CardTitle>
						
					</CardHeader>
					<CardContent>
						<Doughnut data={statusData} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Sales Trends</CardTitle>
						
					</CardHeader>
					<CardContent>
						<Line data={salesData} />
					</CardContent>
				</Card>
			</div>
			<div className='mb-6'>
				<TabChart />
			</div>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Revenue Overview</CardTitle>
					
				</CardHeader>
				<CardContent>
					<Bar data={revenueData} />
				</CardContent>
			</Card>
			
		</div>
	);
}
