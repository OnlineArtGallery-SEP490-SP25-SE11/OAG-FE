import ExhibitionContent from "./exhibition-content";
import { notFound } from "next/navigation";
import { getExhibitionById } from "@/service/exhibition";
import { ExhibitionStatus } from "@/types/exhibition";



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
	
	const res = await getExhibitionById(id);
	const exhibitionData = res.data?.exhibition;
	if (!exhibitionData || exhibitionData.status !== ExhibitionStatus.PUBLISHED) {
	  return notFound();
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return <ExhibitionContent exhibitionData={exhibitionData}/>;
  }