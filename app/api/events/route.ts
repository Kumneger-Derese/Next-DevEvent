import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { Event } from "@/database";
import connectDB from "@/lib/db";

//Todo: get all events
export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Event fetch successfully", events },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Fetching events failed", error: e },
      { status: 500 }
    );
  }
}

//Todo: create event
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData);
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid JSON data format", e },
        { status: 400 }
      );
    }

    const tags = await JSON.parse(formData.get("tags") as string);
    const agenda = await JSON.parse(formData.get("agenda") as string);

    const file = formData.get("image") as File;

    if (!file)
      return NextResponse.json(
        { message: "Image file is required." },
        { status: 400 }
      );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            responseType: "image",
            folder: "DevEvent",
          },
          (err, results) => {
            if (err) return reject(err);

            resolve(results);
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create({ ...event, tags, agenda });

    return NextResponse.json(
      { message: "Event Created", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ message: "Event Creation field", error });
  }
}
