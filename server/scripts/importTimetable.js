const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const TimetableEntry = require('../models/TimetableEntry');

const timetablePath = path.join(__dirname, '../timetable.json');
const timetableData = JSON.parse(fs.readFileSync(timetablePath, 'utf-8'));

mongoose.connect('mongodb://localhost:27017/anvaya', { useNewUrlParser: true, useUnifiedTopology: true });

async function importTimetable() {
  const { semester, section, room_number, session, timetable } = timetableData;
  const entries = [];

  for (const [day, slots] of Object.entries(timetable)) {
    for (const [slot, subject] of Object.entries(slots)) {
      if (subject && subject !== 'Lunch Break') {
        entries.push({
          classroom: room_number,
          day_of_week: day,
          slot,
          subject,
          semester,
          section,
          session,
        });
      }
    }
  }

  await TimetableEntry.deleteMany({ classroom: room_number, semester, section, session });
  await TimetableEntry.insertMany(entries);
  console.log('Timetable imported!');
  mongoose.disconnect();
}

importTimetable(); 