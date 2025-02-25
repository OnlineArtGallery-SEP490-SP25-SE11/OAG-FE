'use client';

import AuthButton from '@/app/(public)/[locale]/_header/auth-button';
import HeaderButton from '@/app/(public)/[locale]/_header/components/header-button';
import Settings from '@/app/(public)/[locale]/_header/settings';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ThemeSwitcher from './theme-switcher';
import ChatPage from '../chats/page';

const listMenu = [
	{ href: '/', label: 'home' },
	{ href: '/about', label: 'about' },
	{ href: '/contact', label: 'contact' },
	{ href: '/artworks', label: 'artworks' },
	{ href: '/discover', label: 'discover' },
	{ href: '/social', label: 'community' },
	{ href: '/premium', label:'premium'}
];

export default function Header({ children }: { children: React.ReactNode }) {
	const t = useTranslations('header');
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showChat, setShowChat] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const handleShowChat = (event: React.MouseEvent) => {
		event.preventDefault();  // Ngừng hành động mặc định của thẻ <a>
		setShowChat(true);
	};

	const handleHideChat = () => {
		setShowChat(false);
	};

	const scrollToChat = () => {
		if (showChat) {
			// Cuộn đến phần ChatPage
			const chatSection = document.getElementById('chat-section');
			if (chatSection) {
				chatSection.scrollIntoView({ behavior: 'smooth' });
			}
		}
	};

	return (
		<header
			className={cn(
				'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out shadow-md',
				isScrolled
					? 'bg-gray-800 bg-opacity-60 backdrop-blur-sm texture'
					: 'bg-transparent'
			)}
		>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-20'>
					<div className='flex-shrink-0'>
						<Link
							href='/'
							className={cn(
								'text-2xl font-bold tracking-tight',
								isScrolled
									? 'text-gray-900 dark:text-white'
									: 'text-gray-800 dark:text-gray-200'
							)}
						>
							<Image
								src='/logo.svg'
								alt='logo'
								width={70}
								height={70}
							/>
						</Link>
					</div>
					<nav className='hidden md:flex items-center justify-center w-full'>
						<div className='flex flex-row space-x-8'>
							{listMenu.map(({ href, label }) => (
								<Link
									key={href}
									href={href}
									className={cn(
										'transition-all duration-200 text-sm uppercase tracking-wider hover:opacity-70',
										isScrolled
											? 'text-gray-900 dark:text-white'
											: 'text-gray-800 dark:text-gray-200'
									)}
								>
									{t(label)}
								</Link>
							))}
						</div>
					</nav>
					<div className='flex flex-row space-x-4'>
						<Settings />
						<AuthButton />
					</div>
					<div className='flex flex-row space-x-2 md:hidden '>
						<HeaderButton>
							<ThemeSwitcher />
						</HeaderButton>
						<HeaderButton
							type='button'
							onClick={toggleMenu}
							aria-controls='mobile-menu'
							aria-expanded={isMenuOpen}
							className={cn(
								isScrolled
									? 'text-gray-200 hover:text-white'
									: 'text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white'
							)}
						>
							<span className='sr-only'>Open main menu</span>
							<MenuIcon className='h-6 w-6' />
						</HeaderButton>
					</div>
				</div>
			</div>
			<Separator />
			<div
				className={cn('md:hidden', isMenuOpen ? 'block' : 'hidden')}
				id='mobile-menu'
			>
				<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
					{listMenu.map(({ href, label }) => (
						<Link
							key={href}
							href={href}
							className={cn(
								'block px-3 py-2 rounded-md text-base font-medium',
								isScrolled
									? 'text-gray-200 hover:text-white hover:bg-gray-700'
									: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
							)}
						>
							{t(label)}
						</Link>
					))}
				</div>
			)}

			{/* Render các children của Header ở đây */}
			{children}

			{/* Cuộn tự động đến ChatPage nếu cần */}
			{scrollToChat()}
		</>
	);
}
