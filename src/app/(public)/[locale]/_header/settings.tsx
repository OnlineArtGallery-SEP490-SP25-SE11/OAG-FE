import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import HeaderButton from '@/app/(public)/[locale]/_header/components/header-button';
import { SettingsIcon } from 'lucide-react';
import LanguageSwitcher from '@/app/(public)/[locale]/_header/language-switcher';
import ThemeSwitcher from '@/app/(public)/[locale]/_header/theme-switcher';
import { useTranslations } from 'next-intl';

export default function Settings() {
	const t = useTranslations('header');
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<HeaderButton
					className='backdrop-blur-md bg-opacity-40'
					aria-label='Settings'
				>
					<SettingsIcon className='h-6 w-6' />
				</HeaderButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-48'>
				<DropdownMenuLabel className='font-semibold'>
					{t('settings')}
				</DropdownMenuLabel>
				<LanguageSwitcher dropdown />
				<ThemeSwitcher dropdown />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
