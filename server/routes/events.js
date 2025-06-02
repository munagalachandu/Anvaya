import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import EventRegistration from '../models/EventRegistration.js';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

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
      participants: e.number_of_participants || 0,
      image: e.image
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Add event as faculty (user from JWT)
router.post('/fac_add_events', verifyToken, upload.single('image'), async (req, res) => {
  const { title, category, start_date, end_date, venue, description, guest_name, guest_contact, session_details } = req.body;
  if (!title || !category || !start_date || !end_date || !venue || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    let imageUrl = '/placeholder.svg';
    
    if (req.file) {
      // Upload to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'events',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 600, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
      
      imageUrl = result.secure_url;
    }

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
      number_of_participants: 0,
      image: imageUrl
    });
    
    await newEvent.save();
    res.status(201).json({ success: true, message: 'Event added successfully' });
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).json({ success: false, error: 'Failed to add event' });
  }
});


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
/*
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
*/
// Edit event
router.put('/edit_events/:eventId', verifyToken, upload.single('image'), async (req, res) => {
  const eventId = req.params.eventId;
  const { title, category, start_date, end_date, venue, description, guest_name, guest_contact, session_details } = req.body;
  
  try {
    const event = await Event.findOne({ _id: eventId, user: req.user.user_id });
    if (!event) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    const updateData = {
      event_name: title,
      category,
      start_date,
      end_date,
      venue,
      description,
      guest_name,
      guest_contact,
      session_details
    };

    if (req.file) {
      // Upload new image to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'events',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 600, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
      
      updateData.image = result.secure_url;

      // Delete old image from Cloudinary if it exists
      if (event.image && event.image.includes('cloudinary')) {
        const publicId = event.image.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true }
    );

    res.json({ success: true, event: updatedEvent });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ success: false, error: 'Failed to update event' });
  }
});


router.get('/all_events', async (req, res) => {
  try {
    const events = await Event.find(); // no populate, just raw events
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
});

// Add these routes to your existing event routes file

// Get single event by ID (for event details page)
router.get('/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate('user', 'name email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Return the event with all details
    res.json({
      _id: event._id,
      event_name: event.event_name,
      category: event.category,
      status: event.status,
      start_date: event.start_date,
      end_date: event.end_date,
      venue: event.venue,
      description: event.description,
      guest_name: event.guest_name,
      guest_contact: event.guest_contact,
      session_details: event.session_details,
      number_of_participants: event.number_of_participants || 0,
      image: event.image,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      organizer: event.user ? {
        name: event.user.name,
        email: event.user.email
      } : null
    });
  } catch (err) {
    console.error('Error fetching event details:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
});

// Register for an event (without authentication - public registration)
router.post('/events/:id/register', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { name, semester, teamName, phone, email, collegeName } = req.body;

    // Validate required fields
    if (!name || !semester || !phone || !email || !collegeName) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide name, semester, phone, email, and college name.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if event is still accepting registrations
    if (event.status === 'Ended') {
      return res.status(400).json({ error: 'Registration is closed for this event' });
    }

    // Check if user already registered (based on email for this event)
    const existingRegistration = await EventRegistration.findOne({ 
      event: eventId, 
      email: email.toLowerCase() 
    });

    if (existingRegistration) {
      return res.status(400).json({ error: 'You have already registered for this event' });
    }

    // Create new registration
    const registration = new EventRegistration({
      event: eventId,
      name: name.trim(),
      semester: parseInt(semester),
      teamName: teamName ? teamName.trim() : undefined,
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      collegeName: collegeName.trim(),
      registrationDate: new Date()
    });

    await registration.save();

    // Update participant count in event
    await Event.findByIdAndUpdate(eventId, {
      $inc: { number_of_participants: 1 }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful!',
      registrationId: registration._id
    });

  } catch (err) {
    console.error('Error registering for event:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: `Validation error: ${errors.join(', ')}` });
    }
    
    res.status(500).json({ error: 'Failed to register for event. Please try again.' });
  }
});

router.get('/events/:id/registrations', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.user.toString() !== req.user.user_id) {
      return res.status(403).json({ error: 'Unauthorized to view registrations for this event' });
    }

    const registrations = await EventRegistration.find({ event: eventId })
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations: registrations.map(reg => ({
        id: reg._id,
        name: reg.name,
        semester: reg.semester,
        teamName: reg.teamName,
        phone: reg.phone,
        email: reg.email,
        collegeName: reg.collegeName,
        registrationDate: reg.registrationDate
      }))
    });

  } catch (err) {
    console.error('Error fetching event registrations:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});


export default router; 