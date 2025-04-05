import { getExhibitionById } from "@/service/exhibition";
import ResultContent from "./_components/result-content";
import { getCurrentUser } from "@/lib/session";
import { checkIsArtistPremium } from "@/service/user";
import { notFound } from "next/navigation";


export default async function ResultPage({
	params
}: {
	params: { id: string; locale: string }
}) {


	const { id } = params;
	const resExhibition = await getExhibitionById(id);
	const exhibition = resExhibition.data?.exhibition;

	//check is artist prenium
	const user = await getCurrentUser();
	if (!user) {
		return notFound();
	}
	const resPremium = await checkIsArtistPremium(user!.accessToken);
	const isPremium = resPremium.data?.result;
	return (
		<ResultContent exhibition={exhibition!} isPremium={isPremium!} />
	)
}