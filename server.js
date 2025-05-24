const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

const app = express();
const Database = require("./Database");

const db = new Database();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post("/register", async (req, res) => {
  try {
    const user = await db.registerUser(req.body);
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.loginUser(email, password);
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protected routes
app.get("/notes", authenticateToken, async (req, res) => {
  try {
    const { title } = req.query;
    const userId = req.user.userId;

    const notes = title 
      ? await db.getNotesByTitle(title, userId)
      : await db.getNotes(userId);

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/notes", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const note = await db.addNote(req.body, userId);
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/notes", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const note = await db.updateNote(req.body, userId);
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/notes/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;
    const note = await db.getNoteById(noteId, userId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/notes/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;
    const result = await db.deleteNoteById(noteId, userId);
    if (!result) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  db.connect();
});
