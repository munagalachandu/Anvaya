import express from 'express';
import Achievement from '../models/Achievement.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/certificates';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `certificate-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
    }
  }
});

// Middleware for JWT auth
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Get achievements for a student
router.get('/student_achievements/:studentId', verifyToken, async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.params.studentId });
    
    const formattedAchievements = achievements.map(achievement => ({
      id: achievement._id,
      event_name: achievement.achievement_name,
      certificate: achievement.achievement_certificate,
      placement: achievement.placement,
      date: achievement.date,
      venue: achievement.venue,
      verification: achievement.verification
    }));

    res.json(formattedAchievements);
  } catch (err) {
    console.error('Error fetching achievements:', err);
    res.status(500).json({ error: 'Failed to retrieve achievements data' });
  }
});

// Add achievement for a student (with file upload)
router.post('/student_add_achievement/:studentId', verifyToken, upload.single('certificate'), async (req, res) => {
  try {
    const { event_name, event_date, venue, placement } = req.body;
    const studentId = req.params.studentId;

    // Validate required fields
    if (!event_name || !event_date || !venue) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(400).json({ 
        error: 'Missing required fields: event_name, event_date, and venue are required' 
      });
    }

    // Prepare certificate file path
    let certificatePath = '';
    if (req.file) {
      // Option 1: Store relative path (current)
      certificatePath = `uploads/certificates/${req.file.filename}`;
      
      // Option 2: Store full URL (uncomment if preferred)
      // certificatePath = `${req.protocol}://${req.get('host')}/api/certificate/${req.file.filename}`;
    }

    // Create new achievement
    const achievement = new Achievement({
      achievement_name: event_name,
      user: studentId,
      achievement_certificate: certificatePath,
      placement: placement || '', // Optional field
      date: event_date, // Map event_date to date
      venue: venue,
      verification: 'Pending'
    });

    await achievement.save();

    res.status(201).json({ 
      success: true, 
      message: 'Achievement added successfully',
      achievement: {
        id: achievement._id,
        event_name: achievement.achievement_name,
        certificate: achievement.achievement_certificate,
        placement: achievement.placement,
        date: achievement.date,
        venue: achievement.venue,
        verification: achievement.verification
      }
    });

  } catch (err) {
    console.error('Error adding achievement:', err);
    
    // Clean up uploaded file if database save fails
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file after save failure:', unlinkErr);
      });
    }

    // Handle specific errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }

    res.status(500).json({ error: 'Failed to add achievement' });
  }
});

// Handle multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: 'File upload error: ' + error.message });
  }
  
  if (error.message === 'Only PDF, JPG, JPEG, and PNG files are allowed') {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

// Verify participation (admin/faculty)
router.post('/verify_participation/:achievementId', verifyToken, async (req, res) => {
  try {
    const { verification } = req.body; // 'Verified' or 'Rejected'
    
    if (!verification || !['Verified', 'Rejected'].includes(verification)) {
      return res.status(400).json({ 
        error: 'Invalid verification status. Must be "Verified" or "Rejected"' 
      });
    }

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.achievementId, 
      { verification },
      { new: true } // Return updated document
    );

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json({ 
      success: true, 
      message: 'Participation status updated successfully',
      achievement: {
        id: achievement._id,
        verification: achievement.verification
      }
    });

  } catch (err) {
    console.error('Error updating verification status:', err);
    res.status(500).json({ error: 'Failed to update participation status' });
  }
});
// Add this route to your existing achievements router file

// Get all student achievements for verification (admin/faculty view)
router.get('/student_events_verify/:adminId', verifyToken, async (req, res) => {
  try {
    // Fetch all achievements with populated user information
    const achievements = await Achievement.find({})
      .populate('user', 'name email role') // Only populate fields that exist in your User model
      .sort({ createdAt: -1 });

    // Format the response to match the frontend expectations
    const formattedAchievements = achievements.map(achievement => ({
      id: achievement._id,
      name: achievement.user ? achievement.user.name : 'Unknown Student',
      rollNo: achievement.user ? achievement.user.email : 'N/A', // Use email as rollNo since rollNo doesn't exist
      department: achievement.user ? achievement.user.role : 'N/A', // Use role as department since department doesn't exist
      title: achievement.achievement_name,
      event_date: achievement.date ? new Date(achievement.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'N/A',
      placement: achievement.placement || 'Participation',
      verification: achievement.verification || 'Pending',
      certificate: achievement.achievement_certificate
    }));

    res.json(formattedAchievements);

  } catch (err) {
    console.error('Error fetching student achievements:', err);
    res.status(500).json({ error: 'Failed to retrieve achievements data' });
  }
});

// Alternative route without adminId parameter (as you have both versions)
router.get('/student_events_verify', verifyToken, async (req, res) => {
  try {
    const achievements = await Achievement.find({})
      .populate('user', 'name email role') // Only populate existing fields
      .sort({ createdAt: -1 });

    const formattedAchievements = achievements.map(achievement => ({
      id: achievement._id,
      name: achievement.user ? achievement.user.name : 'Unknown Student',
      title: achievement.achievement_name,
      placement: achievement.placement || 'Participation',
      verification: achievement.verification || 'Pending',
      certificate: achievement.achievement_certificate
    }));

    res.json(formattedAchievements);

  } catch (err) {
    console.error('Error fetching student achievements:', err);
    res.status(500).json({ error: 'Failed to retrieve achievements data' });
  }
});

export default router;