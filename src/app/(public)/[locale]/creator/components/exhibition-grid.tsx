// app/creator/components/ExhibitionGrid.tsx
import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { getExhibitions } from '@/service/exhibition';
import { getCurrentUser } from '@/lib/session';

export default async function ExhibitionGrid() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Please log in to view your exhibitions.</div>;
  }
  const exhibitionsResponse = await getExhibitions(user.accessToken);
  const exhibitions = exhibitionsResponse.data?.exhibitions ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exhibitions.map((exhibition) => (
        <Link 
          key={exhibition._id} 
          href={`/creator/${exhibition._id}/artworks`}
          className="block"
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
            <div className="relative aspect-video">
              <Image
                src={exhibition.thumbnail || exhibition.gallery.previewImage}
                alt={exhibition.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                // priority={exhibition._id === '1'}
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{exhibition.title}</h2>
                {/* <Badge variant={exhibition.status === 'published' ? 'default' : 'secondary'}>
                  {exhibition.status}
                </Badge> */}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>{exhibition.artworks?.length || 0} artworks</p>
                <p>
                  Last edited:{' '}
                  {new Date(exhibition.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}