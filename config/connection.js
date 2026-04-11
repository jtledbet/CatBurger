require("dotenv").config();
const mysql = require("mysql2");

let connection;

// Support DATABASE_URL (Render + Railway style) or individual env vars (local dev)
if (process.env.DATABASE_URL) {
  connection = mysql.createConnection(process.env.DATABASE_URL);
} else {
  connection = mysql.createConnection({
    host:     process.env.DB_HOST     || "localhost",
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME     || "catburger_db"
  });
}

connection.connect(function(err) {
  if (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL (thread id:", connection.threadId + ")");
});

module.exports = connection;
