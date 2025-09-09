# Question Tool

Ein interaktives Frage-Charakter-System mit Angular Frontend und Node.js Backend.

## Features

- 🎮 **Zufällige Fragen**: Jeder Charakter bekommt zufällige Fragen zugewiesen
- 👥 **Charakter-Management**: Erstelle und verwalte verschiedene Charaktere
- ❓ **Fragen-Verwaltung**: Füge Fragen hinzu, importiere sie oder verwalte sie
- 🔄 **Einmalige Fragen**: Jede Frage wird nur einmal pro Charakter gestellt
- 📊 **Fortschritts-Tracking**: Sieh den Fortschritt aller Charaktere
- 🗃️ **SQLite Datenbank**: Leichte, portable Datenhaltung
- 🎨 **Modernes UI**: Schönes, responsives Design

## Technologie-Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Backend**: Node.js mit Express
- **Datenbank**: SQLite3
- **Styling**: SCSS mit modernem Design
- **API**: RESTful API

## Installation

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn

### Setup

1. **Dependencies installieren:**
   ```bash
   npm run install-all
   ```

2. **Backend starten:**
   ```bash
   npm run dev
   ```
   Das Backend läuft auf http://localhost:3000

3. **Frontend starten (in einem neuen Terminal):**
   ```bash
   npm run client
   ```
   Das Frontend läuft auf http://localhost:4200

4. **Produktions-Build erstellen:**
   ```bash
   npm run build
   ```

## Docker Setup

Das Projekt unterstützt sowohl den regulären Modus als auch einen Demo-only Modus über Docker.

### Docker Compose (Empfohlen)

1. **Beide Versionen starten:**
   ```bash
   docker-compose up
   ```
   - Reguläre Version: http://localhost:3000
   - Demo Version: http://localhost:3001

2. **Nur reguläre Version:**
   ```bash
   docker-compose up question-tool
   ```

3. **Nur Demo Version:**
   ```bash
   docker-compose up question-tool-demo
   ```

4. **Mit dem Hilfsskript:**
   ```bash
   ./docker-run.sh [regular|demo|both]
   ```

### Einzelne Docker Container

1. **Reguläre Version:**
   ```bash
   docker build -t question-tool .
   docker run -p 3000:3000 -e DEMO_MODE=false question-tool
   ```

2. **Demo Version:**
   ```bash
   docker build -t question-tool-demo .
   docker run -p 3001:3000 -e DEMO_MODE=true question-tool-demo
   ```

### Demo-only Modus

Der Demo-only Modus zeigt nur die Demo-Funktionalität ohne die vollständigen Admin-Features. Er ist ideal für:
- Präsentationen
- Testzwecke
- Öffentliche Demos

## Verwendung

### Charaktere erstellen
1. Gehe zur "Charaktere" Seite
2. Gib einen Namen und optional eine Beschreibung ein
3. Klicke "Charakter hinzufügen"

### Fragen hinzufügen
1. Gehe zur "Fragen" Seite
2. Füge einzelne Fragen hinzu oder importiere mehrere auf einmal
3. Kategorisiere Fragen nach Belieben

### Spielen
1. Gehe zur "Spiel" Seite
2. Wähle einen Charakter aus
3. Beantworte die zufällig ausgewählte Frage
4. Markiere sie als beantwortet für eine neue Frage

## API Endpoints

### Charaktere
- `GET /api/characters` - Alle Charaktere
- `POST /api/characters` - Neuen Charakter erstellen
- `PUT /api/characters/:id` - Charakter aktualisieren
- `DELETE /api/characters/:id` - Charakter löschen

### Fragen
- `GET /api/questions` - Alle Fragen
- `POST /api/questions` - Neue Frage erstellen
- `POST /api/questions/bulk` - Mehrere Fragen importieren
- `DELETE /api/questions/:id` - Frage löschen

### Spiel
- `GET /api/game/question/:characterId` - Zufällige Frage für Charakter
- `POST /api/game/answer` - Frage als beantwortet markieren
- `GET /api/game/status` - Status aller Charaktere
- `DELETE /api/game/reset/:characterId` - Charakter zurücksetzen
- `DELETE /api/game/reset-all` - Alle Charaktere zurücksetzen

## Datenbank-Schema

### questions
- `id` (INTEGER PRIMARY KEY)
- `text` (TEXT NOT NULL)
- `category` (TEXT)
- `difficulty` (INTEGER DEFAULT 1)
- `created_at` (DATETIME)

### characters
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `description` (TEXT)
- `created_at` (DATETIME)

### answered_questions
- `id` (INTEGER PRIMARY KEY)
- `character_id` (INTEGER)
- `question_id` (INTEGER)
- `answered_at` (DATETIME)
- UNIQUE(character_id, question_id)

## Erweiterungen

Das System ist modular aufgebaut und kann einfach erweitert werden:

- **Web Scraping**: Integration von Web Scraping für automatischen Fragen-Import
- **Kategorien**: Erweiterte Kategorien-Verwaltung
- **Schwierigkeitsgrade**: Anpassung der Zufallsauswahl nach Schwierigkeit
- **Statistiken**: Detaillierte Auswertungen und Statistiken
- **Multiplayer**: Mehrere Spieler gleichzeitig

## Entwicklung

### Backend Development
```bash
npm run dev
```

### Frontend Development
```bash
cd client
npm start
```

### Build für Produktion
```bash
npm run build
```

## Lizenz

MIT License
