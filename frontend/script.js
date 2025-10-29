// If running via docker/compose, backend is at http://backend:5000 inside the docker network.
// In browser (localhost) use http://localhost:5000.
const apiBase = 'http://localhost:5000';

const searchBtn = document.getElementById('searchBtn');
const flightsList = document.getElementById('flightsList');
const seatArea = document.getElementById('seatArea');
const seatContainer = document.getElementById('seatContainer');
const flightName = document.getElementById('flightName');
const bookSeatsBtn = document.getElementById('bookSeatsBtn');

let currentFlight = null;
let selectedSeatIds = [];

searchBtn.addEventListener('click', async () => {
  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const depart = document.getElementById('depart').value;
  if (!from || !to || !depart) {
    alert('Please fill From, To and Departure date.');
    return;
  }

  flightsList.innerHTML = 'Searching...';
  try {
    const res = await fetch(`${apiBase}/api/search`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({from,to,depart})
    });
    const flights = await res.json();
    renderFlights(flights);
  } catch (e) {
    flightsList.innerHTML = 'Search failed.';
    console.error(e);
  }
});

function renderFlights(flights) {
  if (!flights || flights.length === 0) {
    flightsList.innerHTML = '<div>No flights found.</div>';
    return;
  }
  flightsList.innerHTML = '';
  flights.forEach(f => {
    const div = document.createElement('div');
    div.className = 'flight-card';
    div.innerHTML = `
      <div class="flight-info">
        <div>
          <div class="route">${f.from} → ${f.to}</div>
          <div class="meta">${f.airline} · ${f.flight_number} · ${f.time}</div>
        </div>
      </div>
      <div class="flight-actions">
        <button data-id="${f.id}" class="select-flight">Select</button>
      </div>`;
    flightsList.appendChild(div);
  });

  document.querySelectorAll('.select-flight').forEach(b=>{
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      selectFlight(id);
    });
  });
}

async function selectFlight(flightId) {
  try {
    const res = await fetch(`${apiBase}/api/flight/${flightId}`);
    currentFlight = await res.json();
    flightName.textContent = `${currentFlight.airline} ${currentFlight.flight_number} (${currentFlight.from}→${currentFlight.to})`;
    await loadSeats();
    document.getElementById('seatArea').classList.remove('hidden');
    window.scrollTo({top:document.getElementById('seatArea').offsetTop - 20, behavior:'smooth'});
  } catch(e) {
    alert('Failed to load flight or seats.');
  }
}

async function loadSeats() {
  seatContainer.innerHTML = 'Loading seats...';
  selectedSeatIds = [];
  try {
    const res = await fetch(`${apiBase}/api/seats`);
    const seats = await res.json();
    seatContainer.innerHTML = '';
    seats.forEach(s => {
      const d = document.createElement('div');
      d.className = 'seat' + (s.booked ? ' booked' : '');
      d.textContent = s.seat_number;
      d.dataset.id = s.id;
      if (!s.booked) {
        d.addEventListener('click', () => {
          if (d.classList.contains('selected')) {
            d.classList.remove('selected');
            selectedSeatIds = selectedSeatIds.filter(x => x !== s.id);
          } else {
            d.classList.add('selected');
            selectedSeatIds.push(s.id);
          }
        });
      }
      seatContainer.appendChild(d);
    });
  } catch (e) {
    seatContainer.innerHTML = 'Failed to load seats.';
  }
}

bookSeatsBtn.addEventListener('click', async () => {
  if (selectedSeatIds.length === 0) return alert('No seats selected.');
  try {
    const res = await fetch(`${apiBase}/api/book`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({seats:selectedSeatIds})
    });
    const data = await res.json();
    alert(data.message);
    await loadSeats();
  } catch (e) {
    alert('Booking failed.');
  }
});
