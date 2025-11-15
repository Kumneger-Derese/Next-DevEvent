import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/db";
import {Event} from "@/database";

type RouteParams = {
    params: Promise<{ slug: string }>
}

export async function GET(
    req: NextRequest,
    {params}: RouteParams
): Promise<NextResponse> {
    try {
        await connectDB()

        const {slug} = await params;

        //validate slug parameter
        if (!slug || slug.trim() === '') {
            return NextResponse.json(
                {message: "Invalid ot missing slug parameter"},
                {status: 404}
            )
        }

        //sanitize slug
        const sanitizedSlug = slug.trim().toLowerCase()

        //query event by slug
        const event = await Event.findOne({slug: sanitizedSlug}).lean()

        // Handle not found
        if (!event) {
            return NextResponse.json(
                {message: `Event with slug '${sanitizedSlug}' not found`},
                {status: 404}
            )
        }

        //return successful data
        return NextResponse.json(
            {message: "Event fetched successfully.", event: event},
            {status: 200}
        )

    } catch (e) {
        return NextResponse.json(
            {message: "Fetching event detail failed.", error: e},
            {status: 500}
        )
    }
}