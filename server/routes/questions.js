const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/init');
const ScraperService = require('../services/scraper.service');

const scraperService = new ScraperService();

// Alle Fragen abrufen
router.get('/', (req, res) => {
  const db = getDatabase();
  db.all('SELECT * FROM questions ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Einzelne Frage abrufen
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get('SELECT * FROM questions WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Frage nicht gefunden' });
      return;
    }
    res.json(row);
  });
});

// Neue Frage hinzufügen
router.post('/', (req, res) => {
  const db = getDatabase();
  const { text, category, difficulty } = req.body;
  
  if (!text) {
    res.status(400).json({ error: 'Fragentext ist erforderlich' });
    return;
  }
  
  db.run('INSERT INTO questions (text, category, difficulty) VALUES (?, ?, ?)', 
    [text, category || 'Allgemein', difficulty || 1], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, text, category, difficulty });
  });
});

// Mehrere Fragen hinzufügen (für Import)
router.post('/bulk', (req, res) => {
  const db = getDatabase();
  const { questions } = req.body;
  
  if (!Array.isArray(questions)) {
    res.status(400).json({ error: 'Fragen müssen als Array übergeben werden' });
    return;
  }
  
  const stmt = db.prepare('INSERT INTO questions (text, category, difficulty) VALUES (?, ?, ?)');
  let successCount = 0;
  let errorCount = 0;
  
  questions.forEach(question => {
    stmt.run([question.text, question.category || 'Allgemein', question.difficulty || 1], (err) => {
      if (err) {
        errorCount++;
      } else {
        successCount++;
      }
    });
  });
  
  stmt.finalize();
  res.json({ 
    success: successCount, 
    errors: errorCount,
    message: `${successCount} Fragen erfolgreich hinzugefügt, ${errorCount} Fehler`
  });
});

// Frage löschen
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.run('DELETE FROM questions WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Frage nicht gefunden' });
      return;
    }
    res.json({ message: 'Frage erfolgreich gelöscht' });
  });
});

// Fragen von 100-fragen.de scrapen
router.post('/scrape/100fragen', async (req, res) => {
  try {
    const { category = 'all' } = req.body;
    const questions = await scraperService.scrapeFrom100Fragen(category);
    
    if (questions.length === 0) {
      res.status(404).json({ error: 'Keine Fragen gefunden' });
      return;
    }

    // Fragen in die Datenbank einfügen
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO questions (text, category, difficulty) VALUES (?, ?, ?)');
    let successCount = 0;
    let errorCount = 0;

    questions.forEach(question => {
      stmt.run([question.text, question.category, question.difficulty], (err) => {
        if (err) {
          errorCount++;
        } else {
          successCount++;
        }
      });
    });

    stmt.finalize();
    
    res.json({
      success: successCount,
      errors: errorCount,
      total: questions.length,
      message: `${successCount} Fragen erfolgreich importiert, ${errorCount} Fehler`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fragen von benutzerdefinierter URL scrapen
router.post('/scrape/custom', async (req, res) => {
  try {
    const { url, category = 'Gescrapt', difficulty = 2 } = req.body;
    
    if (!url) {
      res.status(400).json({ error: 'URL ist erforderlich' });
      return;
    }

    // URL testen
    const isReachable = await scraperService.testUrl(url);
    if (!isReachable) {
      res.status(400).json({ error: 'URL ist nicht erreichbar' });
      return;
    }

    const questions = await scraperService.scrapeFromCustomUrl(url, { category, difficulty });
    
    if (questions.length === 0) {
      res.status(404).json({ error: 'Keine Fragen gefunden' });
      return;
    }

    // Fragen in die Datenbank einfügen
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO questions (text, category, difficulty) VALUES (?, ?, ?)');
    let successCount = 0;
    let errorCount = 0;

    questions.forEach(question => {
      stmt.run([question.text, question.category, question.difficulty], (err) => {
        if (err) {
          errorCount++;
        } else {
          successCount++;
        }
      });
    });

    stmt.finalize();
    
    res.json({
      success: successCount,
      errors: errorCount,
      total: questions.length,
      message: `${successCount} Fragen erfolgreich importiert, ${errorCount} Fehler`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verfügbare Kategorien für 100-fragen.de
router.get('/scrape/categories', (req, res) => {
  const categories = [
    { key: 'all', name: 'Alle Fragen', description: 'Alle verfügbaren Fragen' },
    { key: 'personal', name: 'Persönlich', description: 'Persönliche Fragen' },
    { key: 'deep', name: 'Tiefgreifend', description: 'Tiefgreifende Fragen' },
    { key: 'fun', name: 'Spaß', description: 'Spaßige Fragen' },
    { key: 'relationship', name: 'Beziehung', description: 'Beziehungsfragen' },
    { key: 'work', name: 'Beruf', description: 'Berufliche Fragen' }
  ];
  
  res.json(categories);
});

module.exports = router;
