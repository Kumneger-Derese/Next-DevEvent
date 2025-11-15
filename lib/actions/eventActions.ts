"use server";

import { Event } from "@/database";
import connectDB from "../db";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });
    const similarEvent = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .select("-__v -_id")
      .lean();

    return similarEvent;
  } catch {
    return [];
  }
};
