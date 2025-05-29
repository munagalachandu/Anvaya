import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registeredAt: { type: Date, default: Date.now }
});

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
export default EventRegistration; 