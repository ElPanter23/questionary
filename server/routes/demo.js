const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage for demo sessions
// In production, this should be stored in Redis or a database
const demoSessions = new Map();

// Sample demo data
const sampleCharacters = [
  { id: 1, name: 'Alice', description: 'Curious adventurer who loves exploring new places' },
  { id: 2, name: 'Bob', description: 'Creative artist with a passion for music and painting' },
  { id: 3, name: 'Charlie', description: 'Tech enthusiast who enjoys solving puzzles' },
  { id: 4, name: 'Diana', description: 'Nature lover who finds peace in the outdoors' },
  { id: 5, name: 'Eve', description: 'Bookworm with a love for fantasy and science fiction' }
];

const sampleQuestions = [
  { id: 1, text: 'What is your biggest dream?', category: 'Personal', difficulty: 1 },
  { id: 2, text: 'If you could have any superpower, what would it be?', category: 'Fun', difficulty: 1 },
  { id: 3, text: 'What is your favorite way to spend a weekend?', category: 'Personal', difficulty: 1 },
  { id: 4, text: 'If you could travel anywhere in the world, where would you go?', category: 'Travel', difficulty: 2 },
  { id: 5, text: 'What is something you\'ve always wanted to learn?', category: 'Learning', difficulty: 2 },
  { id: 6, text: 'Describe your ideal day from morning to night.', category: 'Personal', difficulty: 2 },
  { id: 7, text: 'What is the most important lesson you\'ve learned in life?', category: 'Philosophy', difficulty: 3 },
  { id: 8, text: 'If you could have dinner with anyone, living or dead, who would it be?', category: 'Personal', difficulty: 3 },
  { id: 9, text: 'What is something that always makes you smile?', category: 'Personal', difficulty: 1 },
  { id: 10, text: 'If you could change one thing about the world, what would it be?', category: 'Philosophy', difficulty: 4 },
  { id: 11, text: 'What is your favorite childhood memory?', category: 'Personal', difficulty: 2 },
  { id: 12, text: 'If you could live in any time period, when would it be?', category: 'History', difficulty: 3 },
  { id: 13, text: 'What is something you\'re grateful for today?', category: 'Personal', difficulty: 1 },
  { id: 14, text: 'If you could be any animal, what would you be and why?', category: 'Fun', difficulty: 2 },
  { id: 15, text: 'What is the best advice you\'ve ever received?', category: 'Personal', difficulty: 3 },
  { id: 16, text: 'If you could invent something, what would it be?', category: 'Creative', difficulty: 3 },
  { id: 17, text: 'What is your favorite way to relax?', category: 'Personal', difficulty: 1 },
  { id: 18, text: 'If you could master any skill instantly, what would it be?', category: 'Learning', difficulty: 2 },
  { id: 19, text: 'What is something that inspires you?', category: 'Personal', difficulty: 2 },
  { id: 20, text: 'If you could give your younger self one piece of advice, what would it be?', category: 'Personal', difficulty: 4 }
];

// Cleanup expired sessions (run every 5 minutes)
setInterval(() => {
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  for (const [sessionId, session] of demoSessions.entries()) {
    if (now - session.lastActivity > thirtyMinutes) {
      demoSessions.delete(sessionId);
      console.log(`Cleaned up expired demo session: ${sessionId}`);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Helper function to update session activity
function updateSessionActivity(sessionId) {
  if (demoSessions.has(sessionId)) {
    demoSessions.get(sessionId).lastActivity = Date.now();
  }
}

// Helper function to get random question for character
function getRandomQuestionForCharacter(characterId, season = null) {
  const availableQuestions = sampleQuestions.filter(q => {
    if (season && q.difficulty !== season) return false;
    return true;
  });
  
  if (availableQuestions.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const question = availableQuestions[randomIndex];
  const character = sampleCharacters.find(c => c.id === characterId);
  
  return {
    character: character,
    question: question
  };
}

// Start a new demo session
router.post('/start', (req, res) => {
  try {
    const sessionId = uuidv4();
    const now = Date.now();
    
    // Initialize session data
    const session = {
      sessionId: sessionId,
      createdAt: now,
      lastActivity: now,
      characters: [...sampleCharacters],
      questions: [...sampleQuestions],
      answers: [],
      characterAnswers: new Map() // characterId -> array of answers
    };
    
    demoSessions.set(sessionId, session);
    
    console.log(`Created new demo session: ${sessionId}`);
    res.json({ sessionId: sessionId });
  } catch (error) {
    console.error('Error creating demo session:', error);
    res.status(500).json({ error: 'Failed to create demo session' });
  }
});

// Validate demo session
router.get('/validate/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = demoSessions.get(sessionId);
    
    if (!session) {
      return res.json({ valid: false });
    }
    
    // Update last activity
    updateSessionActivity(sessionId);
    
    res.json({ valid: true });
  } catch (error) {
    console.error('Error validating demo session:', error);
    res.status(500).json({ error: 'Failed to validate demo session' });
  }
});

// Get demo characters
router.get('/:sessionId/characters', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = demoSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Demo session not found' });
    }
    
    updateSessionActivity(sessionId);
    res.json(session.characters);
  } catch (error) {
    console.error('Error getting demo characters:', error);
    res.status(500).json({ error: 'Failed to get demo characters' });
  }
});

