import { DateTime } from "luxon";
import { CalendarConfig } from "../config/calendar.config";
import { EventModel } from "../models/EventModel";

export class CalendarService {
  static async getFreeSlots(
    date: DateTime,
    timezone: string
  ): Promise<string[]> {
    // Get all events for the day
    const startOfDay = date.startOf("day");
    const endOfDay = date.endOf("day");
    const events = await EventModel.getEvents(startOfDay, endOfDay);

    // Generate all possible slots
    const slots = this.generateTimeSlots(date, timezone);

    // Remove booked slots
    const bookedTimes = events.map((event) =>
      DateTime.fromJSDate(event.startTime.toDate())
        .setZone(timezone)
        .toFormat("yyyy-MM-dd'T'HH:mm:ss")
    );
    return slots.filter((slot) => !bookedTimes.includes(slot));
  }

  private static generateTimeSlots(date: DateTime, timezone: string): string[] {
    const slots: string[] = [];
    let currentTime = date.setZone(timezone).set({
      hour: CalendarConfig.START_HOURS,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const endTime = currentTime.set({
      hour: CalendarConfig.END_HOURS,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    while (currentTime < endTime) {
      slots.push(currentTime.toFormat("yyyy-MM-dd'T'HH:mm:ss"));
      currentTime = currentTime.plus({ minutes: CalendarConfig.SLOT_DURATION });
    }

    return slots;
  }
}
