import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Classroom from '../models/Classroom.js';

dotenv.config({path: '../.env'});

const MONGO_URI = process.env.MONGO_URI;

async function seedClassrooms() {
  await mongoose.connect(MONGO_URI);
  const classrooms = [
    { name: 'Room 1' },
    { name: 'Room 2' },
    { name: 'Room 3' },
    { name: 'Room 4' }
  ];
  await Classroom.deleteMany({});
  await Classroom.insertMany(classrooms);
  console.log('Classrooms seeded');
  await mongoose.disconnect();
}

seedClassrooms(); 