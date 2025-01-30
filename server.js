import express from 'express';
import { PORT } from './config/env.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import collectionsRoutes from './routes/collection.js';
import subCollectionsRoutes from "./routes/subCollections.js";

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/subCollections", subCollectionsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

