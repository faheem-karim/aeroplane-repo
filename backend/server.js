const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'example',
  database: process.env.DB_NAME || 'airplane'
});

db.connect(err=>{
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Simple search endpoint — returns demo flights based on from/to/date
app.post('/api/search', (req, res) => {
  const { from, to, depart } = req.body;
  const flights = [
    { id: 1, airline: 'Pioneer Air', flight_number: 'PA-101', from, to, time: '09:30' },
    { id: 2, airline: 'SkyWays', flight_number: 'SW-501', from, to, time: '13:45' },
    { id: 3, airline: 'AirNova', flight_number: 'AN-300', from, to, time: '18:20' }
  ];
  res.json(flights);
});

// Flight details (mock)
app.get('/api/flight/:id', (req, res) => {
  const id = Number(req.params.id);
  const mapping = {
    1: { id:1, airline:'Pioneer Air', flight_number:'PA-101', from:'', to:'' },
    2: { id:2, airline:'SkyWays', flight_number:'SW-501', from:'', to:'' },
    3: { id:3, airline:'AirNova', flight_number:'AN-300', from:'', to:'' }
  };
  res.json(mapping[id] || mapping[1]);
});

// Return seat rows from MySQL
app.get('/api/seats', (req, res) => {
  db.query('SELECT id, seat_number, booked FROM seats ORDER BY id', (err, rows) => {
    if (err) return res.status(500).json({error:'DB error'});
    res.json(rows);
  });
});

// Book seats
app.post('/api/book', (req, res) => {
  const seats = req.body.seats;
  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: 'No seats provided' });
  }
  const placeholders = seats.map(()=>'?').join(',');
  const sql = `UPDATE seats SET booked = 1 WHERE id IN (${placeholders})`;
  db.query(sql, seats, (err) => {
    if (err) return res.status(500).json({ message: 'Booking failed' });
    res.json({ message: 'Seats booked successfully' });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log('Backend listening on', port));

