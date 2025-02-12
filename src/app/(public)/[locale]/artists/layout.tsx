'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	BarChart,
	FolderOpen,
	Image,
	Upload,
	Sun,
	Moon,
	Crown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import type React from 'react';

interface NavItem {
	href: string;
	icon: React.ElementType;
	label: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();

	const navItems: NavItem[] = [
		{ href: '/artists', icon: BarChart, label: 'Dashboard' },
		{ href: '/artists/upload', icon: Upload, label: 'Upload Artwork' },
		{ href: '/artists/manage', icon: Image, label: 'Manage Artworks' },
		{ href: '/artists/premium', icon: Crown, label: 'Premium' },
		{
			href: '/artists/collections',
			icon: FolderOpen,
			label: 'Collections'
		}	];

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<div className='flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
			<aside className='w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200'>
				<div className='p-4 flex items-center justify-between'>
					<motion.h1
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'
					>
						Art Manager
					</motion.h1>
					<Button
						variant='ghost'
						size='icon'
						onClick={toggleTheme}
						className='rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'
					>
						<Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
						<Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
						<span className='sr-only'>Toggle theme</span>
					</Button>
				</div>
				<nav className='mt-6 space-y-1 px-2'>
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<motion.div
								key={item.href}
								whileHover={{ x: 4 }}
								whileTap={{ scale: 0.98 }}
							>
								<Link
									href={item.href}
									className={`
                          flex items-center px-4 py-3 rounded-lg
                          transition-colors duration-150 ease-in-out
                          ${
								isActive
									? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
									: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
							}
                        `}
								>
									<item.icon
										className={`
                          mr-3 h-5 w-5 transition-colors
                          ${
								isActive
									? 'text-primary'
									: 'text-gray-500 dark:text-gray-400'
							}
                        `}
									/>
									<span className='text-sm font-medium'>
										{item.label}
									</span>
									{isActive && (
										<motion.div
											layoutId='activeNav'
											className='absolute left-0 w-1 h-8 bg-primary rounded-r-full'
											initial={false}
											transition={{
												type: 'spring',
												stiffness: 380,
												damping: 30
											}}
										/>
									)}
								</Link>
							</motion.div>
						);
					})}
				</nav>
			</aside>
			<main className='flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900'>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						{children}
					</motion.div>
				</div>
			</main>
		</div>
	);
}
