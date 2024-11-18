const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

notes.get('/', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNotes = {
        title,
        text,
        note_id: uuidv4(),
        };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNotes,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  
  readFromFile('./db/db.json')
      .then((data) => {
          let notes = JSON.parse(data);
          if (!notes) {
              notes = [];
          }
          const updatedNotes = notes.filter((note) => note.note_id !== noteId);
          writeToFile('./db/db.json', updatedNotes);
          res.json({ message: 'Note deleted successfully' });
      })
      .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Failed to delete note' });
      });
});

module.exports = notes;