const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

// Get all seats
app.get("/api/seats", (req, res) => {
  db.query("SELECT * FROM seats", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Book a seat
app.post("/api/book/:id", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE seats SET booked = TRUE WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.send("Seat booked!");
  });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
