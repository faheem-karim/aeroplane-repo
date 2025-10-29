import React, { useEffect, useState } from "react";
import axios from "axios";

function SeatMap() {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/seats").then(res => setSeats(res.data));
  }, []);

  const bookSeat = (id) => {
    axios.post(`http://localhost:5000/api/book/${id}`).then(() => {
      alert("Seat booked!");
      setSeats(seats.map(s => s.id === id ? { ...s, booked: true } : s));
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 80px)", gap: "10px", justifyContent: "center" }}>
      {seats.map(seat => (
        <button
          key={seat.id}
          style={{ background: seat.booked ? "red" : "green", color: "white", height: "50px" }}
          onClick={() => bookSeat(seat.id)}
          disabled={seat.booked}
        >
          {seat.seat_number}
        </button>
      ))}
    </div>
  );
}

export default SeatMap;
