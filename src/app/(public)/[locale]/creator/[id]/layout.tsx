import { notFound } from "next/navigation";
import { getExhibitionById } from "@/service/exhibition";
import { Suspense } from "react";
import ExhibitionHeader from "../components/exhibition-header";
import ExhibitionSkeleton from "../components/exhibition-skeleton";
import ExhibitionNavigation from "../components/exhibition-navigation";
import ExhibitionContextProvider from "../context/exhibition-provider";
import { getCurrentUser } from "@/lib/session";
export default async function CreatorLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { id: string, locale: string };
}) {
    const user = await getCurrentUser();
    if (!user) {
        notFound();
    }

    const exhibitionResponse = await getExhibitionById(params.id);
    if (!exhibitionResponse.data?.exhibition) {
        notFound();
    }

    const exhibition = exhibitionResponse.data.exhibition;
    return (
        <ExhibitionContextProvider initialData={exhibition}>
            <div className="flex container mx-auto min-h-screen">
                {/* Sidebar Navigation */}
                <div className="w-64 pt-20">
                    <ExhibitionNavigation exhibition={exhibition} />
                </div>
                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <Suspense fallback={<ExhibitionSkeleton />}>
                        <ExhibitionHeader exhibition={exhibition} />
                    </Suspense>

                    <div className="p-6">{children}</div>
                </div>
            </div>
        </ExhibitionContextProvider>
    )
}