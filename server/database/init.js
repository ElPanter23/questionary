const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'questions.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  db.serialize(() => {
    // Fragen Tabelle
    db.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        category TEXT,
        difficulty INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Charaktere Tabelle
    db.run(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Beantwortete Fragen Tabelle (verhindert doppelte Fragen pro Charakter)
    db.run(`
      CREATE TABLE IF NOT EXISTS answered_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER,
        question_id INTEGER,
        answer_text TEXT,
        answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters (id),
        FOREIGN KEY (question_id) REFERENCES questions (id),
        UNIQUE(character_id, question_id)
      )
    `);

    // Beispiel-Daten einfügen
    //insertSampleData();
  });
};

const insertSampleData = () => {
  // Beispiel-Charaktere
  const sampleCharacters = [
    { name: 'Alice', description: 'Neugierige Abenteurerin' },
    { name: 'Bob', description: 'Weiser Mentor' },
    { name: 'Charlie', description: 'Kreativer Künstler' },
    { name: 'Diana', description: 'Strategische Denkerin' }
  ];

  sampleCharacters.forEach(character => {
    db.run('INSERT OR IGNORE INTO characters (name, description) VALUES (?, ?)', 
      [character.name, character.description]);
  });

  // Beispiel-Fragen
  const sampleQuestions = [
    { text: 'Was ist dein größter Traum?', category: 'Persönlich' },
    { text: 'Welche Farbe beschreibt dich am besten?', category: 'Persönlich' },
    { text: 'Was würdest du tun, wenn du unsichtbar wärst?', category: 'Hypothetisch' },
    { text: 'Welches Buch hat dein Leben verändert?', category: 'Kultur' },
    { text: 'Was ist deine größte Angst?', category: 'Persönlich' },
    { text: 'Wenn du eine Superkraft haben könntest, welche wäre es?', category: 'Hypothetisch' },
    { text: 'Was ist dein Lieblingsgericht?', category: 'Alltag' },
    { text: 'Welcher Ort auf der Welt möchtest du unbedingt besuchen?', category: 'Reisen' }
  ];

  sampleQuestions.forEach(question => {
    db.run('INSERT OR IGNORE INTO questions (text, category) VALUES (?, ?)', 
      [question.text, question.category]);
  });
};

const getDatabase = () => db;

module.exports = { initializeDatabase, getDatabase };
