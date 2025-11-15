import EventDetailComponent from "@/components/EventDetails";
import { Suspense } from "react";

type ParamsType = {
    params: Promise<{ slug: string }>
}

const EventDetail = async ({ params }: ParamsType) => {
    const slug = params.then((p) => p.slug)

    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <EventDetailComponent params={slug} />
            </Suspense>
        </main>
    )
};

export default EventDetail