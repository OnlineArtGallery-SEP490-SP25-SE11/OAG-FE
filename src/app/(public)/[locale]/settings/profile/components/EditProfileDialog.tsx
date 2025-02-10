import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditProfileDialogProps {
	name: string;
	email: string;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
	name,
	email
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formData, setFormData] = useState({ name, email });

	const handleSubmit = () => {
		// Xử lý logic cập nhật profile ở đây
		setIsDialogOpen(false);
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
								defaultValue={formData.name}
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
								htmlFor='Address'
								className='text-sm font-medium'
							>
								Address
							</Label>
							<Input
								id='Address'
								type='Address'
								placeholder='Enter your Address'
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value
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
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							className='flex-1 bg-primary hover:bg-primary/90'
						>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EditProfileDialog;
