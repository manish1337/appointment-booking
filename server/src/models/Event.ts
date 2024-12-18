import { Timestamp } from "firebase/firestore";

export interface Event {
  id?: string;
  startTime: Timestamp;
  endTime: Timestamp;
  duration: number; // in minutes
  userId: string;
  status: EventStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export enum EventStatus {
  SCHEDULED = "scheduled",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}
