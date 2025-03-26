import { notFound } from "next/navigation";
import ExhibitionContextProvider from "./context/exhibition-provider";
import { getExhibitionById } from "@/service/exhibition";
export default async function CreatorLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { id: string, locale: string };
}) {
    const exhibitionResponse = await getExhibitionById(params.id);
    if (!exhibitionResponse.data?.exhibition) {
        notFound();
    }

    const exhibition = exhibitionResponse.data.exhibition;
    return (
        <ExhibitionContextProvider initialData={exhibition}>
            <div className="flex min-h-screen">
                {/* Sidebar Navigation */}
                {/* <ExhibitionNavigation id={params.id} /> */}

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    {/* <Suspense fallback={<ExhibitionSkeleton />}>
                        <ExhibitionHeader exhibition={exhibition} />
                    </Suspense> */}

                    <div className="p-6">{children}</div>
                </div>
            </div>
        </ExhibitionContextProvider>
    )
}