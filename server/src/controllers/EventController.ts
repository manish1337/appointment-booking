import { Request, Response } from "express";
import { DateTime } from "luxon";
import { Timestamp } from "firebase/firestore";
import { CalendarService } from "../services/CalendarService";
import { EventModel } from "../models/EventModel";
import { CalendarConfig } from "../config/calendar.config";
import { EventStatus } from "../models/Event";

export class EventController {
  static async getFreeSlots(req: Request, res: Response) {
    try {
      const { date, timezone } = req.query;
      const dateObj = DateTime.fromISO(date as string, {
        zone: (timezone as string) || CalendarConfig.DEFAULT_TIMEZONE,
      });
      const now = DateTime.now();

      if (!dateObj.isValid) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      if (dateObj.startOf("day") < now.startOf("day")) {
        return res
          .status(400)
          .json({ error: "Cannot fetch slots for past dates" });
      }

      const freeSlots = await CalendarService.getFreeSlots(
        dateObj,
        (timezone as string) || CalendarConfig.DEFAULT_TIMEZONE
      );

      res.json(freeSlots);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createEvent(req: Request, res: Response) {
    try {
      const { dateTime, duration, userId, timezone } = req.body;

      const startTime = DateTime.fromISO(dateTime, {
        zone: timezone || CalendarConfig.DEFAULT_TIMEZONE,
      });
      if (!startTime.isValid) {
        return res.status(400).json({ error: "Invalid datetime format" });
      }

      if (startTime.startOf("day") < DateTime.now().startOf("day")) {
        return res
          .status(400)
          .json({ error: "Cannot create events for past dates" });
      }

      const endTime = startTime.plus({ minutes: duration });

      const event = await EventModel.createEvent({
        startTime: Timestamp.fromDate(startTime.toJSDate()),
        endTime: Timestamp.fromDate(endTime.toJSDate()),
        duration,
        userId,
        status: EventStatus.SCHEDULED,
      });

      res.status(200).json(event);
    } catch (error) {
      if (error instanceof Error && error.message === "Slot already booked") {
        return res.status(422).json({ error: "Slot already booked" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getEvents(req: Request, res: Response) {
    try {
      const { startDate, endDate, timezone } = req.query;
      const start = DateTime.fromISO(startDate as string, {
        zone: (timezone as string) || CalendarConfig.DEFAULT_TIMEZONE,
      });
      const end = DateTime.fromISO(endDate as string, {
        zone: (timezone as string) || CalendarConfig.DEFAULT_TIMEZONE,
      });

      if (!start.isValid || !end.isValid) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      if (start.startOf("day") < DateTime.now().startOf("day")) {
        return res
          .status(400)
          .json({ error: "Cannot fetch events for past dates" });
      }

      const events = await EventModel.getEvents(start, end);
      res.json(events);
    } catch (error) {
      if (error instanceof Error && error.message === "Slot already booked") {
        return res.status(422).json({ error: "Slot already booked" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
