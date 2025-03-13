import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,

	DialogFooter
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { updateProfile } from '../queries';
import { revalidateProfilePages } from '../actions';
import { AxiosError } from 'axios';

interface EditProfileDialogProps {
	name: string;
	address: string;
}

interface ApiErrorResponse {
	message: string;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
	name,
	address
}) => {
	const { data: session, status } = useSession();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formData, setFormData] = useState({ name, address });
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const router = useRouter();

	const handleSubmit = async () => {
		if (status !== 'authenticated') {
			toast({
				title: 'Authentication Error',
				description: 'Please sign in to update your profile',
				variant: 'destructive'
			});
			router.push('/auth/signin');
			return;
		}

		try {
			setIsLoading(true);

			await updateProfile(formData, session?.user?.accessToken);

			// Invalidate and refetch user data
			await queryClient.invalidateQueries({ queryKey: ['currentUser'] });

			// Call server action to revalidate pages
			await revalidateProfilePages();

			toast({
				title: 'Success',
				description: 'Profile updated successfully'
			});
			setIsDialogOpen(false);
		} catch (error) {
			console.error('Error updating profile:', error);

			if ((error as AxiosError).response?.status === 401) {
				toast({
					title: 'Authentication Error',
					description: 'Your session has expired. Please sign in again.',
					variant: 'destructive'
				});
				router.push('/auth/signin');
				return;
			}

			toast({
				title: 'Error',
				description: ((error as AxiosError<ApiErrorResponse>).response?.data?.message) || 'Failed to update profile',
				variant: 'destructive'
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Button
				className='flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors duration-200'
				onClick={() => setIsDialogOpen(true)}
				variant='outline'
				size='sm'
			>
				<Pencil className='w-4 h-4' />
				<span>Edit Profile</span>
			</Button>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='sm:max-w-[425px] bg-white dark:bg-gray-900'>
					<DialogHeader className='space-y-3'>
						<DialogTitle className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
							Edit Profile
						</DialogTitle>
					</DialogHeader>

					<div className='space-y-6 py-4'>
						<div className='space-y-2'>
							<Label
								htmlFor='name'
								className='text-sm font-medium'
							>
								Name
							</Label>
							<Input
								id='name'
								type='text'
								placeholder='Enter your name'
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value
									})
								}
								className='w-full'
							/>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='address'
								className='text-sm font-medium'
							>
								Address
							</Label>
							<Input
								id='address'
								type='text'
								placeholder='Enter your address'
								value={formData.address}
								onChange={(e) =>
									setFormData({
										...formData,
										address: e.target.value
									})
								}
								className='w-full'
							/>
						</div>
					</div>

					<DialogFooter className='flex gap-3'>
						<Button
							variant='outline'
							onClick={() => setIsDialogOpen(false)}
							className='flex-1'
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							className='flex-1 bg-primary hover:bg-primary/90'
							disabled={isLoading}
						>
							{isLoading ? 'Saving...' : 'Save Changes'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EditProfileDialog;
