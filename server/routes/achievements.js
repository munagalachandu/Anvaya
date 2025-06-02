import express from 'express';
import Achievement from '../models/Achievement.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup: memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const isValidExt = allowedTypes.test(file.originalname.toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);
    if (isValidExt && isValidMime) cb(null, true);
    else cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
  },
});

// JWT middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Authorization token missing' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Cloudinary upload helper
const uploadToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const ext = originalname.toLowerCase().split('.').pop();
    const resourceType = ['jpg', 'jpeg', 'png'].includes(ext) ? 'image' : 'raw';

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'student_certificates', resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};

// GET achievements for authenticated student
router.get('/student_achievements', verifyToken, async (req, res) => {
  try {
    const studentId = req.user.user_id;
    const achievements = await Achievement.find({ user: studentId });

    const formatted = achievements.map(a => ({
      id: a._id,
      event_name: a.achievement_name,
      certificate: a.achievement_certificate,
      placement: a.placement,
      date: a.date,
      venue: a.venue,
      verification: a.verification,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve achievements' });
  }
});

// POST new achievement for authenticated student
router.post('/student_add_achievement', verifyToken, upload.single('certificate'), async (req, res) => {
  try {
    const { event_name, event_date, venue, placement } = req.body;
    const studentId = req.user.user_id;

    if (!event_name || !event_date || !venue) {
      return res.status(400).json({ error: 'Please provide event_name, event_date, and venue' });
    }

    let certificateUrl = '';
    if (req.file) {
      certificateUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    }

    const achievement = new Achievement({
      achievement_name: event_name,
      user: studentId,
      achievement_certificate: certificateUrl,
      placement: placement || '',
      date: event_date,
      venue,
      verification: 'Pending',
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
        verification: achievement.verification,
        user_id: achievement.user,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add achievement' });
  }
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

// Alternative route without adminId parameter
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

// Debug route to check token structure (remove in production)
router.get('/debug-token', verifyToken, (req, res) => {
  res.json({
    message: 'Token decoded successfully',
    payload: req.user,
    user_id: req.user.user_id, // This should show the correct user ID
    role: req.user.role
  });
});

// Test Cloudinary connection (remove this route in production)
router.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ 
      status: 'Cloudinary connection successful', 
      result: result,
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
        api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Cloudinary connection failed', 
      error: error.message 
    });
  }
});

export default router;