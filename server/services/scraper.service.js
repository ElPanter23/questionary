const axios = require('axios');
const cheerio = require('cheerio');

class ScraperService {
  constructor() {
    this.baseUrl = 'https://www.100-fragen.de';
  }

  /**
   * Scraped Fragen von einer Webseite
   * @param {string} url - URL der Webseite
   * @param {Object} options - Scraping-Optionen
   * @returns {Promise<Array>} Array von Fragen
   */
  async scrapeQuestions(url, options = {}) {
    try {
      console.log(`Scraping Fragen von: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const questions = [];

      // Verschiedene Selektoren für verschiedene Webseiten
      const selectors = [
        'li', // Für Listen
        '.question', // Für spezifische Frage-Klassen
        'p', // Für Paragraphen
        '.frage', // Deutsche Variante
        'h3', // Für Überschriften
        'h4',
        'h5'
      ];

      selectors.forEach(selector => {
        $(selector).each((index, element) => {
          const text = $(element).text().trim();
          
          // Filtere gültige Fragen
          if (this.isValidQuestion(text)) {
            questions.push({
              text: this.cleanQuestion(text),
              category: options.category || 'Gescrapt',
              difficulty: options.difficulty || 1,
              source: url
            });
          }
        });
      });

      // Entferne Duplikate
      const uniqueQuestions = this.removeDuplicates(questions);
      
      console.log(`${uniqueQuestions.length} Fragen erfolgreich gescrapt`);
      return uniqueQuestions;

    } catch (error) {
      console.error('Fehler beim Scraping:', error.message);
      throw new Error(`Scraping fehlgeschlagen: ${error.message}`);
    }
  }

  /**
   * Scraped spezifisch von 100-fragen.de
   * @param {string} category - Kategorie der Fragen
   * @returns {Promise<Array>} Array von Fragen
   */
  async scrapeFrom100Fragen(category = 'all') {
    const urls = {
      all: 'https://www.100-fragen.de/alle-fragen/',
      personal: 'https://www.100-fragen.de/persoenliche-fragen/',
      deep: 'https://www.100-fragen.de/tiefgreifende-fragen/',
      fun: 'https://www.100-fragen.de/spass-fragen/',
      relationship: 'https://www.100-fragen.de/beziehungs-fragen/',
      work: 'https://www.100-fragen.de/berufs-fragen/'
    };

    const url = urls[category] || urls.all;
    return await this.scrapeQuestions(url, { 
      category: this.getCategoryName(category),
      difficulty: this.getDifficultyForCategory(category)
    });
  }

  /**
   * Scraped von einer benutzerdefinierten URL
   * @param {string} url - URL zum Scrapen
   * @param {Object} options - Scraping-Optionen
   * @returns {Promise<Array>} Array von Fragen
   */
  async scrapeFromCustomUrl(url, options = {}) {
    return await this.scrapeQuestions(url, options);
  }

  /**
   * Validiert ob ein Text eine gültige Frage ist
   * @param {string} text - Zu validierender Text
   * @returns {boolean} True wenn gültig
   */
  isValidQuestion(text) {
    if (!text || text.length < 10) return false;
    if (text.length > 500) return false;
    
    // Muss ein Fragezeichen enthalten oder typische Fragewörter
    const questionWords = ['was', 'wie', 'wo', 'wann', 'warum', 'wer', 'welche', 'welcher', 'welches'];
    const hasQuestionMark = text.includes('?');
    const hasQuestionWord = questionWords.some(word => 
      text.toLowerCase().startsWith(word) || 
      text.toLowerCase().includes(' ' + word + ' ')
    );
    
    // Filtere unerwünschte Inhalte
    const unwantedPatterns = [
      /^\d+\.?\s*$/, // Nur Zahlen
      /^[A-Z\s]+$/, // Nur Großbuchstaben
      /^(Home|Start|Kontakt|Impressum|Datenschutz)/i, // Navigation
      /^(Copyright|©|Alle Rechte)/i, // Copyright
      /^(Cookies|Cookie)/i, // Cookie-Hinweise
      /^(JavaScript|JS)/i, // Technische Hinweise
      /^(Login|Anmelden|Registrieren)/i, // Login-Buttons
      /^(Menü|Navigation|Menu)/i, // Navigation
      /^(Suche|Search)/i, // Suchfunktion
      /^(Newsletter|Abonnieren)/i, // Newsletter
      /^(Teilen|Share)/i, // Social Media
      /^(Mehr|More|Weiter|Next)/i, // Weiter-Buttons
      /^(Zurück|Back|Previous)/i, // Zurück-Buttons
      /^(Kategorien|Categories)/i, // Kategorien
      /^(Tags|Schlagwörter)/i, // Tags
      /^(Kommentare|Comments)/i, // Kommentare
      /^(Bewertung|Rating|Sterne)/i, // Bewertungen
      /^(Datum|Date|Zeit|Time)/i, // Datum/Zeit
      /^(Autor|Author|Verfasser)/i, // Autor
      /^(Quelle|Source|Link)/i, // Quellen
      /^(Bild|Image|Foto|Photo)/i, // Bilder
      /^(Video|Film|Clip)/i, // Videos
      /^(Audio|Sound|Musik)/i, // Audio
      /^(Download|Herunterladen)/i, // Downloads
      /^(PDF|Word|Excel|PowerPoint)/i, // Dokumente
      /^(ZIP|RAR|7z)/i, // Archive
      /^(MP3|MP4|AVI|MOV)/i, // Medien
      /^(JPG|PNG|GIF|SVG)/i, // Bilder
      /^(HTML|CSS|JS|PHP)/i, // Code
      /^(www\.|http|https)/i, // URLs
      /^(@|#|$|%|&|\*)/i, // Sonderzeichen
      /^[^\w\s?]/, // Beginnt mit Sonderzeichen
      /[<>{}[\]\\|`~!@#$%^&*()_+=]/ // Enthält HTML/Code-Zeichen
    ];

    if (unwantedPatterns.some(pattern => pattern.test(text))) {
      return false;
    }

    return hasQuestionMark || hasQuestionWord;
  }

  /**
   * Bereinigt eine Frage von unerwünschten Zeichen
   * @param {string} text - Zu bereinigender Text
   * @returns {string} Bereinigter Text
   */
  cleanQuestion(text) {
    return text
      .replace(/^\d+\.?\s*/, '') // Entferne Nummerierung
      .replace(/^[-•*]\s*/, '') // Entferne Listenzeichen
      .replace(/^\s+|\s+$/g, '') // Entferne Leerzeichen am Anfang/Ende
      .replace(/\s+/g, ' ') // Entferne mehrfache Leerzeichen
      .replace(/[^\w\s?.,!;:()äöüßÄÖÜ]/g, '') // Entferne unerwünschte Zeichen
      .trim();
  }

  /**
   * Entfernt Duplikate aus einem Array von Fragen
   * @param {Array} questions - Array von Fragen
   * @returns {Array} Array ohne Duplikate
   */
  removeDuplicates(questions) {
    const seen = new Set();
    return questions.filter(question => {
      const normalized = question.text.toLowerCase().trim();
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
  }

  /**
   * Gibt den Kategorienamen für eine Kategorie zurück
   * @param {string} category - Kategorie-Key
   * @returns {string} Kategoriename
   */
  getCategoryName(category) {
    const categoryNames = {
      all: 'Alle Fragen',
      personal: 'Persönlich',
      deep: 'Tiefgreifend',
      fun: 'Spaß',
      relationship: 'Beziehung',
      work: 'Beruf'
    };
    return categoryNames[category] || 'Gescrapt';
  }

  /**
   * Gibt die Schwierigkeit für eine Kategorie zurück
   * @param {string} category - Kategorie-Key
   * @returns {number} Schwierigkeitsgrad (1-5)
   */
  getDifficultyForCategory(category) {
    const difficulties = {
      all: 2,
      personal: 3,
      deep: 4,
      fun: 1,
      relationship: 3,
      work: 2
    };
    return difficulties[category] || 2;
  }

  /**
   * Testet eine URL auf Erreichbarkeit
   * @param {string} url - Zu testende URL
   * @returns {Promise<boolean>} True wenn erreichbar
   */
  async testUrl(url) {
    try {
      const response = await axios.head(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

module.exports = ScraperService;
