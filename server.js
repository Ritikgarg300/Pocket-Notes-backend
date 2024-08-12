const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://ritik:ritik@cluster0.b7qgjwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema Definitions
const groupSchema = new mongoose.Schema({
  name: String,
  color: String,
  selected: Boolean,
});

const noteSchema = new mongoose.Schema({
  text: String,
  date: String,
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Ensure this is an ObjectId
});

const Group = mongoose.model('Group', groupSchema);
const Note = mongoose.model('Note', noteSchema);

// Routes

// Create a new group
app.post('/api/groups', async (req, res) => {
  try {
    const { name, color } = req.body;
    const newGroup = new Group({ name, color, selected: false });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all groups
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { text, groupId } = req.body;

    // Convert groupId to ObjectId if necessary
    const validGroupId = new mongoose.Types.ObjectId(groupId);

    const newNote = new Note({
      text,
      date: new Date().toLocaleString(),
      groupId: validGroupId,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get notes for a group
app.get('/api/notes/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;

    // Convert groupId to ObjectId if necessary
    const validGroupId = new mongoose.Types.ObjectId(groupId);

    const notes = await Note.find({ groupId: validGroupId });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
