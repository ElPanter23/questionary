import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Character, GameQuestion, CharacterStatus } from '../services/api.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="text-center mb-4">🎮 Frage-Charakter-Spiel</h2>
      
      <!-- Charakter-Auswahl -->
      <div class="mb-4">
        <h3>Wähle einen Charakter:</h3>
        <div class="grid grid-2 mt-4" *ngIf="characters.length > 0">
          <div 
            *ngFor="let character of characters" 
            class="character-card"
            [class.selected]="selectedCharacter?.id === character.id"
            (click)="selectCharacter(character)">
            <h3>{{ character.name }}</h3>
            <p>{{ character.description || 'Keine Beschreibung' }}</p>
            <div class="status-badge" [class.completed]="getCharacterStatus(character.id)?.answered_count === getCharacterStatus(character.id)?.total_questions">
              {{ getCharacterStatus(character.id)?.answered_count || 0 }} / {{ getCharacterStatus(character.id)?.total_questions || 0 }} Fragen
            </div>
          </div>
        </div>
        
        <div *ngIf="characters.length === 0" class="text-center">
          <p>Keine Charaktere vorhanden. Erstelle zuerst einen Charakter!</p>
          <a routerLink="/characters" class="btn">Charaktere verwalten</a>
        </div>
      </div>

      <!-- Aktuelle Frage -->
      <div *ngIf="currentQuestion && selectedCharacter" class="question-card">
        <h2>{{ currentQuestion.question.text }}</h2>
        <div class="question-meta">
          <span *ngIf="currentQuestion.question.category">Kategorie: {{ currentQuestion.question.category }}</span>
          <span *ngIf="currentQuestion.question.difficulty"> • Schwierigkeit: {{ currentQuestion.question.difficulty }}</span>
        </div>
        
        <div class="answer-section mt-4">
          <label for="answerText" class="form-label">Deine Antwort:</label>
          <textarea 
            id="answerText"
            class="form-control textarea answer-textarea" 
            [(ngModel)]="currentAnswer"
            placeholder="Gib hier deine Antwort ein..."
            rows="4"
            maxlength="1000">
          </textarea>
          <div class="answer-counter">
            {{ currentAnswer?.length || 0 }} / 1000 Zeichen
          </div>
        </div>
        
        <div class="mt-4">
          <button 
            class="btn" 
            (click)="markAsAnswered()"
            [disabled]="!currentAnswer || currentAnswer.trim() === ''">
            ✅ Antwort speichern
          </button>
          <button class="btn btn-secondary" (click)="getNewQuestion()" style="margin-left: 12px;">
            🔄 Neue Frage
          </button>
        </div>
      </div>

      <!-- Keine Fragen verfügbar -->
      <div *ngIf="noQuestionsAvailable && selectedCharacter" class="text-center">
        <h3>🎉 Alle Fragen beantwortet!</h3>
        <p>Du hast alle verfügbaren Fragen für {{ selectedCharacter.name }} beantwortet.</p>
        <button class="btn btn-secondary" (click)="resetCharacter()">
          🔄 Charakter zurücksetzen
        </button>
      </div>

      <!-- Lade-Status -->
      <div *ngIf="loading" class="loading">
        <p>Lade...</p>
      </div>

      <!-- Fehler -->
      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      <!-- Erfolg -->
      <div *ngIf="successMessage" class="success">
        {{ successMessage }}
      </div>
    </div>
  `,
  styles: [`
    .selected {
      transform: scale(1.05);
      box-shadow: 0 12px 24px rgba(240, 147, 251, 0.4) !important;
    }
    
    .character-card {
      position: relative;
    }
    
    .character-card:hover {
      transform: translateY(-4px);
    }
    
    .selected:hover {
      transform: scale(1.05) translateY(-4px);
    }
    
    .answer-section {
      margin: 20px 0;
    }
    
    .answer-textarea {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
      line-height: 1.5;
    }
    
    .answer-counter {
      text-align: right;
      font-size: 0.9em;
      color: #666;
      margin-top: 4px;
    }
    
    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      color: #333;
    }
  `]
})
export class GameComponent implements OnInit {
  characters: Character[] = [];
  characterStatus: CharacterStatus[] = [];
  selectedCharacter: Character | null = null;
  currentQuestion: GameQuestion | null = null;
  currentAnswer: string = '';
  loading = false;
  error = '';
  successMessage = '';
  noQuestionsAvailable = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCharacters();
    this.loadCharacterStatus();
  }

  loadCharacters() {
    this.loading = true;
    this.apiService.getCharacters().subscribe({
      next: (characters) => {
        this.characters = characters;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Charaktere: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadCharacterStatus() {
    this.apiService.getCharacterStatus().subscribe({
      next: (status) => {
        this.characterStatus = status;
      },
      error: (err) => {
        console.error('Fehler beim Laden des Status:', err);
      }
    });
  }

  selectCharacter(character: Character) {
    this.selectedCharacter = character;
    this.currentQuestion = null;
    this.currentAnswer = '';
    this.error = '';
    this.successMessage = '';
    this.noQuestionsAvailable = false;
    this.getNewQuestion();
  }

  getNewQuestion() {
    if (!this.selectedCharacter) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.currentAnswer = '';

    this.apiService.getRandomQuestion(this.selectedCharacter.id).subscribe({
      next: (question) => {
        this.currentQuestion = question;
        this.noQuestionsAvailable = false;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.noQuestionsAvailable = true;
          this.currentQuestion = null;
        } else {
          this.error = 'Fehler beim Laden der Frage: ' + err.message;
        }
        this.loading = false;
      }
    });
  }

  markAsAnswered() {
    if (!this.currentQuestion || !this.selectedCharacter || !this.currentAnswer || this.currentAnswer.trim() === '') return;

    this.apiService.markQuestionAnswered(
      this.selectedCharacter.id,
      this.currentQuestion.question.id,
      this.currentAnswer.trim()
    ).subscribe({
      next: () => {
        this.successMessage = 'Antwort gespeichert!';
        this.currentQuestion = null;
        this.currentAnswer = '';
        this.loadCharacterStatus();
        setTimeout(() => {
          this.getNewQuestion();
        }, 1000);
      },
      error: (err) => {
        this.error = 'Fehler beim Speichern: ' + err.message;
      }
    });
  }

  resetCharacter() {
    if (!this.selectedCharacter) return;

    this.apiService.resetCharacter(this.selectedCharacter.id).subscribe({
      next: () => {
        this.successMessage = 'Charakter wurde zurückgesetzt!';
        this.currentQuestion = null;
        this.loadCharacterStatus();
        setTimeout(() => {
          this.getNewQuestion();
        }, 1000);
      },
      error: (err) => {
        this.error = 'Fehler beim Zurücksetzen: ' + err.message;
      }
    });
  }

  resetCharacterById(characterId: number) {
    this.apiService.resetCharacter(characterId).subscribe({
      next: () => {
        this.successMessage = 'Charakter wurde zurückgesetzt!';
        this.loadCharacterStatus();
        if (this.selectedCharacter?.id === characterId) {
          this.currentQuestion = null;
          this.getNewQuestion();
        }
      },
      error: (err) => {
        this.error = 'Fehler beim Zurücksetzen: ' + err.message;
      }
    });
  }

  resetAllCharacters() {
    if (confirm('Möchtest du wirklich alle Charaktere zurücksetzen?')) {
      this.apiService.resetAllCharacters().subscribe({
        next: () => {
          this.successMessage = 'Alle Charaktere wurden zurückgesetzt!';
          this.currentQuestion = null;
          this.loadCharacterStatus();
        },
        error: (err) => {
          this.error = 'Fehler beim Zurücksetzen: ' + err.message;
        }
      });
    }
  }

  getCharacterStatus(characterId: number): CharacterStatus | undefined {
    return this.characterStatus.find(s => s.id === characterId);
  }
}