// Get demo questions
router.get('/:sessionId/questions', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = demoSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Demo session not found' });
    }
    
    updateSessionActivity(sessionId);
    res.json(session.questions);
  } catch (error) {
    console.error('Error getting demo questions:', error);
    res.status(500).json({ error: 'Failed to get demo questions' });
  }
});

// Get random question for character
router.get('/:sessionId/question/:characterId', (req, res) => {
  try {
    const { sessionId, characterId } = req.params;
    const { season } = req.query;
    const session = demoSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Demo session not found' });
    }
    
    updateSessionActivity(sessionId);
    
    const character = session.characters.find(c => c.id === parseInt(characterId));
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    const gameQuestion = getRandomQuestionForCharacter(parseInt(characterId), season ? parseInt(season) : null);
    
    if (!gameQuestion) {
      return res.status(404).json({ error: 'No questions available' });
    }
    
    res.json(gameQuestion);
  } catch (error) {
    console.error('Error getting random demo question:', error);
    res.status(500).json({ error: 'Failed to get random question' });
  }
});

// Mark question as answered
router.post('/:sessionId/answer', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { characterId, questionId, answerText } = req.body;
    const session = demoSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Demo session not found' });
    }
    
    updateSessionActivity(sessionId);
    
    const answer = {
      id: Date.now(), // Simple ID generation
      characterId: parseInt(characterId),
      questionId: parseInt(questionId),
      answerText: answerText,
      answeredAt: new Date().toISOString(),
      question: session.questions.find(q => q.id === parseInt(questionId))
    };
    
    // Add to session answers
    session.answers.push(answer);
    
    // Add to character-specific answers
    if (!session.characterAnswers.has(parseInt(characterId))) {
      session.characterAnswers.set(parseInt(characterId), []);
    }
    session.characterAnswers.get(parseInt(characterId)).push(answer);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving demo answer:', error);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

// Get character status
router.get('/:sessionId/status', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = demoSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Demo session not found' });
    }
    
    updateSessionActivity(sessionId);
    
    const characterStatus = session.characters.map(character => {
      const characterAnswers = session.characterAnswers.get(character.id) || [];
      const totalQuestions = session.questions.length;
      
      return {
        id: character.id,
        name: character.name,
        description: character.description,
        answered_count: characterAnswers.length,
        total_questions: totalQuestions
      };
    });
    
    res.json(characterStatus);
  } catch (error) {
    console.error('Error getting demo character status:', error);
    res.status(500).json({ error: 'Failed to get character status' });
  }
});

// Reset character
router.delete('/:sessionId/reset/:characterId', (req, res) => {
  try {
    const { sessionId, characterId } = req.params;
    const session = demoSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Demo session not found' });
    }
    
    updateSessionActivity(sessionId);
    
    // Remove character answers
    session.characterAnswers.delete(parseInt(characterId));
    
    // Remove from session answers
    session.answers = session.answers.filter(a => a.characterId !== parseInt(characterId));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting demo character:', error);
    res.status(500).json({ error: 'Failed to reset character' });
  }
});

// Reset all characters
router.delete('/:sessionId/reset-all', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = demoSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Demo session not found' });
    }
    
    updateSessionActivity(sessionId);
    
    // Clear all answers
    session.answers = [];
    session.characterAnswers.clear();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting all demo characters:', error);
    res.status(500).json({ error: 'Failed to reset all characters' });
  }
});

// Get character answers
router.get('/:sessionId/answers/:characterId', (req, res) => {
  try {
    const { sessionId, characterId } = req.params;
    const session = demoSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Demo session not found' });
    }
    
    updateSessionActivity(sessionId);
    
    const character = session.characters.find(c => c.id === parseInt(characterId));
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    const characterAnswers = session.characterAnswers.get(parseInt(characterId)) || [];
    
    res.json({
      character: character,
      answers: characterAnswers
    });
  } catch (error) {
    console.error('Error getting demo character answers:', error);
    res.status(500).json({ error: 'Failed to get character answers' });
  }
});

module.exports = router;
