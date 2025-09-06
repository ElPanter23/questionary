const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/init');

// Get database statistics
router.get('/stats', (req, res) => {
  const db = getDatabase();
  
  db.serialize(() => {
    const stats = {};
    let completedQueries = 0;
    const totalQueries = 3;

    const checkComplete = () => {
      completedQueries++;
      if (completedQueries === totalQueries) {
        res.json(stats);
      }
    };

    // Count questions
    db.get('SELECT COUNT(*) as count FROM questions', (err, row) => {
      if (err) {
        console.error('Error counting questions:', err);
        stats.questionsCount = 0;
      } else {
        stats.questionsCount = row.count;
      }
      checkComplete();
    });

    // Count characters
    db.get('SELECT COUNT(*) as count FROM characters', (err, row) => {
      if (err) {
        console.error('Error counting characters:', err);
        stats.charactersCount = 0;
      } else {
        stats.charactersCount = row.count;
      }
      checkComplete();
    });

    // Count answered questions
    db.get('SELECT COUNT(*) as count FROM answered_questions', (err, row) => {
      if (err) {
        console.error('Error counting answered questions:', err);
        stats.answeredQuestionsCount = 0;
      } else {
        stats.answeredQuestionsCount = row.count;
      }
      checkComplete();
    });
  });
});

// Clear entire database
router.delete('/clear-db', (req, res) => {
  const db = getDatabase();
  
  db.serialize(() => {
    // Delete all data from all tables
    db.run('DELETE FROM answered_questions', (err) => {
      if (err) {
        console.error('Error clearing answered_questions:', err);
        return res.status(500).json({ error: 'Failed to clear answered_questions table' });
      }
    });

    db.run('DELETE FROM questions', (err) => {
      if (err) {
        console.error('Error clearing questions:', err);
        return res.status(500).json({ error: 'Failed to clear questions table' });
      }
    });

    db.run('DELETE FROM characters', (err) => {
      if (err) {
        console.error('Error clearing characters:', err);
        return res.status(500).json({ error: 'Failed to clear characters table' });
      }
    });

    // Reset auto-increment counters
    db.run('DELETE FROM sqlite_sequence WHERE name IN ("questions", "characters", "answered_questions")', (err) => {
      if (err) {
        console.error('Error resetting sequences:', err);
        return res.status(500).json({ error: 'Failed to reset sequences' });
      }
      
      res.json({ message: 'Database cleared successfully' });
    });
  });
});

// Preload example data
router.post('/preload-data', (req, res) => {
  const db = getDatabase();
  
  db.serialize(() => {
    // Example characters
    const sampleCharacters = [
      { name: 'Alice', description: 'Neugierige Abenteurerin' },
      { name: 'Bob', description: 'Weiser Mentor' },
      { name: 'Charlie', description: 'Kreativer Künstler' },
      { name: 'Diana', description: 'Strategische Denkerin' },
      { name: 'Eve', description: 'Mysteriöse Reisende' },
      { name: 'Frank', description: 'Technischer Experte' }
    ];

    // Example questions
    const sampleQuestions = [
      { text: 'Was ist dein größter Traum?', category: 'Persönlich', difficulty: 1 },
      { text: 'Welche Farbe beschreibt dich am besten?', category: 'Persönlich', difficulty: 1 },
      { text: 'Was würdest du tun, wenn du unsichtbar wärst?', category: 'Hypothetisch', difficulty: 2 },
      { text: 'Welches Buch hat dein Leben verändert?', category: 'Kultur', difficulty: 2 },
      { text: 'Was ist deine größte Angst?', category: 'Persönlich', difficulty: 3 },
      { text: 'Wenn du eine Superkraft haben könntest, welche wäre es?', category: 'Hypothetisch', difficulty: 1 },
      { text: 'Was ist dein Lieblingsgericht?', category: 'Alltag', difficulty: 1 },
      { text: 'Welcher Ort auf der Welt möchtest du unbedingt besuchen?', category: 'Reisen', difficulty: 2 },
      { text: 'Was war dein schönstes Erlebnis?', category: 'Persönlich', difficulty: 2 },
      { text: 'Welche Musik hörst du gerne?', category: 'Kultur', difficulty: 1 },
      { text: 'Was würdest du ändern, wenn du die Welt regieren könntest?', category: 'Hypothetisch', difficulty: 3 },
      { text: 'Welche Eigenschaft schätzt du an anderen am meisten?', category: 'Persönlich', difficulty: 2 },
      { text: 'Was ist dein Lieblingsfilm?', category: 'Kultur', difficulty: 1 },
      { text: 'Wo fühlst du dich am wohlsten?', category: 'Persönlich', difficulty: 1 },
      { text: 'Was ist dein größtes Ziel für dieses Jahr?', category: 'Persönlich', difficulty: 2 }
    ];

    let insertedCharacters = 0;
    let insertedQuestions = 0;
    let errors = [];

    // Insert characters
    sampleCharacters.forEach(character => {
      db.run('INSERT OR IGNORE INTO characters (name, description) VALUES (?, ?)', 
        [character.name, character.description], function(err) {
          if (err) {
            console.error('Error inserting character:', err);
            errors.push(`Character ${character.name}: ${err.message}`);
          } else if (this.changes > 0) {
            insertedCharacters++;
          }
        });
    });

    // Insert questions
    sampleQuestions.forEach(question => {
      db.run('INSERT OR IGNORE INTO questions (text, category, difficulty) VALUES (?, ?, ?)', 
        [question.text, question.category, question.difficulty], function(err) {
          if (err) {
            console.error('Error inserting question:', err);
            errors.push(`Question: ${err.message}`);
          } else if (this.changes > 0) {
            insertedQuestions++;
          }
        });
    });

    // Wait a bit for async operations to complete
    setTimeout(() => {
      res.json({ 
        message: 'Example data preloaded successfully',
        insertedCharacters,
        insertedQuestions,
        errors: errors.length > 0 ? errors : undefined
      });
    }, 1000);
  });
});

module.exports = router;
