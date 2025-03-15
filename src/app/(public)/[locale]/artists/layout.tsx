'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Crown, FolderOpen, Image, Upload, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface NavItem {
	href: string;
	icon: React.ElementType;
	label: string;
	section?: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [isMobile, setIsMobile] = useState(false);

	const navItems: NavItem[] = useMemo(
		() => [
			{ 
				section: 'Main',
				href: '/artists', 
				icon: BarChart, 
				label: 'Dashboard' 
			},
			{ 
				section: 'Content',
				href: '/artists/upload', 
				icon: Upload, 
				label: 'Upload Artwork' 
			},
			{ 
				section: 'Content',
				href: '/artists/manage', 
				icon: Image, 
				label: 'Manage Artworks' 
			},
			{
				section: 'Content',
				href: '/artists/collections',
				icon: FolderOpen,
				label: 'Collections'
			},
			{ 
				section: 'Account',
				href: '/artists/premium', 
				icon: Crown, 
				label: 'Premium' 
			},
			{
				section: 'Account',
				href: '/artists/settings',
				icon: Settings,
				label: 'Settings'
			}
		],
		[]
	);

	const isPathActive = useCallback(
		(itemPath: string) => {
			const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, '');
			const normalizedPath = pathWithoutLocale || '/';
			return normalizedPath === itemPath;
		},
		[pathname]
	);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			setIsMobile(width < 768);
		};

		let timeoutId: ReturnType<typeof setTimeout>;
		const debouncedResize = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(handleResize, 100);
		};

		handleResize();
		window.addEventListener('resize', debouncedResize);
		return () => {
			window.removeEventListener('resize', debouncedResize);
			clearTimeout(timeoutId);
		};
	}, []);

	const NavLink = ({
		item,
		mobile = false
	}: {
		item: NavItem;
		mobile?: boolean;
	}) => {
		const isActive = isPathActive(item.href);

		return (
			<motion.div
				initial={{ opacity: 0, x: mobile ? 0 : -10 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.97 }}
				className='relative w-full'
			>
				<Link
					href={item.href}
					className={`
            flex items-center gap-3 relative 
            ${
				mobile
					? 'p-2 rounded-full w-12 h-12 justify-center'
					: 'px-4 py-3 rounded-lg w-full'
			}
            transition-all duration-300 ease-in-out
            ${isActive 
				? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-700 dark:text-teal-300' 
				: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
			}
          `}
				>
					<item.icon
						className={`${mobile ? 'h-6 w-6' : 'h-5 w-5'} ${
							isActive ? 'text-teal-600 dark:text-teal-400' : ''
						}`}
					/>
					{!mobile && (
						<span className={`truncate font-medium ${isActive ? 'font-semibold' : ''}`}>
							{item.label}
						</span>
					)}
					{isActive && (
						<motion.div
							layoutId='activeIndicator'
							className={`absolute ${
								mobile
									? 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-8 h-1 bg-teal-500 rounded-t-full'
									: 'left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full'
							}`}
							initial={false}
							transition={{
								type: 'spring',
								stiffness: 400,
								damping: 30
							}}
						/>
					)}
				</Link>
			</motion.div>
		);
	};

	const asideVariants = {
		hidden: { x: -256, opacity: 0 },
		visible: {
			x: 0,
			opacity: 1,
			transition: { duration: 0.4, ease: 'easeOut' }
		}
	};

	// Group items by section
	const groupedNavItems = useMemo(() => {
		const grouped: Record<string, NavItem[]> = {};
		navItems.forEach(item => {
			const section = item.section || 'Other';
			if (!grouped[section]) {
				grouped[section] = [];
			}
			grouped[section].push(item);
		});
		return grouped;
	}, [navItems]);

	return (
		<div className='flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			<motion.aside
				variants={asideVariants}
				initial='hidden'
				animate={isMobile ? 'hidden' : 'visible'}
				className='fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 z-20 md:block hidden'
			>
				<div className='flex flex-col h-full'>
					{/* Empty space for header overlay (80px) */}
					<div className='h-20'></div>
					
					<div className='pt-6 pb-5 px-6 border-b border-gray-100 dark:border-gray-700'>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.1 }}
							className='flex items-center space-x-3'
						>
							<div className='w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center'>
								<Image className='w-6 h-6 text-white' />
							</div>
							<div>
								<h1 className='text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent'>
									Art Manager
								</h1>
								<p className='text-xs text-slate-500 dark:text-slate-400'>
									Artist Portal
								</p>
							</div>
						</motion.div>
					</div>
					<nav className='flex-1 px-4 py-5 space-y-6 overflow-y-auto'>
						{Object.entries(groupedNavItems).map(([section, items]) => (
							<div key={section} className='space-y-1'>
								<h3 className='text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 px-4 mb-2'>
									{section}
								</h3>
								{items.map((item) => (
									<NavLink key={item.href} item={item} />
								))}
							</div>
						))}
					</nav>
				</div>
			</motion.aside>

			<nav className='fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-xl border-t border-gray-200 dark:border-gray-700 z-20 md:hidden'>
				<div className='flex justify-around items-center px-4 py-2'>
					{navItems.slice(0, 5).map((item) => (
						<NavLink key={item.href} item={item} mobile />
					))}
				</div>
			</nav>

			<main
				className={`flex-1 p-3 md:p-6 transition-all duration-300 ${
					isMobile ? 'pb-16 md:pb-0' : 'md:ml-64'
				}`}
			>
				<div className='max-w-6xl mx-auto space-y-4 md:space-y-6'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						{children}
					</motion.div>
				</div>
			</main>
		</div>
	);
}