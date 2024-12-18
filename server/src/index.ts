import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { EventController } from "./controllers/EventController";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/slots", EventController.getFreeSlots);
app.post("/api/events", EventController.createEvent);
app.get("/api/events", EventController.getEvents);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});

export default app;
