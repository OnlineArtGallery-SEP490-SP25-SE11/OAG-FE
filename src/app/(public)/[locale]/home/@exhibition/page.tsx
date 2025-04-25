import { getTrendingExhibitions, getNewExhibitions } from '@/service/home';
import { ExhibitionSection } from './components/exhibition-section';

export default async function ExhibitionsPage() {
  const [trendingResponse, newExhibitionsResponse] = await Promise.all([
    getTrendingExhibitions(),
    getNewExhibitions()
  ]);
  
//   console.log('Trending Response:', trendingResponse);
//   console.log('New Exhibitions Response:', newExhibitionsResponse);
  
  const trending = trendingResponse.data?.exhibitions || [];
  const newExhibitions = newExhibitionsResponse.data?.exhibitions || [];

  // Log the final data being passed to components
  console.log('Trending Exhibitions:', trending);
  console.log('New Exhibitions:', newExhibitions);

  return (
    <div className="w-full bg-white py-24">
      <ExhibitionSection
        title="Trending art exhibitions"
        exhibitions={trending}
      />
      <ExhibitionSection 
        title="New art exhibitions"
        exhibitions={newExhibitions}
      />
    </div>
  );
}