// routes/sse.js
import express from "express";
import { sseEmitter } from "../middlewares/sseEmitterMiddlewares.js";

const router = express.Router();

router.get('/', (req, res) => {
    // Set necessary headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Function to send events to this client
    const sendEvent = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Subscribe to global events
    sseEmitter.on('message', sendEvent);

    // Optionally send an initial event
    sendEvent({ message: "Connected to SSE" });

    // Clean up on client disconnect
    req.on('close', () => {
      sseEmitter.off('message', sendEvent);
      res.end();
    });
});

export default router;

