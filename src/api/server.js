// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// For demonstration, store events in an in-memory array:
const trackingEvents = [];

// Endpoint to receive tracking events
app.post("/api/track", (req, res) => {
  const event = req.body;
  trackingEvents.push(event);
  console.log("Event stored:", event);
  res.status(200).json({ message: "Event stored successfully" });
});

// Endpoint to retrieve all stored events (for admin dashboard)
app.get("/api/events", (req, res) => {
  res.json(trackingEvents);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));