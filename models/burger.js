const orm = require("../config/orm.js");

const burger = {
  all: function(cb) {
    orm.all("burgers", cb);
  },
  create: function(cols, vals, cb) {
    orm.create("burgers", cols, vals, cb);
  },
  // id: numeric row id
  update: function(objColVals, id, cb) {
    orm.update("burgers", objColVals, id, cb);
  },
  delete: function(id, cb) {
    orm.delete("burgers", id, cb);
  }
};

module.exports = burger;
