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
	const statusData = {
		labels: ['Available', 'Sold', 'Hidden', 'Selling'],
		datasets: [
			{
				data: [12, 19, 3, 5],
				backgroundColor: ['#10B981', '#3B82F6', '#6B7280', '#F59E0B'],
				hoverBackgroundColor: [
					'#059669',
					'#2563EB',
					'#4B5563',
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

	const collectionData = {
		labels: ['Summer', 'Abstract', 'Nature', 'Portrait', 'Urban'],
		datasets: [
			{
				label: 'Artworks per Collection',
				data: [12, 19, 3, 5, 2],
				backgroundColor: [
					'#10B981',
					'#3B82F6',
					'#F59E0B',
					'#EF4444',
					'#8B5CF6'
				]
			}
		]
	};

	return (
		<div>
			<h1 className='text-3xl font-bold mb-6'>Dashboard</h1>
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
						<CardTitle>Recent Sales</CardTitle>
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
						<p className='text-4xl font-bold'>$12,450</p>
					</CardContent>
				</Card>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
				<Card>
					<CardHeader>
						<CardTitle>Artwork Status Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<Doughnut data={statusData} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Sales Trends</CardTitle>
					</CardHeader>
					<CardContent>
						<Line data={salesData} />
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Artworks per Collection</CardTitle>
				</CardHeader>
				<CardContent>
					<Bar data={collectionData} />
				</CardContent>
			</Card>
		</div>
	);
}
