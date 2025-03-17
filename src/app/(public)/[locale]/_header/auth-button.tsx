'use client';
import HeaderButton from '@/app/(public)/[locale]/_header/components/header-button';
import { DropdownItemWithIcon } from '@/app/(public)/[locale]/_header/components/header-dropdown';
import Notification from '@/app/(public)/[locale]/_header/notification';
import SignOutItem from '@/app/(public)/[locale]/_header/sign-out-item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useAuthClient from '@/hooks/useAuth-client';
import {
	BookOpen,
	CircleUserRoundIcon,
	MessageCircle,
	Palette,
	SettingsIcon,
	UserRoundPen,
	WalletMinimal
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AuthButton() {
	const t = useTranslations('header');
	const tCommon = useTranslations('common');
	const { status, user } = useAuthClient();

	if (status === 'loading') {
		return (
			<div className='flex flex-row space-x-2'>
				<Skeleton className='w-10 h-10 rounded-full' />
				<Skeleton className='w-10 h-10 rounded-full' />
			</div>
		);
	}
	if (status === 'unauthenticated' || !user) {
		return (
			<div className='flex flex-row w-[88px] h-10 rounded-3xl bg-green-500 text-nowrap justify-center self-center'>
				<Link className='self-center' href={`/sign-in`}>
					{tCommon('signin')}
				</Link>
			</div>
		);
	}
	return (
		<div className='flex flex-row space-x-2'>
			<Notification />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<HeaderButton
						isGradient
						isArtist={user.role.includes('artist')}
						isPremium={user.role.includes('premium')}
					>
						<Avatar className="w-full h-full">
							<AvatarImage src={user.image as string} />
							<AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
						</Avatar>
					</HeaderButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-60 flex flex-col'>
					<DropdownItemWithIcon
						icon={<CircleUserRoundIcon className='w-6 h-6' />}
						text={t('profile')}
						href='/settings/profile'
					/>
					<DropdownItemWithIcon
						icon={<SettingsIcon className='w-6 h-6' />}
						text={t('settings')}
						href='/settings'
					/>
					{user.role.includes('artist') && (
						<>
							<DropdownItemWithIcon
								icon={<UserRoundPen className='w-6 h-6' />}
								text={t('artists')}
								href='/artists'
							/>
							<DropdownItemWithIcon
								icon={<Palette className='w-6 h-6' />}
								text={t('creator')}
								href='/creator'
							/>
							<DropdownItemWithIcon
								icon={<BookOpen className='w-6 h-6' />}
								text={t('my_blogs')}
								href='/my-blogs'
							/>
						</>
					)}

					<DropdownItemWithIcon
						icon={<WalletMinimal className='w-6 h-6' />}
						text={t('wallet')}
						href='/wallet'
					/>
					<DropdownItemWithIcon
						icon={<MessageCircle className='w-6 h-6' />}
						text={t('messages')}
						href='/messages'
					/>

					<Separator className='mt-6' />

					<SignOutItem dropdown />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
