require("dotenv").config();
const mysql = require("mysql2");

// Build connection config from DATABASE_URL (Railway/Render) or fall back to
// individual Railway MySQL variables, then to local-dev defaults.
// mysql2 does not reliably parse a connection string URL, so we always extract
// the individual parameters ourselves.
function buildConfig() {
  if (process.env.DATABASE_URL) {
    try {
      const u = new URL(process.env.DATABASE_URL);
      return {
        host:     u.hostname,
        port:     parseInt(u.port, 10) || 3306,
        user:     decodeURIComponent(u.username),
        password: decodeURIComponent(u.password),
        database: u.pathname.replace(/^\//, "")
      };
    } catch (e) {
      console.error("Failed to parse DATABASE_URL, falling back to individual vars:", e.message);
    }
  }

  // Railway injects these automatically when a MySQL service is linked
  if (process.env.MYSQLHOST) {
    return {
      host:     process.env.MYSQLHOST,
      port:     parseInt(process.env.MYSQLPORT, 10) || 3306,
      user:     process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE
    };
  }

  // Local development defaults
  return {
    host:     process.env.DB_HOST     || "localhost",
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME     || "catburger_db"
  };
}

const connection = mysql.createConnection(buildConfig());

connection.connect(function(err) {
  if (err) {
    // Log the error but do not crash the process — the ORM layer will surface
    // per-query errors to callers rather than taking down the whole server.
    console.error("Database connection error:", err.code, err.message);
    return;
  }
  console.log("Connected to MySQL (thread id:", connection.threadId + ")");
});

module.exports = connection;
