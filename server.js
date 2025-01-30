import express from 'express';
import { PORT } from './config/env.js';
import userRoutes from './routes/users.js';

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

