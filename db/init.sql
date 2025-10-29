CREATE DATABASE IF NOT EXISTS airplane;
USE airplane;

CREATE TABLE IF NOT EXISTS seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seat_number VARCHAR(10),
  booked BOOLEAN DEFAULT 0
);

TRUNCATE TABLE seats;

INSERT INTO seats (seat_number,booked) VALUES
('1A',0),('1B',0),('1C',0),('1D',0),('1E',0),('1F',0),
('2A',0),('2B',0),('2C',0),('2D',0),('2E',0),('2F',0),
('3A',0),('3B',0),('3C',0),('3D',0),('3E',0),('3F',0);

