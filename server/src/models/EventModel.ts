import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    Timestamp,
    FirestoreDataConverter,
  } from "firebase/firestore";
  import { db } from "../config/firebase";
  import { Event, EventStatus } from "./Event";
  import { DateTime } from "luxon";
  
  export class EventModel {
    private static COLLECTION = "events";
    private static converter: FirestoreDataConverter<Event>;
  
    static async getEvents(
      startDate: DateTime,
      endDate: DateTime
    ): Promise<Event[]> {
      const eventsRef = collection(db, this.COLLECTION);
      const q = query(
        eventsRef,
        where("startTime", ">=", Timestamp.fromDate(startDate.toJSDate())),
        where("startTime", "<=", Timestamp.fromDate(endDate.toJSDate())),
        where("status", "==", EventStatus.SCHEDULED)
      );
  
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Event));
    }
  
    static async createEvent(
      event: Omit<Event, "id" | "createdAt" | "updatedAt">
    ): Promise<Event> {
      // Check if slot is available
      const existingEvents = await this.getEvents(
        DateTime.fromJSDate(event.startTime.toDate()),
        DateTime.fromJSDate(event.endTime.toDate())
      );
  
      if (existingEvents.length > 0) {
        throw new Error("Slot already booked");
      }
  
      const now = Timestamp.now();
      const newEvent = {
        ...event,
        createdAt: now,
        updatedAt: now,
      };
  
      const docRef = await addDoc(collection(db, this.COLLECTION), newEvent);
      return { ...newEvent, id: docRef.id };
    }
  }
  