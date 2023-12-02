/* eslint-disable no-undef */
import mongoose from 'mongoose';
import app from './app.js';

process.on('uncaughtException', err => {
  // console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  // console.log(err.name, err.message);

  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB);
// .then(() =>
// console.log('DB connection successful!')
// );

const port = process.env.PORT || 4100;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  // console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  // console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
