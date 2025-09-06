const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/init');

// Zufällige Frage für einen Charakter abrufen
router.get('/question/:characterId', (req, res) => {
  const db = getDatabase();
  const { characterId } = req.params;
  const { season } = req.query;
  
  // Prüfen ob Charakter existiert
  db.get('SELECT * FROM characters WHERE id = ?', [characterId], (err, character) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!character) {
      res.status(404).json({ error: 'Charakter nicht gefunden' });
      return;
    }
    
    // Query für Fragen basierend auf Season-Filter
    let query, params;
    
    if (season && season !== '') {
      // Spezifische Season filtern
      query = `
        SELECT q.* FROM questions q
        LEFT JOIN answered_questions aq ON q.id = aq.question_id AND aq.character_id = ?
        WHERE aq.question_id IS NULL AND q.difficulty = ?
        ORDER BY RANDOM()
        LIMIT 1
      `;
      params = [characterId, parseInt(season)];
    } else {
      // Alle Seasons (kein Filter)
      query = `
        SELECT q.* FROM questions q
        LEFT JOIN answered_questions aq ON q.id = aq.question_id AND aq.character_id = ?
        WHERE aq.question_id IS NULL
        ORDER BY RANDOM()
        LIMIT 1
      `;
      params = [characterId];
    }
    
    db.get(query, params, (err, question) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!question) {
        const seasonText = season ? ` für Season ${season}` : '';
        res.status(404).json({ 
          error: `Keine verfügbaren Fragen für diesen Charakter${seasonText}`,
          message: season ? `Alle Fragen der Season ${season} wurden bereits beantwortet` : 'Alle Fragen wurden bereits beantwortet'
        });
        return;
      }
      
      res.json({
        character,
        question
      });
    });
  });
});

// Frage als beantwortet markieren
router.post('/answer', (req, res) => {
  const db = getDatabase();
  const { characterId, questionId, answerText } = req.body;
  
  if (!characterId || !questionId) {
    res.status(400).json({ error: 'Charakter-ID und Frage-ID sind erforderlich' });
    return;
  }
  
  if (!answerText || answerText.trim() === '') {
    res.status(400).json({ error: 'Antworttext ist erforderlich' });
    return;
  }
  
  db.run('INSERT INTO answered_questions (character_id, question_id, answer_text) VALUES (?, ?, ?)', 
    [characterId, questionId, answerText.trim()], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: 'Diese Frage wurde bereits beantwortet' });
        return;
      }
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Frage als beantwortet markiert' });
  });
});

// Status für alle Charaktere abrufen (wie viele Fragen beantwortet)
router.get('/status', (req, res) => {
  const db = getDatabase();
  const query = `
    SELECT 
      c.id,
      c.name,
      c.description,
      COUNT(aq.question_id) as answered_count,
      (SELECT COUNT(*) FROM questions) as total_questions
    FROM characters c
    LEFT JOIN answered_questions aq ON c.id = aq.character_id
    GROUP BY c.id, c.name, c.description
    ORDER BY c.name
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Reset: Alle Antworten für einen Charakter löschen
router.delete('/reset/:characterId', (req, res) => {
  const db = getDatabase();
  const { characterId } = req.params;
  
  db.run('DELETE FROM answered_questions WHERE character_id = ?', [characterId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      message: `Alle Antworten für Charakter ${characterId} wurden zurückgesetzt`,
      deletedCount: this.changes
    });
  });
});

// Reset: Alle Antworten für alle Charaktere löschen
router.delete('/reset-all', (req, res) => {
  const db = getDatabase();
  
  db.run('DELETE FROM answered_questions', function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      message: 'Alle Antworten wurden zurückgesetzt',
      deletedCount: this.changes
    });
  });
});

// Alle Antworten für einen Charakter abrufen (geordnet nach ID)
router.get('/answers/:characterId', (req, res) => {
  const db = getDatabase();
  const { characterId } = req.params;
  
  // Prüfen ob Charakter existiert
  db.get('SELECT * FROM characters WHERE id = ?', [characterId], (err, character) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!character) {
      res.status(404).json({ error: 'Charakter nicht gefunden' });
      return;
    }
    
    // Alle Antworten für diesen Charakter mit Fragen abrufen (geordnet nach ID)
    const query = `
      SELECT 
        aq.id,
        aq.character_id,
        aq.question_id,
        aq.answer_text,
        aq.answered_at,
        q.text as question_text,
        q.category as question_category,
        q.difficulty as question_difficulty,
        q.created_at as question_created_at
      FROM answered_questions aq
      JOIN questions q ON aq.question_id = q.id
      WHERE aq.character_id = ?
      ORDER BY aq.id ASC
    `;
    
    db.all(query, [characterId], (err, answers) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Antworten in das erwartete Format umwandeln
      const formattedAnswers = answers.map(answer => ({
        id: answer.id,
        character_id: answer.character_id,
        question_id: answer.question_id,
        answer_text: answer.answer_text,
        answered_at: answer.answered_at,
        question: {
          id: answer.question_id,
          text: answer.question_text,
          category: answer.question_category,
          difficulty: answer.question_difficulty,
          created_at: answer.question_created_at
        }
      }));
      
      res.json({
        character,
        answers: formattedAnswers
      });
    });
  });
});

module.exports = router;
