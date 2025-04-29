import express from 'express';
import { PORT } from './config/env.js';
import cors from 'cors';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import collectionsRoutes from './routes/collection.js';
import subCollectionsRoutes from "./routes/subCollections.js";
import samplesRoutes from "./routes/samples.js";
import picturesRoutes from "./routes/pictures.js";
import commentsRoutes from "./routes/comments.js";
import tasksRoutes from "./routes/tasks.js";
import eventsRoutes from "./routes/events.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use("/api/v1/collections", collectionsRoutes);
app.use("/api/v1/subCollections", subCollectionsRoutes);
app.use("/api/v1/samples", samplesRoutes);
app.use("/api/v1/pictures", picturesRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/events", eventsRoutes);




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

