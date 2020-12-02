import cors from 'cors';
import express from 'express';
import { Router } from './routes';
import config from './config';

// MongoDB configuration
import mongoose from 'mongoose';
import { ErrorHandler } from './middleware/ErrorHandler';
const connectRetry = function () {
  mongoose.connect(
    config.mongoUri,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      reconnectTries: 30,
      reconnectInterval: 1000,
      poolSize: 500,
    },
    (err) => {
      if (err) {
        console.log('Mongoose connection error:', err);
        setTimeout(connectRetry, 5000);
      }
    }
  );
};
connectRetry();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: true }));

app.use('/api', Router);
app.use((req, res, next) => {
  return res.status(404).json({
    error: true,
    message: 'Resource Not found',
  });
});
app.use(ErrorHandler);

export default app;
