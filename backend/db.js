const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "example",
  database: process.env.DB_NAME || "airplane"
});

connection.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

module.exports = connection;
