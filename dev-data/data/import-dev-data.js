/* eslint-disable no-undef */
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

import Document from '../../models/documentModel.js';

config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const documents = JSON.parse(
  readFileSync(new URL('./documents.json', import.meta.url))
);

// IMPORT DATA INTO DB
const importdata = async () => {
  try {
    await Document.create(documents);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Document.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importdata();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
