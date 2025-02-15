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
import eventsRoutes from "./routes/events.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/subCollections", subCollectionsRoutes);
app.use("/api/samples", samplesRoutes);
app.use("/api/pictures", picturesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/events", eventsRoutes);




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

