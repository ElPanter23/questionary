import { Injectable, signal } from '@angular/core';

export type Language = 'de' | 'en' | 'es' | 'fr';

export interface Translation {
  // Navigation
  game: string;
  characters: string;
  questions: string;
  admin: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  back: string;
  next: string;
  previous: string;
  
  // Theme
  lightMode: string;
  darkMode: string;
  toggleTheme: string;
  
  // Language
  selectLanguage: string;
  language: string;
  
  // App specific
  questionTool: string;
  discoverCharacters: string;
  
  // Game component
  questionCharacterGame: string;
  selectCharacter: string;
  selectSeason: string;
  allSeasons: string;
  noDescription: string;
  noCharactersAvailable: string;
  manageCharacters: string;
  currentQuestion: string;
  category: string;
  season: string;
  yourAnswer: string;
  enterAnswerHere: string;
  saveAnswer: string;
  newQuestion: string;
  allQuestionsAnswered: string;
  allQuestionsAnsweredFor: string;
  resetCharacter: string;
  answerSaved: string;
  characterReset: string;
  errorLoadingCharacters: string;
  errorAddingCharacter: string;
  errorLoadingQuestion: string;
  errorSaving: string;
  errorResetting: string;
  confirmResetAll: string;
  allCharactersReset: string;
  errorLoadingQuestions: string;
  errorLoadingStats: string;
  
  // Characters component
  manageCharactersTitle: string;
  addNewCharacter: string;
  name: string;
  description: string;
  addCharacter: string;
  adding: string;
  existingCharacters: string;
  noCharactersYet: string;
  created: string;
  details: string;
  editCharacter: string;
  editCharacterTitle: string;
  saving: string;
  cancelEdit: string;
  confirmDeleteCharacter: string;
  characterAdded: string;
  characterUpdated: string;
  characterDeleted: string;
  errorAdding: string;
  errorUpdating: string;
  errorDeleting: string;
  characterDetails: string;
  close: string;
  id: string;
  statistics: string;
  answeredQuestions: string;
  availableQuestions: string;
  progress: string;
  startGame: string;
  resetProgress: string;
  questionsAndAnswers: string;
  answeredOn: string;
  noQuestionsAnsweredYet: string;
  startGameToAnswer: string;
  confirmResetProgress: string;
  progressReset: string;
  errorLoadingAnswers: string;
  
  // Questions component
  manageQuestions: string;
  addNewQuestion: string;
  questionText: string;
  seasonLevel: string;
  addQuestion: string;
  addingQuestion: string;
  importMultipleQuestions: string;
  addMultipleQuestions: string;
  questionsOnePerLine: string;
  standardCategory: string;
  importQuestions: string;
  importing: string;
  importFromWeb: string;
  importFrom100Fragen: string;
  selectCategory: string;
  importFrom100FragenButton: string;
  importFromCustomUrl: string;
  url: string;
  customCategory: string;
  customSeason: string;
  importFromUrlButton: string;
  existingQuestions: string;
  filterByCategory: string;
  allCategories: string;
  search: string;
  searchQuestionText: string;
  noQuestionsYet: string;
  noQuestionsMatchFilter: string;
  seasonLevelLabel: string;
  noValidQuestionsFound: string;
  questionAdded: string;
  questionsImported: string;
  questionDeleted: string;
  errorAddingQuestion: string;
  errorImporting: string;
  errorDeletingQuestion: string;
  errorScraping: string;
  pleaseEnterUrl: string;
  confirmDeleteQuestion: string;
  
  // Admin component
  adminInterface: string;
  databaseStatistics: string;
  questionsCount: string;
  charactersCount: string;
  answeredQuestionsCount: string;
  updateStatistics: string;
  databaseManagement: string;
  clearDatabase: string;
  clearDatabaseTooltip: string;
  loadExampleData: string;
  loadExampleDataTooltip: string;
  characterManagement: string;
  resetAllCharacters: string;
  resetAllCharactersTooltip: string;
  confirm: string;
  databaseCleared: string;
  exampleDataLoaded: string;
  errorClearingDatabase: string;
  errorLoadingExampleData: string;
  errorResettingCharacters: string;
  confirmClearDatabase: string;
  confirmClearDatabaseMessage: string;
  confirmLoadExampleData: string;
  confirmLoadExampleDataMessage: string;
  confirmResetAllCharacters: string;
  confirmResetAllCharactersMessage: string;
  
  // Placeholder texts
  placeholderCharacterName: string;
  placeholderCharacterDescription: string;
  placeholderQuestionText: string;
  placeholderCategory: string;
  placeholderSeason: string;
  placeholderMultipleQuestions: string;
  placeholderUrl: string;
  placeholderCustomCategory: string;
  
  // Demo mode
  demoMode: string;
  demoDescription: string;
  startNewDemo: string;
  startNewDemoDescription: string;
  startDemo: string;
  joinExistingDemo: string;
  joinExistingDemoDescription: string;
  enterDemoId: string;
  joinDemo: string;
  demoInfo: string;
  demoInfo1: string;
  demoInfo2: string;
  demoInfo3: string;
  sessionId: string;
  backToDemo: string;
  errorStartingDemo: string;
  pleaseEnterDemoId: string;
  invalidDemoId: string;
  errorValidatingDemo: string;
  noQuestionsAvailable: string;
  tryAgain: string;
  enterYourAnswer: string;
  markAsAnswered: string;
  skipQuestion: string;
  difficulty: string;
  or: string;
  
  // Additional demo translations
  easy: string;
  medium: string;
  hard: string;
  expert: string;
  unknown: string;
  showing: string;
  of: string;
  clearFilters: string;
  demoDisclaimer: string;
  demoModeDescription: string;
}

