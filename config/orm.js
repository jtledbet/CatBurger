const connection = require("../config/connection.js");

// Helper: generate N comma-separated "?" placeholders
function placeholders(num) {
  return Array(num).fill("?").join(", ");
}

// Helper: convert { key: val } to ["key=?", ...] and [val, ...] for parameterized SET clauses
function objToSqlParams(ob) {
  const setClauses = [];
  const values = [];
  for (const key of Object.keys(ob)) {
    if (Object.prototype.hasOwnProperty.call(ob, key)) {
      setClauses.push(`${key} = ?`);
      values.push(ob[key]);
    }
  }
  return { setClauses: setClauses.join(", "), values };
}

const orm = {
  all: function(table, cb) {
    const sql = "SELECT * FROM ??";
    connection.query(sql, [table], function(err, result) {
      if (err) {
        console.error("ORM.all error:", err.message);
        return cb(null, err);
      }
      cb(result);
    });
  },

  create: function(table, cols, vals, cb) {
    const sql = `INSERT INTO ?? (${cols.map(() => "??").join(", ")}) VALUES (${placeholders(vals.length)})`;
    connection.query(sql, [table, ...cols, ...vals], function(err, result) {
      if (err) {
        console.error("ORM.create error:", err.message);
        return cb(null, err);
      }
      cb(result);
    });
  },

  // objColVals: e.g. { devoured: true }
  // idValue: the numeric id of the row to update
  update: function(table, objColVals, idValue, cb) {
    const { setClauses, values } = objToSqlParams(objColVals);
    const sql = `UPDATE ?? SET ${setClauses} WHERE id = ?`;
    connection.query(sql, [table, ...values, idValue], function(err, result) {
      if (err) {
        console.error("ORM.update error:", err.message);
        return cb(null, err);
      }
      cb(result);
    });
  },

  // idValue: the numeric id of the row to delete
  delete: function(table, idValue, cb) {
    const sql = "DELETE FROM ?? WHERE id = ?";
    connection.query(sql, [table, idValue], function(err, result) {
      if (err) {
        console.error("ORM.delete error:", err.message);
        return cb(null, err);
      }
      cb(result);
    });
  }
};

module.exports = orm;
