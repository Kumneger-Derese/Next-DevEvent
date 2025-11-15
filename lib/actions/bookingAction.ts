"use server";

import { Booking } from "@/database";
import connectDB from "../db";

type BookActionParams = {
  eventId: string;
  slug: string;
  email: string;
};

export const createBooking = async ({
  eventId,
  slug,
  email,
}: BookActionParams) => {
  try {
    await connectDB();
    await Booking.create({ eventId, slug, email });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
