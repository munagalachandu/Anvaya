import express from 'express';
import Achievement from '../models/Achievement.js';
import jwt from 'jsonwebtoken';

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

// Get achievements for a student
router.get('/student_achievements/:studentId', verifyToken, async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.params.studentId });
    res.json(achievements.map(e => ({
      id: e._id,
      event_name: e.achievement_name,
      certificate: e.achievement_certificate,
      placement: e.placement,
      date: e.date,
      venue: e.venue,
      verification: e.verification
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve achievements data' });
  }
});

// Add achievement for a student (JSON only)
router.post('/student_add_achievement/:studentId', verifyToken, async (req, res) => {
  const { event_name, certificate, placement, date, venue } = req.body;
  if (!event_name || !certificate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const achievement = new Achievement({
      achievement_name: event_name,
      user: req.params.studentId,
      achievement_certificate: certificate,
      placement,
      date,
      venue,
      verification: 'Pending'
    });
    await achievement.save();
    res.status(201).json({ success: true, message: 'Achievement added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add achievement' });
  }
});

// Verify participation (admin/faculty)
router.post('/verify_participation/:achievementId', verifyToken, async (req, res) => {
  const { verification } = req.body; // 'Verified' or 'Rejected'
  if (!verification) {
    return res.status(400).json({ error: 'Missing verification status' });
  }
  try {
    await Achievement.findByIdAndUpdate(req.params.achievementId, { verification });
    res.json({ success: true, message: 'Participation status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update participation status' });
  }
});

export default router; 