import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Utility to normalize room names
const normalizeRoom = str => str ? str.toLowerCase().replace(/\s+/g, '').replace('room', 'room-').replace('room--', 'room-') : str;

// GET /api/classroom-timetable?date=YYYY-MM-DD&classroom=Room-X or ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&classroom=Room-X
router.get('/api/classroom-timetable', async (req, res) => {
  let { date, startDate, endDate, classroom } = req.query;
  if (!classroom || (!date && (!startDate || !endDate))) {
    return res.status(400).json({ error: 'Date or date range and classroom are required' });
  }
  try {
    const timetablePath = path.join(process.cwd(), 'routes', '2nd-year.json');
    console.log('Resolved timetable path:', timetablePath);
    if (!fs.existsSync(timetablePath)) {
      console.error('Timetable JSON file does not exist at:', timetablePath);
      return res.status(500).json({ error: 'Timetable data file not found on server.' });
    }
    let timetableRaw;
    try {
      timetableRaw = fs.readFileSync(timetablePath, 'utf-8');
    } catch (readErr) {
      console.error('Error reading timetable JSON file:', readErr);
      return res.status(500).json({ error: 'Failed to read timetable data file.' });
    }
    let timetable;
    try {
      timetable = JSON.parse(timetableRaw);
    } catch (parseErr) {
      console.error('Error parsing timetable JSON file:', parseErr);
      return res.status(500).json({ error: 'Timetable data file is not valid JSON.' });
    }
    // Get the top-level year if present
    const defaultYear = timetable.year ? timetable.year : undefined;
    const allSlots = [
      '09:00-10:00', '10:00-11:00', '11:15-12:15', '12:15-13:15',
      '13:15-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
    ];
    const normalize = str => str ? str.toLowerCase().replace(/\s+/g, '').replace('room', 'room-').replace('room--', 'room-') : str;
    const normClassroom = normalize(classroom);
    // Helper to process a single date
    const processDate = (dateKey) => {
      const dayData = timetable[dateKey];
      const slots = {};
      if (!dayData) {
        allSlots.forEach(slot => {
          slots[slot] = { status: 'Available', subject: null, year: defaultYear };
        });
        return slots;
      }
      allSlots.forEach(slot => {
        const info = dayData[slot];
        if (!info) {
          slots[slot] = { status: 'Available', subject: null, year: defaultYear };
        } else if (info.subject === 'Lunch Break') {
          slots[slot] = { status: 'Lunch Break', subject: 'Lunch Break', year: defaultYear };
        } else if (normalize(info.room) === normClassroom) {
          slots[slot] = {
            status: 'Occupied',
            subject: info.subject,
            year: info.year || defaultYear
          };
        } else {
          slots[slot] = { status: 'Available', subject: null, year: defaultYear };
        }
      });
      return slots;
    };
    // Date range logic
    let result = {};
    if (date) {
      // Convert YYYY-MM-DD to DD-MM-YYYY
      let [yyyy, mm, dd] = date.split('-');
      let dateKey = `${dd}-${mm}-${yyyy}`;
      result[date] = processDate(dateKey);
      // If the date is not in the timetable, ensure all slots are 'Available'
      if (!timetable[dateKey]) {
        const slots = {};
        allSlots.forEach(slot => { slots[slot] = 'Available'; });
        result[date] = slots;
      }
    } else {
      // Range
      let start = new Date(startDate);
      let end = new Date(endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        let yyyy = d.getFullYear();
        let mm = String(d.getMonth() + 1).padStart(2, '0');
        let dd = String(d.getDate()).padStart(2, '0');
        let dateKey = `${dd}-${mm}-${yyyy}`;
        let isoDate = `${yyyy}-${mm}-${dd}`;
        result[isoDate] = processDate(dateKey);
        // If the date is not in the timetable, ensure all slots are 'Available'
        if (!timetable[dateKey]) {
          const slots = {};
          allSlots.forEach(slot => { slots[slot] = 'Available'; });
          result[isoDate] = slots;
        }
      }
    }
    res.json({ classroom, timetable: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read timetable data' });
  }
});

export default router; 