export interface CreateEventRequest {
    dateTime: string;
    duration: number;
    userId: string;
  }
  
  export interface GetFreeSlotsRequest {
    date: string;
    timezone?: string;
  }
  