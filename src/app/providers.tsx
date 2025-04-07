'use client';
import { ThemeProvider } from '@/components/theme-wrapper';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import QueryWrapper from '@/components/query-wrapper';
import { NotificationToaster } from '@/components/ui/NotificationToaster';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryWrapper>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange
			>
				{/* TODO add posthog */}
				<TooltipProvider>{children}</TooltipProvider>
				<Toaster />
				<NotificationToaster />
			</ThemeProvider>
		</QueryWrapper>
	);
}
