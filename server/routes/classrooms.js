import express from 'express';
import Classroom from '../models/Classroom.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import TimetableEntry from '../models/TimetableEntry.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Authorization token is missing' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// List all classrooms
router.get('/classrooms', verifyToken, async (req, res) => {
  const classrooms = await Classroom.find();
  res.json(classrooms);
});

// Get bookings for a day and year
router.get('/bookings', verifyToken, async (req, res) => {
  const { date, year } = req.query;
  const filter = {};
  if (date) filter.date = date;
  if (year) filter.year = Number(year);
  const bookings = await Booking.find(filter).populate('classroom requestedBy approvedBy');
  res.json(bookings);
});

// Get timetable for a specific date (regular classes + bookings)
router.get('/timetable', verifyToken, async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date required' });
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  // Get all timetable entries for that day
  const timetableEntries = await TimetableEntry.find({ day_of_week: dayOfWeek });
  // Get all bookings for that date
  const bookings = await Booking.find({ date }).populate('classroom requestedBy approvedBy');
  res.json({ timetable: timetableEntries, bookings });
});

// Get available classrooms for a date and slot
router.get('/classrooms/available', verifyToken, async (req, res) => {
  const { date, slot } = req.query;
  if (!date || !slot) return res.status(400).json({ error: 'Date and slot required' });
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  // Find all classrooms
  const allClassrooms = await Classroom.find();
  // Find classrooms occupied in timetable
  const occupiedByTimetable = await TimetableEntry.find({ day_of_week: dayOfWeek, slot });
  const occupiedClassroomsTimetable = occupiedByTimetable.map(e => e.classroom);
  // Find classrooms booked for that date/slot
  const bookings = await Booking.find({ date, slot, status: { $in: ['pending', 'approved'] } });
  const occupiedClassroomsBooking = bookings.map(b => b.classroom.toString());
  // Filter out occupied classrooms
  const available = allClassrooms.filter(room =>
    !occupiedClassroomsTimetable.includes(room.name) &&
    !occupiedClassroomsBooking.includes(room._id.toString())
  );
  res.json(available);
});

// Update booking request logic to check for timetable and booking conflicts
router.post('/bookings/request', verifyToken, async (req, res) => {
  const { classroomId, date, slot, year } = req.body;
  if (!classroomId || !date || !slot || !year) return res.status(400).json({ error: 'Missing fields' });
  // Check timetable conflict
  const classroomDoc = await Classroom.findById(classroomId);
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  const timetableConflict = await TimetableEntry.findOne({ classroom: classroomDoc.name, day_of_week: dayOfWeek, slot });
  if (timetableConflict) {
    return res.status(409).json({ error: 'Classroom is occupied by a regular class at this time.' });
  }
  // Check booking conflict
  const bookingConflict = await Booking.findOne({ classroom: classroomId, date, slot, status: { $in: ['pending', 'approved'] } });
  if (bookingConflict) {
    return res.status(409).json({ error: 'Classroom is already booked for this slot.' });
  }
  const booking = new Booking({
    classroom: classroomId,
    date,
    slot,
    year,
    requestedBy: req.user.user_id,
    status: 'pending'
  });
  await booking.save();
  res.status(201).json({ success: true, booking });
});

// Approve a booking (admin)
router.post('/bookings/:bookingId/approve', verifyToken, async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: 'approved', approvedBy: req.user.user_id },
    { new: true }
  );
  res.json({ success: true, booking });
});

// Reject a booking (admin)
router.post('/bookings/:bookingId/reject', verifyToken, async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: 'rejected', approvedBy: req.user.user_id },
    { new: true }
  );
  res.json({ success: true, booking });
});

// Get timetable for a year (returns all bookings for the year)
router.get('/timetable', verifyToken, async (req, res) => {
  const { year } = req.query;
  if (!year) return res.status(400).json({ error: 'Year required' });
  const bookings = await Booking.find({ year: Number(year) }).populate('classroom requestedBy approvedBy');
  res.json(bookings);
});

// Get timetable for a specific year and section
router.get('/timetable/by-year', verifyToken, async (req, res) => {
  const { year, section } = req.query;
  if (!year || !section) return res.status(400).json({ error: 'Year and section required' });
  // Find all entries for this year/section
  const entries = await TimetableEntry.find({ semester: year, section });
  // Build timetable structure
  const timetable = {};
  const slotSet = new Set();
  entries.forEach(entry => {
    if (!timetable[entry.day_of_week]) timetable[entry.day_of_week] = {};
    timetable[entry.day_of_week][entry.slot] = entry.subject;
    slotSet.add(entry.slot);
  });
  // Sort slots
  const slots = Array.from(slotSet).sort();
  res.json({ timetable, slots });
});

export default router; 