// db.js
import { connect } from 'mongoose';
require('dotenv').config();

const connectDB = async () => {
  try {
    connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// kasiwebsites/db.js

import { createConnection } from 'mysql2';
require('dotenv').config();

const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error: ', err);
    return;
  }
  console.log('Database connected');
});

export default connectDB;
