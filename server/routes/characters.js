const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/init');

// Alle Charaktere abrufen
router.get('/', (req, res) => {
  const db = getDatabase();
  db.all('SELECT * FROM characters ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Einzelnen Charakter abrufen
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get('SELECT * FROM characters WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Charakter nicht gefunden' });
      return;
    }
    res.json(row);
  });
});

// Neuen Charakter hinzufügen
router.post('/', (req, res) => {
  const db = getDatabase();
  const { name, description } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name ist erforderlich' });
    return;
  }
  
  db.run('INSERT INTO characters (name, description) VALUES (?, ?)', 
    [name, description || ''], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, description });
  });
});

// Charakter aktualisieren
router.put('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const { name, description } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name ist erforderlich' });
    return;
  }
  
  db.run('UPDATE characters SET name = ?, description = ? WHERE id = ?', 
    [name, description || '', id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Charakter nicht gefunden' });
      return;
    }
    res.json({ id, name, description });
  });
});

// Charakter löschen
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.run('DELETE FROM characters WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Charakter nicht gefunden' });
      return;
    }
    res.json({ message: 'Charakter erfolgreich gelöscht' });
  });
});

module.exports = router;
