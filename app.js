/* eslint-disable no-undef */
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

import documentRouter from './routes/documentRoutes.js';
import fileRouter from './routes/fileRoutes.js';
import userRouter from './routes/userRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';

config({ path: './config.env' });
const app = express();

// 1) GLOBAL MIDDLEWARE
// Serving static files
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client/dist')));

// app.use(express.static(`${__dirname}/public`));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  limit: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'type',
      'sender',
      'receiver',
      'status',
      'responseDays',
      'deliveredBy',
      'createdAt',
      'startDate',
      'endDate',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// 2) ROUTES
app.use('/api/v1/test', (req, res) => {
  res.status(200).json.json({ msg: 'test route' });
});
app.use('/api/v1/documents', documentRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/contacts', contactRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
