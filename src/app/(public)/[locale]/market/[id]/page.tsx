import ArtDetails from '@/app/test/market/components/art-details';
import DynamicBreadcrumb from '@/components/ui.custom/dynamic-breadcrumb';

function ArtDetailPage() {
	return (
		<div className='mx-auto'>
			<div className='px-2'>
				<div className='mt-5 ml-5'>
					<DynamicBreadcrumb/>
				</div>
			</div>
			<div className='px-5 py-3'>
				<ArtDetails />
			</div>
		</div>
	);
}

export default ArtDetailPage;
