import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
interface EditProfileDialogProps {
	name: string;
	email: string;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
	name,
	email
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<>
			<Button
				className='p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200'
				onClick={() => setIsDialogOpen(true)}
				variant='outline'
			>
				<Pencil />
			</Button>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='p-6 bg-white rounded-lg shadow-lg'>
					<DialogHeader>
						<DialogTitle className='text-lg font-semibold'>
							Edit Profile
						</DialogTitle>
						<DialogClose className='text-gray-500 hover:text-gray-700' />
					</DialogHeader>
					<div className='space-y-4'>
						<Input
							type='text'
							placeholder='Name'
							defaultValue={name}
							className='w-full'
						/>
						<Input
							type='email'
							placeholder='Email'
							defaultValue={email}
							className='w-full'
						/>
						<Button
							onClick={() => setIsDialogOpen(false)}
							className='w-full'
							variant='default'
						>
							Save
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EditProfileDialog;
