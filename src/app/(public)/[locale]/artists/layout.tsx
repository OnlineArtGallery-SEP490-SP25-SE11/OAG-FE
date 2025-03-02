'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Crown, FolderOpen, Image, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface NavItem {
	href: string;
	icon: React.ElementType;
	label: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [isMobile, setIsMobile] = useState(false);

	const navItems: NavItem[] = useMemo(
		() => [
			{ href: '/artists', icon: BarChart, label: 'Dashboard' },
			{ href: '/artists/upload', icon: Upload, label: 'Upload Artwork' },
			{ href: '/artists/manage', icon: Image, label: 'Manage Artworks' },
			{ href: '/artists/premium', icon: Crown, label: 'Premium' },
			{
				href: '/artists/collections',
				icon: FolderOpen,
				label: 'Collections'
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
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
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
          ${
				isActive
					? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md'
					: 'text-emerald-700 dark:text-emerald-200 hover:bg-emerald-100/70 dark:hover:bg-teal-900/30'
			}
        `}
				>
					<item.icon
						className={`
            ${mobile ? 'h-5 w-5' : 'h-5 w-5'}
            ${isActive ? 'text-white' : 'text-teal-600 dark:text-teal-400'}
          `}
					/>

					{!mobile && (
						<span className='truncate font-medium'>
							{item.label}
						</span>
					)}

					{isActive && !mobile && (
						<motion.div
							layoutId='activeIndicator'
							className='absolute left-0 top-0 w-1.5 h-full bg-teal-300 rounded-r-full'
							initial={false}
							transition={{
								type: 'spring',
								stiffness: 400,
								damping: 30
							}}
						/>
					)}

					{isActive && mobile && (
						<motion.div
							layoutId='activeIndicatorMobile'
							className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-cyan-300 rounded-t-full'
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
		hidden: { x: -256 },
		visible: { x: 0, transition: { duration: 0.4, ease: 'easeOut' } }
	};

	return (
		<div className='flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			{/* Aside (Desktop) */}
			<motion.aside
				variants={asideVariants}
				initial='hidden'
				animate={isMobile ? 'hidden' : 'visible'}
				className='fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 z-20 md:block hidden'
			>
				<div className='flex flex-col h-full'>
					<div className='pt-[80px] px-4 pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800'>
						<motion.h1
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.1 }}
							className='text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent'
						>
							Art Manager
						</motion.h1>
					</div>
					<nav className='flex-1 px-3 py-6 space-y-2 overflow-y-auto'>
						{navItems.map((item) => (
							<NavLink key={item.href} item={item} />
						))}
					</nav>
				</div>
			</motion.aside>

			{/* Mobile Nav (Bottom Bar) */}
			<nav className='fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-xl border-t border-gray-200 dark:border-gray-700 z-20 md:hidden'>
				<div className='flex justify-start px-2 py-2 space-x-2 overflow-x-auto'>
					{navItems.map((item) => (
						<NavLink key={item.href} item={item} mobile />
					))}
				</div>
			</nav>

			{/* Main */}
			<main
				className={`flex-1 p-3 md:p-6 transition-all duration-300 ${
					isMobile ? 'pb-16' : 'ml-64'
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
