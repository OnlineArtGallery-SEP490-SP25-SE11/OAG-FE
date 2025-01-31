import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

const ArtPieceSkeleton = ({ height }: { height: number }) => (
	<div className='w-full p-4 transition-all'>
		<Skeleton
			className='w-full rounded-xl mb-2'
			style={{ height: `${height}px` }}
		/>
		<div className='space-y-2 mt-2'>
			<Skeleton className='h-4 w-3/4' />
			<Skeleton className='h-4 w-1/2' />
			<Skeleton className='h-4 w-1/3' />
		</div>
	</div>
);
ArtPieceSkeleton.displayName = 'ArtPieceSkeleton';
export default memo(ArtPieceSkeleton);
