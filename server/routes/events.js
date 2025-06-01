import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import EventRegistration from '../models/EventRegistration.js';

const router = express.Router();

// Middleware placeholder for JWT auth
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

// Get events for a faculty (from JWT)
router.get('/fac_events', verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.user_id });
    res.json(events.map(e => ({
      id: e._id,
      title: e.event_name,
      date: e.start_date,
      venue: e.venue,
      status: e.status,
      participants: e.number_of_participants || 0
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Add event as faculty (user from JWT)
router.post('/fac_add_events', verifyToken, async (req, res) => {
  const { title, category, start_date, end_date, venue, description, guest_name, guest_contact, session_details } = req.body;
  if (!title || !category || !start_date || !end_date || !venue || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newEvent = new Event({
      event_name: title,
      user: req.user.user_id,
      category,
      start_date,
      end_date,
      venue,
      description,
      guest_name,
      guest_contact,
      session_details,
      status: 'Upcoming',
      number_of_participants: 0
    });
    await newEvent.save();
    res.status(201).json({ success: true, message: 'Event added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to add event' });
  }
});

// Get events for a student (for now, return all events)
router.get('/student_events/:studentId', verifyToken, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get student events for verification (admin/faculty)
router.get('/student_events_verify/:teacherId', verifyToken, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get events by category
router.get('/events/category/:category', async (req, res) => {
  try {
    const events = await Event.find({ category: req.params.category });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get all events (for students)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events.map(e => ({
      id: e._id,
      title: e.event_name,
      category: e.category,
      start_date: e.start_date,
      end_date: e.end_date,
      venue: e.venue,
      description: e.description,
      status: e.status,
      participants: e.number_of_participants || 0
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Register for an event
router.post('/events/:eventId/register', verifyToken, async (req, res) => {
  const eventId = req.params.eventId;
  const studentId = req.user.user_id;
  // Prevent duplicate registration
  const existing = await EventRegistration.findOne({ event: eventId, student: studentId });
  if (existing) return res.status(400).json({ error: 'Already registered for this event.' });
  const reg = new EventRegistration({ event: eventId, student: studentId });
  await reg.save();
  res.json({ success: true });
});

export default router; 