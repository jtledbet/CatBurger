const express = require("express");
const router  = express.Router();
const burger  = require("../models/burger.js");

// GET all burgers and render the main page
router.get("/", function(req, res) {
  burger.all(function(data) {
    res.render("index", { burgers: data });
  });
});

// POST — create a new burger
router.post("/api/burgers", function(req, res) {
  const name = (req.body.name || "").trim();
  if (!name) {
    return res.status(400).json({ error: "Burger name is required." });
  }
  burger.create(["name", "devoured"], [name, false], function(result) {
    res.json({ id: result.insertId });
  });
});

// PUT — toggle devoured status
router.put("/api/burgers/:id", function(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).end();

  burger.update({ devoured: req.body.devoured }, id, function(result) {
    if (result.affectedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  });
});

// DELETE — remove a burger
router.delete("/api/burgers/:id", function(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).end();

  burger.delete(id, function(result) {
    if (result.affectedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  });
});

module.exports = router;
