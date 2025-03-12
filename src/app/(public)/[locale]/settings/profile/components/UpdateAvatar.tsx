import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui.custom/Avatar';
import FileUploader from '@/components/ui.custom/file-uploader';
import { updateAvatarAction } from '../actions';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface UpdateAvatarProps {
    user: {
        image: string | undefined;
        isPremium: boolean;
    };
}

const UpdateAvatar: React.FC<UpdateAvatarProps> = ({ user }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { status, data: session } = useSession();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleAvatarUpload = async (url: string | string[]) => {
        if (status !== 'authenticated') {
            toast({
                title: 'Authentication Error',
                description: 'Please sign in to update your avatar',
                variant: 'destructive'
            });
            router.push('/auth/signin');
            return;
        }

        try {
            if (session?.user?.accessToken) {
                const imageUrl = Array.isArray(url) ? url[0] : url;
                await updateAvatarAction({ url: imageUrl });
                await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
                router.push('/settings/profile'); // This triggers a revalidation of the current page
                toast({
                    title: 'Success',
                    description: 'Avatar updated successfully'
                });
                setIsDialogOpen(false); // Close dialog after successful update
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update avatar',
                variant: 'destructive'
            });
        }
    };

    return (
        <>
            {/* Clickable Avatar */}
            <div
                className="relative cursor-pointer group"
                onClick={() => setIsDialogOpen(true)}
            >
                <div className="ring-4 ring-gray-100 dark:ring-gray-800 rounded-full">
                    <Avatar
                        user={{
                            image: user.image || '',
                            isPremium: user.isPremium
                        }}
                        size="lg"
                    />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs">Change Photo</span>
                </div>
            </div>

            {/* Update Avatar Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
                            Update Profile Picture
                        </DialogTitle>
                        <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                            Upload a new profile picture
                        </p>
                    </DialogHeader>

                    <div className="py-6">
                        <div className="flex flex-col items-center space-y-4">
                            {/* Current Avatar Preview */}
                            <div className="mb-4">
                                <div className="ring-4 ring-gray-100 dark:ring-gray-800 rounded-full">
                                    <Avatar
                                        user={{
                                            image: user.image || '',
                                            isPremium: user.isPremium
                                        }}
                                        size="lg"
                                    />
                                </div>
                            </div>

                            {/* File Uploader */}
                            <div className="w-full">
                                <FileUploader
                                    onFileUpload={handleAvatarUpload}
                                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                                    maxFiles={1}
                                    maxSize={1024 * 1024 * 2}
                                />
                            </div>

                            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                                Maximum file size: 2MB
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateAvatar; 