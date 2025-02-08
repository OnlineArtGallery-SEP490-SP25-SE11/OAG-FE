'use client';

import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import ThemeSwitcher from './theme-switcher';
import AuthButton from '@/app/(public)/[locale]/_header/auth-button';
import Settings from '@/app/(public)/[locale]/_header/settings';
import { Separator } from '@/components/ui/separator';
import HeaderButton from '@/app/(public)/[locale]/_header/components/header-button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import ChatPage from '../chats/page';

const listMenu = [
	{ href: '/', label: 'home' },
	{ href: '/about', label: 'about' },
	{ href: '/contact', label: 'contact' }
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
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out shadow-md ${isScrolled ? 'bg-gray-800 bg-opacity-60 backdrop-blur-sm texture' : 'bg-transparent'}`}
			>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						<div className='flex-shrink-0'>
							<Link href='/' className={cn('text-2xl font-bold', isScrolled ? 'text-white' : 'text-gray-800 dark:text-gray-200')}>
								<div className='relative w-14 h-14'>
									<Image src='/logo.svg' alt='logo' className='object-fill dark:invert dark:brightness-0 dark:contrast-200' fill priority />
								</div>
							</Link>
						</div>
						<nav className='hidden md:flex items-center w-full space-x-5'>
							<div className='flex flex-row space-x-3 justify-start flex-grow'>
								{listMenu.map(({ href, label }) => (
									<a
										key={href}
										href={href}
										onClick={label === 'contact' ? handleShowChat : undefined}
										className={cn('transition-colors duration-200', isScrolled ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white')}
									>
										{t(label)}
									</a>
								))}
							</div>
							<div className='flex flex-row space-x-2'>
								<Settings />
								<AuthButton />
							</div>
						</nav>

						<div className='flex flex-row space-x-2 md:hidden'>
							<HeaderButton>
								<ThemeSwitcher />
							</HeaderButton>
							<HeaderButton type='button' onClick={toggleMenu} aria-controls='mobile-menu' aria-expanded={isMenuOpen}>
								<span className='sr-only'>Open main menu</span>
								<MenuIcon className='h-6 w-6' />
							</HeaderButton>
						</div>
					</div>
				</div>
				<Separator />
			</header>

			{/* Hiển thị ChatPage dưới phần menu nếu nhấn Contact */}
			{showChat && (
				<div id="chat-section" className="mt-20">
					<ChatPage />
					<button onClick={handleHideChat} className="text-gray-500 mt-4">Hide Chat</button>
				</div>
			)}

			{/* Render các children của Header ở đây */}
			{children}

			{/* Cuộn tự động đến ChatPage nếu cần */}
			{scrollToChat()}
		</>
	);
}
