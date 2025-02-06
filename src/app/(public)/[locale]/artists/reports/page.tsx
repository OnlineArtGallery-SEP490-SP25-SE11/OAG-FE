'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	ArcElement
);

interface SalesData {
	Month: string;
	Sales: number;
}

interface ArtworkStatusData {
	Status: string;
	Count: number;
}

interface RevenueData {
	Month: string;
	Revenue: number;
}

export default function Reports() {
	const [reportType, setReportType] = useState('sales');
	const [timeRange, setTimeRange] = useState('month');

	const salesData = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
		datasets: [
			{
				label: 'Sales',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: 'rgba(75, 192, 192, 0.6)'
			}
		]
	};

	const artworkStatusData = {
		labels: ['Available', 'Sold', 'Hidden'],
		datasets: [
			{
				label: 'Artwork Status',
				data: [30, 50, 20],
				backgroundColor: [
					'rgba(255, 99, 132, 0.6)',
					'rgba(54, 162, 235, 0.6)',
					'rgba(255, 206, 86, 0.6)'
				]
			}
		]
	};

	const revenueData = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
		datasets: [
			{
				label: 'Revenue',
				data: [1200, 1900, 300, 500, 200, 300],
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1
			}
		]
	};

	const renderChart = () => {
		switch (reportType) {
			case 'sales':
				return <Bar data={salesData} />;
			case 'artworkStatus':
				return <Pie data={artworkStatusData} />;
			case 'revenue':
				return <Line data={revenueData} />;
			default:
				return null;
		}
	};

	const exportToExcel = () => {
		let data: SalesData[] | ArtworkStatusData[] | RevenueData[];
		switch (reportType) {
			case 'sales':
				data = salesData.labels.map((label, index) => ({
					Month: label,
					Sales: salesData.datasets[0].data[index]
				}));
				break;
			case 'artworkStatus':
				data = artworkStatusData.labels.map((label, index) => ({
					Status: label,
					Count: artworkStatusData.datasets[0].data[index]
				}));
				break;
			case 'revenue':
				data = revenueData.labels.map((label, index) => ({
					Month: label,
					Revenue: revenueData.datasets[0].data[index]
				}));
				break;
			default:
				data = [];
		}

		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Report');
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const dataBlob = new Blob([excelBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
		});
		FileSaver.saveAs(dataBlob, `${reportType}_report.xlsx`);
	};

	return (
		<div className='max-w-4xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6'>Reports</h1>
			<div className='flex gap-4 mb-6'>
				<Select value={reportType} onValueChange={setReportType}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Select report type' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='sales'>Sales Report</SelectItem>
						<SelectItem value='artworkStatus'>
							Artwork Status Report
						</SelectItem>
						<SelectItem value='revenue'>Revenue Report</SelectItem>
					</SelectContent>
				</Select>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Select time range' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='week'>Last Week</SelectItem>
						<SelectItem value='month'>Last Month</SelectItem>
						<SelectItem value='year'>Last Year</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Card className='mb-6'>
				<CardHeader>
					<CardTitle>
						{reportType === 'sales'
							? 'Sales Report'
							: reportType === 'artworkStatus'
							? 'Artwork Status Report'
							: 'Revenue Report'}
					</CardTitle>
				</CardHeader>
				<CardContent>{renderChart()}</CardContent>
			</Card>
			<div className='flex justify-end'>
				<Button onClick={exportToExcel}>Export to Excel</Button>
			</div>
		</div>
	);
}
