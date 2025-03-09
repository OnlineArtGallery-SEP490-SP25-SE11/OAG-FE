import { getExhibitions } from "@/service/gallery";
import ExhibitionContent from "./exhibition-content";
import { notFound } from "next/navigation";



type PageProps = {
	params: {
	  locale: string;
	  id: string;
	};
	searchParams: Record<string, string | string[] | undefined>;
  };
  
  export default async function ExhibitionPage({ params }: PageProps) {
	// Correctly access id from params object
	const { id } = params;
	
	console.log('ExhibitionPage params:', params);  
	console.log('ExhibitionPage id:', id); // This will now log the ID correctly
	
	const exhibitionData = await getExhibitions(id);
	if (!exhibitionData) {
	  return notFound();
	}
	return <ExhibitionContent exhibitionData={exhibitionData} />;
  }