import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  achievement_name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date },
  
  venue: { type: String },
  placement: { type: String },
  verification: { type: String, enum: ['Verified', 'Pending', 'Rejected'], default: 'Pending' },
  achievement_certificate: { type: String, required: false }
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement; 