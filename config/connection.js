// Set up MySQL connection.
mysql = require("mysql");
require("dotenv").config();
var connection = null;

if (process.env.JAWSDB_GRAY_URL)
    connection = mysql.createConnection(process.env.JAWSDB_GRAY_URL)
else {
    connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
}

// Make connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Export connection for our ORM to use.
module.exports = connection;
