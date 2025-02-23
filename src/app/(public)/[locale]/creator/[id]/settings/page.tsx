import {
	Settings2,
	Languages,
	Palette,
	Globe,
	MoreHorizontal,
	Check,
	Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
	return (
		<div className='max-w-5xl mx-auto'>
			{/* Header Section */}
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-4 flex items-center gap-2'>
					<Settings2 className='w-8 h-8' />
					Settings
				</h1>
				<p className='text-muted-foreground'>
					Create language versions for your international audience,
					set colors for your exhibition, enable or disable hotspot
					buttons, adjust your gallery&apos;s lighting and materials,
					enable or disable Infinity Room, upload a floor logo, set
					tone mapping, and fog.
				</p>
			</div>

			<div className='grid gap-8'>
				{/* Languages Section */}
				<Card className='p-6'>
					<h2 className='text-xl font-semibold mb-6 flex items-center gap-2'>
						<Globe className='w-6 h-6' />
						Languages
					</h2>
					<div className='space-y-4'>
						{/* Default Language */}
						<div className='flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'>
							<div className='flex items-center gap-4'>
								<span className='text-lg font-medium min-w-[2.5rem]'>
									EN
								</span>
								<span>English</span>
								<span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium'>
									Default
								</span>
							</div>
							<LanguageAction isDefault />
						</div>

						{/* Additional Language */}
						<div className='flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'>
							<div className='flex items-center gap-4'>
								<span className='text-lg font-medium min-w-[2.5rem]'>
									VI
								</span>
								<span>Vietnamese</span>
							</div>
							<LanguageAction />
						</div>

						<Button
							className='w-full mt-4'
							variant='outline'
							size='lg'
						>
							<Languages className='w-4 h-4 mr-2' />
							Add New Language
						</Button>
					</div>
				</Card>

				{/* Colors Section */}
				<Card className='p-6'>
					<h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
						<Palette className='w-6 h-6' />
						Theme Colors
					</h2>
					<p className='text-muted-foreground mb-6'>
						Customize your exhibition&apos;s visual appearance.
						Available only on paid plans.
					</p>

					<div className='space-y-6'>
						{/* Color Inputs */}
						{[
							{
								label: 'Foreground Color',
								description:
									'Defines the color for text, links and buttons'
							},
							{
								label: 'Background Color',
								description: 'Defines the background color'
							},
							{
								label: 'Highlight Color',
								description:
									'Defines the hover/focus state color'
							}
						].map((item) => (
							<div key={item.label}>
								<Label className='mb-2 block'>
									{item.label}
								</Label>
								<div className='flex gap-4 items-center'>
									<div className='relative'>
										<Input
											type='color'
											disabled
											className='w-20 h-10 cursor-not-allowed'
											aria-label={item.label}
										/>
										<div className='absolute inset-0 bg-muted/10' />
									</div>
									<span className='text-sm text-muted-foreground'>
										{item.description}
									</span>
								</div>
							</div>
						))}

						<Alert className='mt-6 bg-yellow-100'>
							<AlertDescription>
								Custom colors are not available on your current
								plan. Please upgrade your plan to customize the
								look of all your exhibitions.
							</AlertDescription>
						</Alert>
					</div>
				</Card>
			</div>
		</div>
	);
}

const LanguageAction = ({ isDefault }: { isDefault?: boolean }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='hover:bg-background/80'
				>
					<MoreHorizontal className='w-4 h-4' />
					<span className='sr-only'>Language options</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-48'>
				{!isDefault && (
					<DropdownMenuItem>
						<Check className='w-4 h-4 mr-2' />
						Set as default
					</DropdownMenuItem>
				)}
				<DropdownMenuItem className='text-destructive'>
					<Trash2 className='w-4 h-4 mr-2' />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
