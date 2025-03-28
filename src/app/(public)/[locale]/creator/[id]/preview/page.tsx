
import { getExhibitionById } from '@/service/exhibition';
import PreviewContent from './_components/preview-content';
// import { notFound } from 'next/navigation';

export default async function PreviewPage({ params }: { params: { id: string } }) {
	const { id } = params;
	const res = await getExhibitionById(id);
	const exhibitionData = res.data?.exhibition;
	if (!exhibitionData) {
		return (
		  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
			<p className="text-destructive">Error loading exhibition content</p>
		  </div>
		);
	  }
	return (
		<PreviewContent exhibition={exhibitionData} />
	);
}
