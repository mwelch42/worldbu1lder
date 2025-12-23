import express from "express";
import multer from "multer";
import sqlite3 from "sqlite3";

const app = express();
const upload = multer({ dest: "uploads/" });
const db = new sqlite3.Database("db.sqlite");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS worlds (
    id INTEGER PRIMARY KEY,
    name TEXT,
    rules TEXT,
    base_map TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS maps (
    id INTEGER PRIMARY KEY,
    world_id INTEGER,
    parent_id INTEGER,
    name TEXT,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY,
    world_id INTEGER,
    name TEXT,
    bio TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS art (
    id INTEGER PRIMARY KEY,
    character_id INTEGER,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lore (
    id INTEGER PRIMARY KEY,
    world_id INTEGER,
    text TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY,
    world_id INTEGER,
    text TEXT
  )`);
});

/* ---------- ROUTES ---------- */

app.post("/world", upload.single("map"), (req, res) => {
  db.run(
    `INSERT INTO worlds (name, rules, base_map) VALUES (?, ?, ?)`,
    [req.body.name, req.body.rules, req.file.path],
    () => res.redirect("/")
  );
});

app.post("/map", upload.single("image"), (req, res) => {
  db.run(
    `INSERT INTO maps (world_id, parent_id, name, image)
     VALUES (?, ?, ?, ?)`,
    [req.body.world_id, req.body.parent_id || null, req.body.name, req.file.path],
    () => res.redirect("/")
  );
});

app.post("/character", (req, res) => {
  db.run(
    `INSERT INTO characters (world_id, name, bio) VALUES (?, ?, ?)`,
    [req.body.world_id, req.body.name, req.body.bio],
    () => res.redirect("/")
  );
});

app.post("/art", upload.single("image"), (req, res) => {
  db.run(
    `INSERT INTO art (character_id, image) VALUES (?, ?)`,
    [req.body.character_id, req.file.path],
    () => res.redirect("/")
  );
});

app.post("/lore", (req, res) => {
  db.run(
    `INSERT INTO lore (world_id, text) VALUES (?, ?)`,
    [req.body.world_id, req.body.text],
    () => res.redirect("/")
  );
});

app.post("/story", (req, res) => {
  db.run(
    `INSERT INTO stories (world_id, text) VALUES (?, ?)`,
    [req.body.world_id, req.body.text],
    () => res.redirect("/")
  );
});

/* ---------- AI STUB ---------- */
app.post("/check", (req, res) => {
  if (req.body.text.includes("spaceship"))
    return res.send("CONFLICT: advanced tech detected");
  res.send("OK");
});

app.listen(3000, () => console.log("Running"));
