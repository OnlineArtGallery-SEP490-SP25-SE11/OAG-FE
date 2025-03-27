import { getExhibitionById } from '@/service/exhibition';
import { ContentSettings } from './_components/content-settings';

export default async function ContentPage({
  params
}: {
  params: { id: string; locale: string }
}) {
  const res = await getExhibitionById(params.id);
  const exhibition = res.data?.exhibition;

  if (!exhibition) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-destructive">Error loading exhibition content</p>
      </div>
    );
  }

  return <ContentSettings exhibition={exhibition} />;
}