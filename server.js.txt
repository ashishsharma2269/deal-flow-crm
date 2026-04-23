const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Database
const db = new sqlite3.Database("./leads.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to SQLite DB");
});

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientName TEXT,
    projectType TEXT,
    source TEXT,
    contact TEXT,
    notes TEXT,
    followUpDate TEXT,
    stage TEXT
  )
`);

// Routes

// GET all leads
app.get("/leads", (req, res) => {
  db.all("SELECT * FROM leads", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// POST new lead
app.post("/leads", (req, res) => {
  const {
    clientName,
    projectType,
    source,
    contact,
    notes,
    followUpDate,
    stage,
  } = req.body;

  const query = `
    INSERT INTO leads 
    (clientName, projectType, source, contact, notes, followUpDate, stage)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [clientName, projectType, source, contact, notes, followUpDate, stage || "New Inquiry"],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// UPDATE lead
app.put("/leads/:id", (req, res) => {
  const { stage } = req.body;

  db.run(
    `UPDATE leads SET stage = ? WHERE id = ?`,
    [stage, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: true });
    }
  );
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});