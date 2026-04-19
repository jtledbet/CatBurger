const express = require("express");
const router  = express.Router();
const burger  = require("../models/burger.js");

// GET all burgers and render the main page
router.get("/", function(req, res) {
  burger.all(function(data, err) {
    if (err) {
      console.error("GET / error:", err.message);
      return res.status(500).render("index", { burgers: [], dbError: true });
    }
    res.render("index", { burgers: data });
  });
});

// POST — create a new burger
router.post("/api/burgers", function(req, res) {
  const name = (req.body.name || "").trim();
  if (!name) {
    return res.status(400).json({ error: "Burger name is required." });
  }
  burger.create(["name", "devoured"], [name, false], function(result, err) {
    if (err) {
      console.error("POST /api/burgers error:", err.message);
      return res.status(500).json({ error: "Failed to create burger." });
    }
    res.json({ id: result.insertId });
  });
});

// PUT — toggle devoured status
router.put("/api/burgers/:id", function(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).end();

  const devoured = req.body.devoured === "true" || req.body.devoured === true ? 1 : 0;
  burger.update({ devoured }, id, function(result, err) {
    if (err) {
      console.error("PUT /api/burgers/:id error:", err.message);
      return res.status(500).end();
    }
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

  burger.delete(id, function(result, err) {
    if (err) {
      console.error("DELETE /api/burgers/:id error:", err.message);
      return res.status(500).end();
    }
    if (result.affectedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  });
});

module.exports = router;
