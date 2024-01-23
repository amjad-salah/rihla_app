import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDb from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import fleetRoutes from './routes/fleetRoutes.js';
import userRoutes from './routes/userRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';

dotenv.config();
connectDb();

const port = process.env.PORT || 5000;
const app = express();

//BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie Parser
app.use(cookieParser());

app.get('/', (req, res) =>
  res.json({ success: true, data: 'Rihla App API Backend!' })
);

//Users Routes
app.use('/api/users', userRoutes);

//Fleet Routes
app.use('/api/fleet', fleetRoutes);

//Driver Routes
app.use('/api/drivers', driverRoutes);

//Destination Routes
app.use('/api/destinations', destinationRoutes);

//Journey Routes
app.use('/api/journeys', journeyRoutes);

//Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port: ${port}`));
