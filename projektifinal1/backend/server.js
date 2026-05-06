import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

let db = {
  schedule: [],
  grades: [],
  absences: [],
  notifications: []
};

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } else {
      seedData();
    }
  } catch (err) {
    console.error('Error loading DB:', err);
    seedData();
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

function seedData() {
  if (db.schedule.length === 0) {
    db.schedule = [
      { id: '1', subject: 'Matematikë', instructor: 'Prof. Smith', location: 'Salla 101', dayOfWeek: 1, startTime: '09:00', endTime: '10:30', color: '#3B82F6' },
      { id: '2', subject: 'Fizikë', instructor: 'Dr. Johnson', location: 'Lab 201', dayOfWeek: 1, startTime: '11:00', endTime: '12:30', color: '#10B981' },
      { id: '3', subject: 'Shkenca Kompjuterike', instructor: 'Prof. Williams', location: 'Lab 301', dayOfWeek: 2, startTime: '09:00', endTime: '10:30', color: '#8B5CF6' },
      { id: '4', subject: 'Letërsi Angleze', instructor: 'Dr. Brown', location: 'Salla 102', dayOfWeek: 2, startTime: '11:00', endTime: '12:30', color: '#F59E0B' },
      { id: '5', subject: 'Matematikë', instructor: 'Prof. Smith', location: 'Salla 101', dayOfWeek: 3, startTime: '09:00', endTime: '10:30', color: '#3B82F6' },
      { id: '6', subject: 'Histori', instructor: 'Prof. Davis', location: 'Salla 203', dayOfWeek: 3, startTime: '13:00', endTime: '14:30', color: '#EF4444' },
      { id: '7', subject: 'Fizikë', instructor: 'Dr. Johnson', location: 'Lab 201', dayOfWeek: 4, startTime: '09:00', endTime: '10:30', color: '#10B981' },
      { id: '8', subject: 'Shkenca Kompjuterike', instructor: 'Prof. Williams', location: 'Lab 301', dayOfWeek: 5, startTime: '09:00', endTime: '10:30', color: '#8B5CF6' },
    ];
  }

  if (db.grades.length === 0) {
    db.grades = [
      { id: '1', subject: 'Matematikë', title: 'Provimi i Mesëm', score: 85, maxScore: 100, weight: 0.3, date: '2026-03-15' },
      { id: '2', subject: 'Fizikë', title: 'Raporti i Laboratorit', score: 92, maxScore: 100, weight: 0.2, date: '2026-03-18' },
      { id: '3', subject: 'Shkenca Kompjuterike', title: 'Projekti 1', score: 88, maxScore: 100, weight: 0.25, date: '2026-03-20' },
      { id: '4', subject: 'Letërsi Angleze', title: 'Ese', score: 78, maxScore: 100, weight: 0.15, date: '2026-03-22' },
      { id: '5', subject: 'Matematikë', title: 'Testi 1', score: 90, maxScore: 100, weight: 0.1, date: '2026-03-25' },
      { id: '6', subject: 'Histori', title: 'Puna e Semestrit', score: 82, maxScore: 100, weight: 0.3, date: '2026-03-28' },
    ];
  }

  if (db.absences.length === 0) {
    db.absences = [
      { id: '1', subject: 'Matematikë', date: '2026-02-15', justified: true, reason: 'Takim me mjek' },
      { id: '2', subject: 'Fizikë', date: '2026-03-01', justified: false, reason: null },
      { id: '3', subject: 'Shkenca Kompjuterike', date: '2026-03-10', justified: true, reason: 'Emergjencë familjare' },
    ];
  }

  if (db.notifications.length === 0) {
    const now = new Date().toISOString();
    db.notifications = [
      { id: '1', type: 'assignment', title: 'Detyra e Matematikës', message: 'Ushtrimet e Kapitullit 5 duhet të dorëzohen nesër', read: false, createdAt: now },
      { id: '2', type: 'grade', title: 'Notë e Postuar', message: 'Raporti i laboratorit të fizikës është vlerësuar: 92/100', read: true, createdAt: now },
      { id: '3', type: 'absence', title: 'Paralajmërim Mungese', message: 'Keni 2 mungesa të paarsyetuara në Fizikë', read: false, createdAt: now },
    ];
  }

  saveDb();
}

loadDb();

const clients = new Set();

function notifyClients(notification) {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(notification)}\n\n`);
  });
}

app.get('/api/schedule', (req, res) => {
  res.json(db.schedule.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)));
});

app.post('/api/schedule', (req, res) => {
  const { subject, instructor, location, dayOfWeek, startTime, endTime, color } = req.body;
  const newItem = {
    id: uuidv4(),
    subject,
    instructor: instructor || '',
    location: location || '',
    dayOfWeek: parseInt(dayOfWeek),
    startTime,
    endTime,
    color: color || '#3B82F6'
  };
  db.schedule.push(newItem);
  saveDb();
  res.status(201).json(newItem);
});

app.put('/api/schedule/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.schedule.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  
  db.schedule[idx] = { ...db.schedule[idx], ...req.body };
  saveDb();
  res.json(db.schedule[idx]);
});

app.delete('/api/schedule/:id', (req, res) => {
  const { id } = req.params;
  db.schedule = db.schedule.filter(s => s.id !== id);
  saveDb();
  res.status(204).send();
});

app.get('/api/grades', (req, res) => {
  res.json(db.grades.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

app.post('/api/grades', (req, res) => {
  const { subject, title, score, maxScore, weight, date } = req.body;
  const newItem = {
    id: uuidv4(),
    subject,
    title,
    score: parseFloat(score),
    maxScore: parseFloat(maxScore),
    weight: parseFloat(weight) || 1,
    date
  };
  db.grades.push(newItem);
  saveDb();
  res.status(201).json(newItem);
});

app.delete('/api/grades/:id', (req, res) => {
  const { id } = req.params;
  db.grades = db.grades.filter(g => g.id !== id);
  saveDb();
  res.status(204).send();
});

app.get('/api/absences', (req, res) => {
  res.json(db.absences.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

app.post('/api/absences', (req, res) => {
  const { subject, date, justified, reason } = req.body;
  const newItem = {
    id: uuidv4(),
    subject,
    date,
    justified: !!justified,
    reason: reason || null
  };
  db.absences.push(newItem);
  saveDb();
  res.status(201).json(newItem);
});

app.delete('/api/absences/:id', (req, res) => {
  const { id } = req.params;
  db.absences = db.absences.filter(a => a.id !== id);
  saveDb();
  res.status(204).send();
});

app.get('/api/notifications', (req, res) => {
  res.json(db.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/notifications', (req, res) => {
  const { type, title, message } = req.body;
  const newItem = {
    id: uuidv4(),
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.push(newItem);
  saveDb();
  notifyClients(newItem);
  res.status(201).json(newItem);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const idx = db.notifications.findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  
  db.notifications[idx].read = true;
  saveDb();
  res.json(db.notifications[idx]);
});

app.put('/api/notifications/read-all', (req, res) => {
  db.notifications.forEach(n => n.read = true);
  saveDb();
  res.json({ success: true });
});

app.get('/api/notifications/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  clients.add(res);
  
  req.on('close', () => {
    clients.delete(res);
  });
});

app.get('/api/stats', (req, res) => {
  const totalGrades = db.grades.length;
  const avgGrade = totalGrades > 0
    ? db.grades.reduce((acc, g) => acc + (g.score / g.maxScore) * g.weight, 0) / db.grades.reduce((acc, g) => acc + g.weight, 0) * 100
    : 0;
  const totalAbsences = db.absences.length;
  const unexcusedAbsences = db.absences.filter(a => !a.justified).length;
  const unreadNotifications = db.notifications.filter(n => !n.read).length;
  
  res.json({
    totalGrades,
    averageGrade: Math.round(avgGrade * 10) / 10,
    totalAbsences,
    unexcusedAbsences,
    unreadNotifications
  });
});

app.listen(PORT, () => {
  console.log(`StudentHub API running on http://localhost:${PORT}`);
});