const translations: Record<Language, Translation> = {
  de: {
    // Navigation
    game: 'Spiel',
    characters: 'Charaktere',
    questions: 'Fragen',
    admin: 'Admin',
    
    // Common
    loading: 'Lädt...',
    error: 'Fehler',
    success: 'Erfolgreich',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Zurück',
    
    // Theme
    lightMode: 'Heller Modus',
    darkMode: 'Dunkler Modus',
    toggleTheme: 'Theme umschalten',
    
    // Language
    selectLanguage: 'Sprache wählen',
    language: 'Sprache',
    
    // App specific
    questionTool: 'Question Tool',
    discoverCharacters: 'Entdecke Charaktere durch zufällige Fragen',
    
    // Game component
    questionCharacterGame: 'Frage-Charakter-Spiel',
    selectCharacter: 'Wähle einen Charakter:',
    selectSeason: 'Wähle eine Staffel:',
    allSeasons: 'Alle Staffeln',
    noDescription: 'Keine Beschreibung',
    noCharactersAvailable: 'Keine Charaktere vorhanden. Erstelle zuerst einen Charakter!',
    manageCharacters: 'Charaktere verwalten',
    currentQuestion: 'Aktuelle Frage',
    category: 'Kategorie',
    season: 'Staffel',
    yourAnswer: 'Deine Antwort:',
    enterAnswerHere: 'Gib hier deine Antwort ein...',
    saveAnswer: 'Antwort speichern',
    newQuestion: 'Neue Frage',
    allQuestionsAnswered: 'Alle Fragen beantwortet!',
    allQuestionsAnsweredFor: 'Du hast alle verfügbaren Fragen für',
    resetCharacter: 'Charakter zurücksetzen',
    answerSaved: 'Antwort gespeichert!',
    characterReset: 'Charakter wurde zurückgesetzt!',
    errorLoadingCharacters: 'Fehler beim Laden der Charaktere:',
    errorAddingCharacter: 'Fehler beim Hinzufügen des Charakters:',
    errorLoadingQuestion: 'Fehler beim Laden der Frage:',
    errorSaving: 'Fehler beim Speichern:',
    errorResetting: 'Fehler beim Zurücksetzen:',
    confirmResetAll: 'Möchtest du wirklich alle Charaktere zurücksetzen?',
    allCharactersReset: 'Alle Charaktere wurden zurückgesetzt!',
    errorLoadingQuestions: 'Fehler beim Laden der Fragen:',
    // Characters component
    manageCharactersTitle: 'Charaktere verwalten',
    addNewCharacter: 'Neuen Charakter hinzufügen',
    name: 'Name',
    description: 'Beschreibung',
    addCharacter: 'Charakter hinzufügen',
    adding: 'Hinzufügen...',
    existingCharacters: 'Vorhandene Charaktere',
    noCharactersYet: 'Noch keine Charaktere vorhanden.',
    created: 'Erstellt:',
    details: 'Details',
    editCharacter: 'Bearbeiten',
    editCharacterTitle: 'Charakter bearbeiten',
    saving: 'Speichern...',
    cancelEdit: 'Abbrechen',
    confirmDeleteCharacter: 'Möchtest du diesen Charakter wirklich löschen?',
    characterAdded: 'Charakter erfolgreich hinzugefügt!',
    characterUpdated: 'Charakter erfolgreich aktualisiert!',
    characterDeleted: 'Charakter erfolgreich gelöscht!',
    errorAdding: 'Fehler beim Hinzufügen:',
    errorUpdating: 'Fehler beim Aktualisieren:',
    errorDeleting: 'Fehler beim Löschen:',
    characterDetails: 'Details',
    close: 'Schließen',
    id: 'ID:',
    statistics: 'Statistiken',
    answeredQuestions: 'Beantwortete Fragen',
    availableQuestions: 'Verfügbare Fragen',
    progress: 'Fortschritt',
    startGame: 'Spiel starten',
    resetProgress: 'Fortschritt zurücksetzen',
    questionsAndAnswers: 'Fragen & Antworten',
    answeredOn: 'Beantwortet am:',
    noQuestionsAnsweredYet: 'Noch keine Fragen beantwortet. Starte das Spiel, um Fragen zu beantworten!',
    startGameToAnswer: 'Starte das Spiel, um Fragen zu beantworten!',
    confirmResetProgress: 'Möchtest du den Fortschritt dieses Charakters wirklich zurücksetzen?',
    progressReset: 'Fortschritt erfolgreich zurückgesetzt!',
    errorLoadingStats: 'Fehler beim Laden der Statistiken:',
    errorLoadingAnswers: 'Fehler beim Laden der Antworten:',
    
    // Questions component
    manageQuestions: 'Fragen verwalten',
    addNewQuestion: 'Neue Frage hinzufügen',
    questionText: 'Fragentext',
    seasonLevel: 'Staffel (1-5)',
    addQuestion: 'Frage hinzufügen',
    addingQuestion: 'Hinzufügen...',
    importMultipleQuestions: 'Mehrere Fragen importieren',
    addMultipleQuestions: 'Füge mehrere Fragen gleichzeitig hinzu. Eine Frage pro Zeile:',
    questionsOnePerLine: 'Fragen (eine pro Zeile)',
    standardCategory: 'Standard-Kategorie',
    importQuestions: 'Fragen importieren',
    importing: 'Importieren...',
    importFromWeb: 'Fragen von Webseiten importieren',
    importFrom100Fragen: 'Von 100-fragen.de importieren',
    selectCategory: 'Kategorie',
    importFrom100FragenButton: 'Von 100-fragen.de importieren',
    importFromCustomUrl: 'Von beliebiger URL importieren',
    url: 'URL',
    customCategory: 'Kategorie',
    customSeason: 'Staffel (1-5)',
    importFromUrlButton: 'Von URL importieren',
    existingQuestions: 'Vorhandene Fragen',
    filterByCategory: 'Nach Kategorie filtern:',
    allCategories: 'Alle Kategorien',
    search: 'Suchen:',
    searchQuestionText: 'Fragentext durchsuchen',
    noQuestionsYet: 'Noch keine Fragen vorhanden.',
    noQuestionsMatchFilter: 'Keine Fragen entsprechen den Filterkriterien.',
    seasonLevelLabel: 'Staffel:',
    noValidQuestionsFound: 'Keine gültigen Fragen gefunden.',
    questionAdded: 'Frage erfolgreich hinzugefügt!',
    questionsImported: 'Fragen erfolgreich importiert!',
    questionDeleted: 'Frage erfolgreich gelöscht!',
    errorAddingQuestion: 'Fehler beim Hinzufügen:',
    errorImporting: 'Fehler beim Importieren:',
    errorDeletingQuestion: 'Fehler beim Löschen:',
    errorScraping: 'Fehler beim Scraping:',
    pleaseEnterUrl: 'Bitte gib eine URL ein',
    confirmDeleteQuestion: 'Möchtest du diese Frage wirklich löschen?',
    
    // Admin component
    adminInterface: 'Admin Interface',
    databaseStatistics: 'Datenbank Statistiken',
    questionsCount: 'Fragen',
    charactersCount: 'Charaktere',
    answeredQuestionsCount: 'Beantwortete Fragen',
    updateStatistics: 'Statistiken aktualisieren',
    databaseManagement: 'Datenbank Management',
    clearDatabase: 'Datenbank leeren',
    clearDatabaseTooltip: 'Löscht alle Daten aus der Datenbank',
    loadExampleData: 'Beispiel-Daten laden',
    loadExampleDataTooltip: 'Lädt Beispiel-Daten in die Datenbank',
    characterManagement: 'Charakter Management',
    resetAllCharacters: 'Alle Charaktere zurücksetzen',
    resetAllCharactersTooltip: 'Setzt alle Charaktere zurück (löscht beantwortete Fragen)',
    confirm: 'Bestätigen',
    databaseCleared: 'Datenbank wurde erfolgreich geleert',
    exampleDataLoaded: 'Beispiel-Daten wurden erfolgreich geladen',
    errorClearingDatabase: 'Fehler beim Leeren der Datenbank',
    errorLoadingExampleData: 'Fehler beim Laden der Beispiel-Daten',
    errorResettingCharacters: 'Fehler beim Zurücksetzen der Charaktere',
    confirmClearDatabase: 'Datenbank leeren',
    confirmClearDatabaseMessage: 'Möchten Sie wirklich alle Daten aus der Datenbank löschen? Diese Aktion kann nicht rückgängig gemacht werden!',
    confirmLoadExampleData: 'Beispiel-Daten laden',
    confirmLoadExampleDataMessage: 'Möchten Sie Beispiel-Daten in die Datenbank laden? Bestehende Daten werden nicht überschrieben.',
    confirmResetAllCharacters: 'Alle Charaktere zurücksetzen',
    confirmResetAllCharactersMessage: 'Möchten Sie wirklich alle Charaktere zurücksetzen? Alle beantworteten Fragen werden gelöscht.',
    
    // Placeholder texts
    placeholderCharacterName: 'z.B. Alice',
    placeholderCharacterDescription: 'z.B. Neugierige Abenteurerin',
    placeholderQuestionText: 'z.B. Was ist dein größter Traum?',
    placeholderCategory: 'z.B. Persönlich',
    placeholderSeason: '1',
    placeholderMultipleQuestions: 'Was ist dein größter Traum?\nWelche Farbe beschreibt dich am besten?\nWas würdest du tun, wenn du unsichtbar wärst?',
    placeholderUrl: 'https://example.com/questions',
    placeholderCustomCategory: 'z.B. Allgemein',
    
    // Demo mode
    demoMode: 'Demo-Modus',
    demoDescription: 'Teste das Question Tool mit Beispieldaten. Alle Daten werden nach 30 Minuten Inaktivität automatisch gelöscht.',
    startNewDemo: 'Neue Demo starten',
    startNewDemoDescription: 'Erstelle eine neue Demo-Session mit zufälliger ID',
    startDemo: 'Demo starten',
    joinExistingDemo: 'Bestehende Demo beitreten',
    joinExistingDemoDescription: 'Gib eine Demo-ID ein, um eine bestehende Session fortzusetzen',
    enterDemoId: 'Demo-ID eingeben',
    joinDemo: 'Beitreten',
    demoInfo: 'Demo-Informationen',
    demoInfo1: 'Alle Daten sind temporär und werden nach 30 Minuten Inaktivität gelöscht',
    demoInfo2: 'Du kannst die Demo-Session mit der ID jederzeit neu laden',
    demoInfo3: 'Es werden nur Beispieldaten verwendet, keine echten oder urheberrechtlich geschützten Inhalte',
    sessionId: 'Session-ID',
    backToDemo: 'Zurück zur Demo',
    errorStartingDemo: 'Fehler beim Starten der Demo:',
    pleaseEnterDemoId: 'Bitte gib eine Demo-ID ein',
    invalidDemoId: 'Ungültige Demo-ID',
    errorValidatingDemo: 'Fehler beim Validieren der Demo:',
    noQuestionsAvailable: 'Keine Fragen verfügbar',
    tryAgain: 'Erneut versuchen',
    enterYourAnswer: 'Gib deine Antwort ein',
    markAsAnswered: 'Als beantwortet markieren',
    skipQuestion: 'Frage überspringen',
    difficulty: 'Schwierigkeit',
    or: 'oder',
    
    // Additional demo translations
    easy: 'Einfach',
    medium: 'Mittel',
    hard: 'Schwer',
    expert: 'Experte',
    unknown: 'Unbekannt',
    showing: 'Zeige',
    of: 'von',
    clearFilters: 'Filter löschen',
    demoDisclaimer: 'Dies ist eine Demo-Version. Daten werden automatisch nach 30 Minuten Inaktivität gelöscht.',
    demoModeDescription: 'Erleben Sie das Frage-Charakter-System in einer sicheren Demo-Umgebung.'
  },
  en: {
    // Navigation
    game: 'Game',
    characters: 'Characters',
    questions: 'Questions',
    admin: 'Admin',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    
    // Theme
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    toggleTheme: 'Toggle Theme',
    
    // Language
    selectLanguage: 'Select Language',
    language: 'Language',
    
    // App specific
    questionTool: 'Question Tool',
    discoverCharacters: 'Discover characters through random questions',
    
    // Game component
    questionCharacterGame: 'Question-Character Game',
    selectCharacter: 'Choose a character:',
    selectSeason: 'Choose a season:',
    allSeasons: 'All Seasons',
    noDescription: 'No description',
    noCharactersAvailable: 'No characters available. Create a character first!',
    manageCharacters: 'Manage Characters',
    currentQuestion: 'Current Question',
    category: 'Category',
    season: 'Season',
    yourAnswer: 'Your Answer:',
    enterAnswerHere: 'Enter your answer here...',
    saveAnswer: 'Save Answer',
    newQuestion: 'New Question',
    allQuestionsAnswered: 'All questions answered!',
    allQuestionsAnsweredFor: 'You have answered all available questions for',
    resetCharacter: 'Reset Character',
    answerSaved: 'Answer saved!',
    characterReset: 'Character has been reset!',
    errorLoadingCharacters: 'Error loading characters:',
    errorAddingCharacter: 'Error adding character:',
    errorLoadingQuestion: 'Error loading question:',
    errorSaving: 'Error saving:',
    errorResetting: 'Error resetting:',
    confirmResetAll: 'Do you really want to reset all characters?',
    allCharactersReset: 'All characters have been reset!',
    errorLoadingQuestions: 'Error loading questions:',
    // Characters component
    manageCharactersTitle: 'Manage Characters',
    addNewCharacter: 'Add New Character',
    name: 'Name',
    description: 'Description',
    addCharacter: 'Add Character',
    adding: 'Adding...',
    existingCharacters: 'Existing Characters',
    noCharactersYet: 'No characters yet.',
    created: 'Created:',
    details: 'Details',
    editCharacter: 'Edit',
    editCharacterTitle: 'Edit Character',
    saving: 'Saving...',
    cancelEdit: 'Cancel',
    confirmDeleteCharacter: 'Do you really want to delete this character?',
    characterAdded: 'Character successfully added!',
    characterUpdated: 'Character successfully updated!',
    characterDeleted: 'Character successfully deleted!',
    errorAdding: 'Error adding:',
    errorUpdating: 'Error updating:',
    errorDeleting: 'Error deleting:',
    characterDetails: 'Details',
    close: 'Close',
    id: 'ID:',
    statistics: 'Statistics',
    answeredQuestions: 'Answered Questions',
    availableQuestions: 'Available Questions',
    progress: 'Progress',
    startGame: 'Start Game',
    resetProgress: 'Reset Progress',
    questionsAndAnswers: 'Questions & Answers',
    answeredOn: 'Answered on:',
    noQuestionsAnsweredYet: 'No questions answered yet. Start the game to answer questions!',
    startGameToAnswer: 'Start the game to answer questions!',
    confirmResetProgress: 'Do you really want to reset this character\'s progress?',
    progressReset: 'Progress successfully reset!',
    errorLoadingStats: 'Error loading statistics:',
    errorLoadingAnswers: 'Error loading answers:',
    
    // Questions component
    manageQuestions: 'Manage Questions',
    addNewQuestion: 'Add New Question',
    questionText: 'Question Text',
    seasonLevel: 'Season (1-5)',
    addQuestion: 'Add Question',
    addingQuestion: 'Adding...',
    importMultipleQuestions: 'Import Multiple Questions',
    addMultipleQuestions: 'Add multiple questions at once. One question per line:',
    questionsOnePerLine: 'Questions (one per line)',
    standardCategory: 'Standard Category',
    importQuestions: 'Import Questions',
    importing: 'Importing...',
    importFromWeb: 'Import Questions from Websites',
    importFrom100Fragen: 'Import from 100-fragen.de',
    selectCategory: 'Category',
    importFrom100FragenButton: 'Import from 100-fragen.de',
    importFromCustomUrl: 'Import from Custom URL',
    url: 'URL',
    customCategory: 'Category',
    customSeason: 'Season (1-5)',
    importFromUrlButton: 'Import from URL',
    existingQuestions: 'Existing Questions',
    filterByCategory: 'Filter by Category:',
    allCategories: 'All Categories',
    search: 'Search:',
    searchQuestionText: 'Search question text',
    noQuestionsYet: 'No questions yet.',
    noQuestionsMatchFilter: 'No questions match the filter criteria.',
    seasonLevelLabel: 'Season:',
    noValidQuestionsFound: 'No valid questions found.',
    questionAdded: 'Question successfully added!',
    questionsImported: 'Questions successfully imported!',
    questionDeleted: 'Question successfully deleted!',
    errorAddingQuestion: 'Error adding:',
    errorImporting: 'Error importing:',
    errorDeletingQuestion: 'Error deleting:',
    errorScraping: 'Error scraping:',
    pleaseEnterUrl: 'Please enter a URL',
    confirmDeleteQuestion: 'Do you really want to delete this question?',
    
    // Admin component
    adminInterface: 'Admin Interface',
    databaseStatistics: 'Database Statistics',
    questionsCount: 'Questions',
    charactersCount: 'Characters',
    answeredQuestionsCount: 'Answered Questions',
    updateStatistics: 'Update Statistics',
    databaseManagement: 'Database Management',
    clearDatabase: 'Clear Database',
    clearDatabaseTooltip: 'Deletes all data from the database',
    loadExampleData: 'Load Example Data',
    loadExampleDataTooltip: 'Loads example data into the database',
    characterManagement: 'Character Management',
    resetAllCharacters: 'Reset All Characters',
    resetAllCharactersTooltip: 'Resets all characters (deletes answered questions)',
    confirm: 'Confirm',
    databaseCleared: 'Database has been successfully cleared',
    exampleDataLoaded: 'Example data has been successfully loaded',
    errorClearingDatabase: 'Error clearing database',
    errorLoadingExampleData: 'Error loading example data',
    errorResettingCharacters: 'Error resetting characters',
    confirmClearDatabase: 'Clear Database',
    confirmClearDatabaseMessage: 'Do you really want to delete all data from the database? This action cannot be undone!',
    confirmLoadExampleData: 'Load Example Data',
    confirmLoadExampleDataMessage: 'Do you want to load example data into the database? Existing data will not be overwritten.',
    confirmResetAllCharacters: 'Reset All Characters',
    confirmResetAllCharactersMessage: 'Do you really want to reset all characters? All answered questions will be deleted.',
    
    // Placeholder texts
    placeholderCharacterName: 'e.g. Alice',
    placeholderCharacterDescription: 'e.g. Curious adventurer',
    placeholderQuestionText: 'e.g. What is your biggest dream?',
    placeholderCategory: 'e.g. Personal',
    placeholderSeason: '1',
    placeholderMultipleQuestions: 'What is your biggest dream?\nWhat color best describes you?\nWhat would you do if you were invisible?',
    placeholderUrl: 'https://example.com/questions',
    placeholderCustomCategory: 'e.g. General',
    
    // Demo mode
    demoMode: 'Demo Mode',
    demoDescription: 'Try the Question Tool with sample data. All data will be automatically deleted after 30 minutes of inactivity.',
    startNewDemo: 'Start New Demo',
    startNewDemoDescription: 'Create a new demo session with random ID',
    startDemo: 'Start Demo',
    joinExistingDemo: 'Join Existing Demo',
    joinExistingDemoDescription: 'Enter a demo ID to continue an existing session',
    enterDemoId: 'Enter Demo ID',
    joinDemo: 'Join',
    demoInfo: 'Demo Information',
    demoInfo1: 'All data is temporary and will be deleted after 30 minutes of inactivity',
    demoInfo2: 'You can reload the demo session using the ID at any time',
    demoInfo3: 'Only sample data is used, no real or copyrighted content',
    sessionId: 'Session ID',
    backToDemo: 'Back to Demo',
    errorStartingDemo: 'Error starting demo:',
    pleaseEnterDemoId: 'Please enter a demo ID',
    invalidDemoId: 'Invalid demo ID',
    errorValidatingDemo: 'Error validating demo:',
    noQuestionsAvailable: 'No questions available',
    tryAgain: 'Try Again',
    enterYourAnswer: 'Enter your answer',
    markAsAnswered: 'Mark as Answered',
    skipQuestion: 'Skip Question',
    difficulty: 'Difficulty',
    or: 'or',
    
    // Additional demo translations
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    unknown: 'Unknown',
    showing: 'Showing',
    of: 'of',
    clearFilters: 'Clear Filters',
    demoDisclaimer: 'This is a demo version. Data is automatically deleted after 30 minutes of inactivity.',
    demoModeDescription: 'Experience the question-character system in a safe demo environment.'
  },
  es: {
    // Navigation
    game: 'Juego',
    characters: 'Personajes',
    questions: 'Preguntas',
    admin: 'Admin',
    
    // Common
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    
    // Theme
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    toggleTheme: 'Cambiar Tema',
    
    // Language
    selectLanguage: 'Seleccionar Idioma',
    language: 'Idioma',
    
    // App specific
    questionTool: 'Herramienta de Preguntas',
    discoverCharacters: 'Descubre personajes a través de preguntas aleatorias',
    
    // Game component
    questionCharacterGame: 'Juego de Preguntas-Personajes',
    selectCharacter: 'Elige un personaje:',
    selectSeason: 'Elige una temporada:',
    allSeasons: 'Todas las Temporadas',
    noDescription: 'Sin descripción',
    noCharactersAvailable: 'No hay personajes disponibles. ¡Crea un personaje primero!',
    manageCharacters: 'Gestionar Personajes',
    currentQuestion: 'Pregunta Actual',
    category: 'Categoría',
    season: 'Temporada',
    yourAnswer: 'Tu Respuesta:',
    enterAnswerHere: 'Ingresa tu respuesta aquí...',
    saveAnswer: 'Guardar Respuesta',
    newQuestion: 'Nueva Pregunta',
    allQuestionsAnswered: '¡Todas las preguntas respondidas!',
    allQuestionsAnsweredFor: 'Has respondido todas las preguntas disponibles para',
    resetCharacter: 'Reiniciar Personaje',
    answerSaved: '¡Respuesta guardada!',
    characterReset: '¡El personaje ha sido reiniciado!',
    errorLoadingCharacters: 'Error cargando personajes:',
    errorAddingCharacter: 'Error agregando personaje:',
    errorLoadingQuestion: 'Error cargando pregunta:',
    errorSaving: 'Error guardando:',
    errorResetting: 'Error reiniciando:',
    confirmResetAll: '¿Realmente quieres reiniciar todos los personajes?',
    allCharactersReset: '¡Todos los personajes han sido reiniciados!',
    errorLoadingQuestions: 'Error cargando preguntas:',
    // Characters component
    manageCharactersTitle: 'Gestionar Personajes',
    addNewCharacter: 'Agregar Nuevo Personaje',
    name: 'Nombre',
    description: 'Descripción',
    addCharacter: 'Agregar Personaje',
    adding: 'Agregando...',
    existingCharacters: 'Personajes Existentes',
    noCharactersYet: 'Aún no hay personajes.',
    created: 'Creado:',
    details: 'Detalles',
    editCharacter: 'Editar',
    editCharacterTitle: 'Editar Personaje',
    saving: 'Guardando...',
    cancelEdit: 'Cancelar',
    confirmDeleteCharacter: '¿Realmente quieres eliminar este personaje?',
    characterAdded: '¡Personaje agregado exitosamente!',
    characterUpdated: '¡Personaje actualizado exitosamente!',
    characterDeleted: '¡Personaje eliminado exitosamente!',
    errorAdding: 'Error agregando:',
    errorUpdating: 'Error actualizando:',
    errorDeleting: 'Error eliminando:',
    characterDetails: 'Detalles',
    close: 'Cerrar',
    id: 'ID:',
    statistics: 'Estadísticas',
    answeredQuestions: 'Preguntas Respondidas',
    availableQuestions: 'Preguntas Disponibles',
    progress: 'Progreso',
    startGame: 'Iniciar Juego',
    resetProgress: 'Reiniciar Progreso',
    questionsAndAnswers: 'Preguntas y Respuestas',
    answeredOn: 'Respondido el:',
    noQuestionsAnsweredYet: 'Aún no hay preguntas respondidas. ¡Inicia el juego para responder preguntas!',
    startGameToAnswer: '¡Inicia el juego para responder preguntas!',
    confirmResetProgress: '¿Realmente quieres reiniciar el progreso de este personaje?',
    progressReset: '¡Progreso reiniciado exitosamente!',
    errorLoadingStats: 'Error cargando estadísticas:',
    errorLoadingAnswers: 'Error cargando respuestas:',
    
    // Questions component
    manageQuestions: 'Gestionar Preguntas',
    addNewQuestion: 'Agregar Nueva Pregunta',
    questionText: 'Texto de la Pregunta',
    seasonLevel: 'Temporada (1-5)',
    addQuestion: 'Agregar Pregunta',
    addingQuestion: 'Agregando...',
    importMultipleQuestions: 'Importar Múltiples Preguntas',
    addMultipleQuestions: 'Agrega múltiples preguntas a la vez. Una pregunta por línea:',
    questionsOnePerLine: 'Preguntas (una por línea)',
    standardCategory: 'Categoría Estándar',
    importQuestions: 'Importar Preguntas',
    importing: 'Importando...',
    importFromWeb: 'Importar Preguntas de Sitios Web',
    importFrom100Fragen: 'Importar desde 100-fragen.de',
    selectCategory: 'Categoría',
    importFrom100FragenButton: 'Importar desde 100-fragen.de',
    importFromCustomUrl: 'Importar desde URL Personalizada',
    url: 'URL',
    customCategory: 'Categoría',
    customSeason: 'Temporada (1-5)',
    importFromUrlButton: 'Importar desde URL',
    existingQuestions: 'Preguntas Existentes',
    filterByCategory: 'Filtrar por Categoría:',
    allCategories: 'Todas las Categorías',
    search: 'Buscar:',
    searchQuestionText: 'Buscar texto de pregunta',
    noQuestionsYet: 'Aún no hay preguntas.',
    noQuestionsMatchFilter: 'Ninguna pregunta coincide con los criterios de filtro.',
    seasonLevelLabel: 'Temporada:',
    noValidQuestionsFound: 'No se encontraron preguntas válidas.',
    questionAdded: '¡Pregunta agregada exitosamente!',
    questionsImported: '¡Preguntas importadas exitosamente!',
    questionDeleted: '¡Pregunta eliminada exitosamente!',
    errorAddingQuestion: 'Error agregando:',
    errorImporting: 'Error importando:',
    errorDeletingQuestion: 'Error eliminando:',
    errorScraping: 'Error haciendo scraping:',
    pleaseEnterUrl: 'Por favor ingresa una URL',
    confirmDeleteQuestion: '¿Realmente quieres eliminar esta pregunta?',
    
    // Admin component
    adminInterface: 'Interfaz de Administración',
    databaseStatistics: 'Estadísticas de Base de Datos',
    questionsCount: 'Preguntas',
    charactersCount: 'Personajes',
    answeredQuestionsCount: 'Preguntas Respondidas',
    updateStatistics: 'Actualizar Estadísticas',
    databaseManagement: 'Gestión de Base de Datos',
    clearDatabase: 'Limpiar Base de Datos',
    clearDatabaseTooltip: 'Elimina todos los datos de la base de datos',
    loadExampleData: 'Cargar Datos de Ejemplo',
    loadExampleDataTooltip: 'Carga datos de ejemplo en la base de datos',
    characterManagement: 'Gestión de Personajes',
    resetAllCharacters: 'Reiniciar Todos los Personajes',
    resetAllCharactersTooltip: 'Reinicia todos los personajes (elimina preguntas respondidas)',
    confirm: 'Confirmar',
    databaseCleared: 'La base de datos ha sido limpiada exitosamente',
    exampleDataLoaded: 'Los datos de ejemplo han sido cargados exitosamente',
    errorClearingDatabase: 'Error limpiando base de datos',
    errorLoadingExampleData: 'Error cargando datos de ejemplo',
    errorResettingCharacters: 'Error reiniciando personajes',
    confirmClearDatabase: 'Limpiar Base de Datos',
    confirmClearDatabaseMessage: '¿Realmente quieres eliminar todos los datos de la base de datos? ¡Esta acción no se puede deshacer!',
    confirmLoadExampleData: 'Cargar Datos de Ejemplo',
    confirmLoadExampleDataMessage: '¿Quieres cargar datos de ejemplo en la base de datos? Los datos existentes no serán sobrescritos.',
    confirmResetAllCharacters: 'Reiniciar Todos los Personajes',
    confirmResetAllCharactersMessage: '¿Realmente quieres reiniciar todos los personajes? Todas las preguntas respondidas serán eliminadas.',
    
    // Placeholder texts
    placeholderCharacterName: 'ej. Alicia',
    placeholderCharacterDescription: 'ej. Aventurera curiosa',
    placeholderQuestionText: 'ej. ¿Cuál es tu mayor sueño?',
    placeholderCategory: 'ej. Personal',
    placeholderSeason: '1',
    placeholderMultipleQuestions: '¿Cuál es tu mayor sueño?\n¿Qué color te describe mejor?\n¿Qué harías si fueras invisible?',
    placeholderUrl: 'https://ejemplo.com/preguntas',
    placeholderCustomCategory: 'ej. General',
    
    // Demo mode
    demoMode: 'Modo Demo',
    demoDescription: 'Prueba la Herramienta de Preguntas con datos de muestra. Todos los datos se eliminarán automáticamente después de 30 minutos de inactividad.',
    startNewDemo: 'Iniciar Nueva Demo',
    startNewDemoDescription: 'Crear una nueva sesión demo con ID aleatorio',
    startDemo: 'Iniciar Demo',
    joinExistingDemo: 'Unirse a Demo Existente',
    joinExistingDemoDescription: 'Ingresa un ID de demo para continuar una sesión existente',
    enterDemoId: 'Ingresar ID de Demo',
    joinDemo: 'Unirse',
    demoInfo: 'Información de Demo',
    demoInfo1: 'Todos los datos son temporales y se eliminarán después de 30 minutos de inactividad',
    demoInfo2: 'Puedes recargar la sesión demo usando el ID en cualquier momento',
    demoInfo3: 'Solo se usan datos de muestra, sin contenido real o con derechos de autor',
    sessionId: 'ID de Sesión',
    backToDemo: 'Volver a Demo',
    errorStartingDemo: 'Error iniciando demo:',
    pleaseEnterDemoId: 'Por favor ingresa un ID de demo',
    invalidDemoId: 'ID de demo inválido',
    errorValidatingDemo: 'Error validando demo:',
    noQuestionsAvailable: 'No hay preguntas disponibles',
    tryAgain: 'Intentar de Nuevo',
    enterYourAnswer: 'Ingresa tu respuesta',
    markAsAnswered: 'Marcar como Respondida',
    skipQuestion: 'Saltar Pregunta',
    difficulty: 'Dificultad',
    or: 'o',
    
    // Additional demo translations
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    expert: 'Experto',
    unknown: 'Desconocido',
    showing: 'Mostrando',
    of: 'de',
    clearFilters: 'Limpiar Filtros',
    demoDisclaimer: 'Esta es una versión de demostración. Los datos se eliminan automáticamente después de 30 minutos de inactividad.',
    demoModeDescription: 'Experimenta el sistema de preguntas-personajes en un entorno de demostración seguro.'
  },
  fr: {
    // Navigation
    game: 'Jeu',
    characters: 'Personnages',
    questions: 'Questions',
    admin: 'Admin',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    
    // Theme
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre',
    toggleTheme: 'Changer le Thème',
    
    // Language
    selectLanguage: 'Sélectionner la Langue',
    language: 'Langue',
    
    // App specific
    questionTool: 'Outil de Questions',
    discoverCharacters: 'Découvrez des personnages grâce à des questions aléatoires',
    
    // Game component
    questionCharacterGame: 'Jeu Questions-Personnages',
    selectCharacter: 'Choisissez un personnage :',
    selectSeason: 'Choisissez une saison :',
    allSeasons: 'Toutes les Saisons',
    noDescription: 'Aucune description',
    noCharactersAvailable: 'Aucun personnage disponible. Créez d\'abord un personnage !',
    manageCharacters: 'Gérer les Personnages',
    currentQuestion: 'Question Actuelle',
    category: 'Catégorie',
    season: 'Saison',
    yourAnswer: 'Votre Réponse :',
    enterAnswerHere: 'Entrez votre réponse ici...',
    saveAnswer: 'Sauvegarder la Réponse',
    newQuestion: 'Nouvelle Question',
    allQuestionsAnswered: 'Toutes les questions répondues !',
    allQuestionsAnsweredFor: 'Vous avez répondu à toutes les questions disponibles pour',
    resetCharacter: 'Réinitialiser le Personnage',
    answerSaved: 'Réponse sauvegardée !',
    characterReset: 'Le personnage a été réinitialisé !',
    errorLoadingCharacters: 'Erreur lors du chargement des personnages :',
    errorAddingCharacter: 'Erreur lors de l\'ajout du personnage :',
    errorLoadingQuestion: 'Erreur lors du chargement de la question :',
    errorSaving: 'Erreur lors de la sauvegarde :',
    errorResetting: 'Erreur lors de la réinitialisation :',
    confirmResetAll: 'Voulez-vous vraiment réinitialiser tous les personnages ?',
    allCharactersReset: 'Tous les personnages ont été réinitialisés !',
    errorLoadingQuestions: 'Erreur lors du chargement des questions :',
    // Characters component
    manageCharactersTitle: 'Gérer les Personnages',
    addNewCharacter: 'Ajouter un Nouveau Personnage',
    name: 'Nom',
    description: 'Description',
    addCharacter: 'Ajouter le Personnage',
    adding: 'Ajout en cours...',
    existingCharacters: 'Personnages Existants',
    noCharactersYet: 'Aucun personnage pour le moment.',
    created: 'Créé :',
    details: 'Détails',
    editCharacter: 'Modifier',
    editCharacterTitle: 'Modifier le Personnage',
    saving: 'Sauvegarde en cours...',
    cancelEdit: 'Annuler',
    confirmDeleteCharacter: 'Voulez-vous vraiment supprimer ce personnage ?',
    characterAdded: 'Personnage ajouté avec succès !',
    characterUpdated: 'Personnage mis à jour avec succès !',
    characterDeleted: 'Personnage supprimé avec succès !',
    errorAdding: 'Erreur lors de l\'ajout :',
    errorUpdating: 'Erreur lors de la mise à jour :',
    errorDeleting: 'Erreur lors de la suppression :',
    characterDetails: 'Détails',
    close: 'Fermer',
    id: 'ID :',
    statistics: 'Statistiques',
    answeredQuestions: 'Questions Répondues',
    availableQuestions: 'Questions Disponibles',
    progress: 'Progrès',
    startGame: 'Commencer le Jeu',
    resetProgress: 'Réinitialiser le Progrès',
    questionsAndAnswers: 'Questions et Réponses',
    answeredOn: 'Répondu le :',
    noQuestionsAnsweredYet: 'Aucune question répondue pour le moment. Commencez le jeu pour répondre aux questions !',
    startGameToAnswer: 'Commencez le jeu pour répondre aux questions !',
    confirmResetProgress: 'Voulez-vous vraiment réinitialiser le progrès de ce personnage ?',
    progressReset: 'Progrès réinitialisé avec succès !',
    errorLoadingStats: 'Erreur lors du chargement des statistiques :',
    errorLoadingAnswers: 'Erreur lors du chargement des réponses :',
    
    // Questions component
    manageQuestions: 'Gérer les Questions',
    addNewQuestion: 'Ajouter une Nouvelle Question',
    questionText: 'Texte de la Question',
    seasonLevel: 'Saison (1-5)',
    addQuestion: 'Ajouter la Question',
    addingQuestion: 'Ajout en cours...',
    importMultipleQuestions: 'Importer Plusieurs Questions',
    addMultipleQuestions: 'Ajoutez plusieurs questions à la fois. Une question par ligne :',
    questionsOnePerLine: 'Questions (une par ligne)',
    standardCategory: 'Catégorie Standard',
    importQuestions: 'Importer les Questions',
    importing: 'Import en cours...',
    importFromWeb: 'Importer des Questions depuis des Sites Web',
    importFrom100Fragen: 'Importer depuis 100-fragen.de',
    selectCategory: 'Catégorie',
    importFrom100FragenButton: 'Importer depuis 100-fragen.de',
    importFromCustomUrl: 'Importer depuis une URL Personnalisée',
    url: 'URL',
    customCategory: 'Catégorie',
    customSeason: 'Saison (1-5)',
    importFromUrlButton: 'Importer depuis l\'URL',
    existingQuestions: 'Questions Existantes',
    filterByCategory: 'Filtrer par Catégorie :',
    allCategories: 'Toutes les Catégories',
    search: 'Rechercher :',
    searchQuestionText: 'Rechercher le texte de la question',
    noQuestionsYet: 'Aucune question pour le moment.',
    noQuestionsMatchFilter: 'Aucune question ne correspond aux critères de filtre.',
    seasonLevelLabel: 'Saison :',
    noValidQuestionsFound: 'Aucune question valide trouvée.',
    questionAdded: 'Question ajoutée avec succès !',
    questionsImported: 'Questions importées avec succès !',
    questionDeleted: 'Question supprimée avec succès !',
    errorAddingQuestion: 'Erreur lors de l\'ajout :',
    errorImporting: 'Erreur lors de l\'import :',
    errorDeletingQuestion: 'Erreur lors de la suppression :',
    errorScraping: 'Erreur lors du scraping :',
    pleaseEnterUrl: 'Veuillez entrer une URL',
    confirmDeleteQuestion: 'Voulez-vous vraiment supprimer cette question ?',
    
    // Admin component
    adminInterface: 'Interface d\'Administration',
    databaseStatistics: 'Statistiques de Base de Données',
    questionsCount: 'Questions',
    charactersCount: 'Personnages',
    answeredQuestionsCount: 'Questions Répondues',
    updateStatistics: 'Mettre à Jour les Statistiques',
    databaseManagement: 'Gestion de Base de Données',
    clearDatabase: 'Vider la Base de Données',
    clearDatabaseTooltip: 'Supprime toutes les données de la base de données',
    loadExampleData: 'Charger les Données d\'Exemple',
    loadExampleDataTooltip: 'Charge des données d\'exemple dans la base de données',
    characterManagement: 'Gestion des Personnages',
    resetAllCharacters: 'Réinitialiser Tous les Personnages',
    resetAllCharactersTooltip: 'Réinitialise tous les personnages (supprime les questions répondues)',
    confirm: 'Confirmer',
    databaseCleared: 'La base de données a été vidée avec succès',
    exampleDataLoaded: 'Les données d\'exemple ont été chargées avec succès',
    errorClearingDatabase: 'Erreur lors du vidage de la base de données',
    errorLoadingExampleData: 'Erreur lors du chargement des données d\'exemple',
    errorResettingCharacters: 'Erreur lors de la réinitialisation des personnages',
    confirmClearDatabase: 'Vider la Base de Données',
    confirmClearDatabaseMessage: 'Voulez-vous vraiment supprimer toutes les données de la base de données ? Cette action ne peut pas être annulée !',
    confirmLoadExampleData: 'Charger les Données d\'Exemple',
    confirmLoadExampleDataMessage: 'Voulez-vous charger des données d\'exemple dans la base de données ? Les données existantes ne seront pas écrasées.',
    confirmResetAllCharacters: 'Réinitialiser Tous les Personnages',
    confirmResetAllCharactersMessage: 'Voulez-vous vraiment réinitialiser tous les personnages ? Toutes les questions répondues seront supprimées.',
    
    // Placeholder texts
    placeholderCharacterName: 'ex. Alice',
    placeholderCharacterDescription: 'ex. Aventurière curieuse',
    placeholderQuestionText: 'ex. Quel est ton plus grand rêve ?',
    placeholderCategory: 'ex. Personnel',
    placeholderSeason: '1',
    placeholderMultipleQuestions: 'Quel est ton plus grand rêve ?\nQuelle couleur te décrit le mieux ?\nQue ferais-tu si tu étais invisible ?',
    placeholderUrl: 'https://exemple.com/questions',
    placeholderCustomCategory: 'ex. Général',
    
    // Demo mode
    demoMode: 'Mode Démo',
    demoDescription: 'Essayez l\'Outil de Questions avec des données d\'exemple. Toutes les données seront automatiquement supprimées après 30 minutes d\'inactivité.',
    startNewDemo: 'Démarrer Nouvelle Démo',
    startNewDemoDescription: 'Créer une nouvelle session démo avec ID aléatoire',
    startDemo: 'Démarrer Démo',
    joinExistingDemo: 'Rejoindre Démo Existante',
    joinExistingDemoDescription: 'Entrez un ID de démo pour continuer une session existante',
    enterDemoId: 'Entrer ID de Démo',
    joinDemo: 'Rejoindre',
    demoInfo: 'Informations Démo',
    demoInfo1: 'Toutes les données sont temporaires et seront supprimées après 30 minutes d\'inactivité',
    demoInfo2: 'Vous pouvez recharger la session démo en utilisant l\'ID à tout moment',
    demoInfo3: 'Seules des données d\'exemple sont utilisées, aucun contenu réel ou protégé par le droit d\'auteur',
    sessionId: 'ID de Session',
    backToDemo: 'Retour à la Démo',
    errorStartingDemo: 'Erreur lors du démarrage de la démo :',
    pleaseEnterDemoId: 'Veuillez entrer un ID de démo',
    invalidDemoId: 'ID de démo invalide',
    errorValidatingDemo: 'Erreur lors de la validation de la démo :',
    noQuestionsAvailable: 'Aucune question disponible',
    tryAgain: 'Réessayer',
    enterYourAnswer: 'Entrez votre réponse',
    markAsAnswered: 'Marquer comme Répondu',
    skipQuestion: 'Passer la Question',
    difficulty: 'Difficulté',
    or: 'ou',
    
    // Additional demo translations
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    expert: 'Expert',
    unknown: 'Inconnu',
    showing: 'Affichage',
    of: 'de',
    clearFilters: 'Effacer les Filtres',
    demoDisclaimer: 'Ceci est une version de démonstration. Les données sont automatiquement supprimées après 30 minutes d\'inactivité.',
    demoModeDescription: 'Découvrez le système de questions-personnages dans un environnement de démonstration sécurisé.'
  }
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly _sLanguage = signal<Language>('de');
  private readonly _sTranslations = signal<Translation>(translations.de);
  
  // Public readonly signals for components to subscribe to
  public readonly sLanguage = this._sLanguage.asReadonly();
  public readonly sTranslations = this._sTranslations.asReadonly();
  
  constructor() {
    // Initialize language from localStorage or browser preference
    this._initializeLanguage();
  }
  
  private _initializeLanguage(): void {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      this._sLanguage.set(savedLanguage);
      this._sTranslations.set(translations[savedLanguage]);
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        this._sLanguage.set(browserLang);
        this._sTranslations.set(translations[browserLang]);
      } else {
        // Default to German
        this._sLanguage.set('de');
        this._sTranslations.set(translations.de);
      }
    }
  }
  
  public setLanguage(language: Language): void {
    this._sLanguage.set(language);
    this._sTranslations.set(translations[language]);
    localStorage.setItem('language', language);
    
    // Update document language
    document.documentElement.lang = language;
  }
  
  public getTranslation(key: keyof Translation): string {
    return this._sTranslations()[key];
  }
  
  public getAvailableLanguages(): Array<{code: Language, name: string, flag: string}> {
    return [
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];
  }
}
