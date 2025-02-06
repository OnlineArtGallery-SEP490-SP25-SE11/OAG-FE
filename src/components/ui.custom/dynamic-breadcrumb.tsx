'use client';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Function to parse URL path and filter out language codes and unnecessary segments
const parseBreadcrumbPaths = (path: string) => {
	// Remove leading and trailing slashes, split the path
	const segments = path.replace(/^\/|\/$/g, '').split('/');

	// Filter out language codes (en, vn, etc.) - assuming 2-letter language codes
	const filteredSegments = segments.filter(
		(segment) => segment.length !== 2 || !/^[a-z]{2}$/.test(segment)
	);

	return filteredSegments;
};

interface DynamicBreadcrumbProps {
	currentPath: string;
	className?: string;
	homeLabel?: string;
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({
	currentPath,
	className = '',
	homeLabel = ''
}) => {
	const pathSegments = parseBreadcrumbPaths(currentPath);

	return (
		<Breadcrumb className={`w-full ${className}`}>
			<BreadcrumbList className='flex items-center space-x-2 text-base font-inter'>
				{/* Always add Home as the first item */}
				<BreadcrumbItem>
					<BreadcrumbLink
						asChild
						className='text-foreground/70 hover:text-foreground transition-colors duration-200 ease-in-out'
					>
						<Link
							href='/'
							className='flex items-center gap-1.5 capitalize hover:underline font-semibold tracking-tight italic text-2xl'
						>
							<Home className='w-6 h-6' />
							{homeLabel}
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{pathSegments.length > 0 && (
					<BreadcrumbSeparator className='text-foreground/50 mx-1 select-none text-2xl font-medium'>
						/
					</BreadcrumbSeparator>
				)}

				{pathSegments.map((segment, index) => {
					// Create cumulative path for each breadcrumb item
					const path =
						'/' + pathSegments.slice(0, index + 1).join('/');

					// Last segment is the current page
					if (index === pathSegments.length - 1) {
						return (
							<BreadcrumbItem key={segment}>
								<BreadcrumbPage className='font-semibold text-foreground capitalize tracking-tight italic text-2xl'>
									{segment}
								</BreadcrumbPage>
							</BreadcrumbItem>
						);
					}

					return (
						<React.Fragment key={segment}>
							<BreadcrumbItem>
								<BreadcrumbLink
									asChild
									className='text-foreground/70 hover:text-foreground transition-colors duration-200 ease-in-out'
								>
									<Link
										href={path}
										className='capitalize hover:underline tracking-tight italic font-semibold text-2xl'
									>
										{segment}
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							{index < pathSegments.length - 1 && (
								<BreadcrumbSeparator className='text-foreground/50 mx-1 select-none text-2xl font-medium'>
									/
								</BreadcrumbSeparator>
							)}
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default DynamicBreadcrumb;

// Example usage:
// <DynamicBreadcrumb currentPath="/en/test/demo" />
// <DynamicBreadcrumb currentPath="/vn/test/market" />
// <DynamicBreadcrumb currentPath="/test/abc" />
// <DynamicBreadcrumb currentPath="/test/abc" homeLabel="Trang chủ" />
