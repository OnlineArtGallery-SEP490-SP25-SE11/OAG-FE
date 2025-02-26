'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import { cancelPublicRequestAction, createPublicRequestAction } from './action';
import { useTranslations } from 'next-intl';
import { BlogStatus } from '@/utils/enums';
import { useServerAction } from 'zsa-react';

interface PublishButtonProps {
    blogId: string;
    initialStatus: BlogStatus;
}

const RequestPublishButton = ({ blogId, initialStatus }: PublishButtonProps) => {
    const [status, setStatus] = useState(initialStatus);
    const router = useRouter();
    const { toast } = useToast();
    const tBlog = useTranslations('blog');
    const tCommon = useTranslations('common');

    const { execute: executeCreate, isPending: isCreatePending } = useServerAction(
        createPublicRequestAction,
        {
            onSuccess: () => {
                setStatus(BlogStatus.PENDING_REVIEW);
                toast({
                    title: tCommon('success'),
                    description: tBlog('create_request'),
                    variant: 'success'
                });
                router.refresh();
            },
            onError: () => {
                toast({
                    title: tCommon('error'),
                    description: tBlog('update_status_error'),
                    variant: 'destructive'
                });
            }
        }
    );

    const { execute: executeCancel, isPending: isCancelPending } = useServerAction(
        cancelPublicRequestAction,
        {
            onSuccess: () => {
                setStatus(BlogStatus.DRAFT);
                toast({
                    title: tCommon('success'),
                    description: tBlog('cancel_request'),
                    variant: 'success'
                });
                router.refresh();
            },
            onError: () => {
                toast({
                    title: tCommon('error'),
                    description: tBlog('update_status_error'),
                    variant: 'destructive'
                });
            }
        }
    );

    const isPending = isCreatePending || isCancelPending;

    const handlePublishToggle = async () => {
        if (status === BlogStatus.PENDING_REVIEW) {
            executeCancel({ id: blogId });
        } else {
            executeCreate({ id: blogId });
        }
    };

    return (
        <Button
            className={`text-black rounded-full py-2 px-4
                ${status === BlogStatus.PENDING_REVIEW
                    ? 'bg-yellow-500 border border-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 dark:border-yellow-700'
                    : 'bg-secondary border border-secondary hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/80 dark:border-secondary'
                }
                ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={handlePublishToggle}
            disabled={isPending}
        >
            {isPending ? (
                <LoaderCircle className='animate-spin' />
            ) : status === BlogStatus.DRAFT ? (
                tBlog('public')
            ) : status === BlogStatus.PENDING_REVIEW ? (
                tBlog('cancel')
            ) : null}
        </Button>
    );
};

export default RequestPublishButton;