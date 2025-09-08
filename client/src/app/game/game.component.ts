import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Character, GameQuestion, CharacterStatus } from '../services/api.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="text-center mb-4">🎮 {{ i18nService.getTranslation('questionCharacterGame') }}</h2>
      
      <!-- Charakter-Auswahl -->
      <div class="mb-4">
        <h3>{{ i18nService.getTranslation('selectCharacter') }}</h3>
        <div class="grid grid-2 mt-4" *ngIf="characters.length > 0">
          <div 
            *ngFor="let character of characters" 
            class="character-card"
            [class.selected]="selectedCharacter?.id === character.id"
            (click)="selectCharacter(character)">
            <h3>{{ character.name }}</h3>
            <p>{{ character.description || i18nService.getTranslation('noDescription') }}</p>
            <div class="status-badge" [class.completed]="getCharacterStatus(character.id)?.answered_count === getCharacterStatus(character.id)?.total_questions">
              {{ getCharacterStatus(character.id)?.answered_count || 0 }} / {{ getCharacterStatus(character.id)?.total_questions || 0 }} {{ i18nService.getTranslation('questions') }}
            </div>
          </div>
        </div>
        
        <div *ngIf="characters.length === 0" class="text-center">
          <p>{{ i18nService.getTranslation('noCharactersAvailable') }}</p>
          <a routerLink="/characters" class="btn">{{ i18nService.getTranslation('manageCharacters') }}</a>
        </div>
      </div>

      <!-- Season Selection -->
      <div class="mb-4" *ngIf="characters.length > 0">
        <h3>{{ i18nService.getTranslation('selectSeason') }}</h3>
        <div class="form-group">
          <select 
            class="form-control" 
            [(ngModel)]="selectedSeason" 
            (ngModelChange)="onSeasonChange()">
            <option value="">{{ i18nService.getTranslation('allSeasons') }}</option>
            <option *ngFor="let season of availableSeasons" [value]="season">
              {{ i18nService.getTranslation('season') }} {{ season }}
            </option>
          </select>
        </div>
      </div>

      <!-- Aktuelle Frage -->
      <div *ngIf="currentQuestion && selectedCharacter" class="question-card">
        <h2>{{ currentQuestion.question.text }}</h2>
        <div class="question-meta">
          <span *ngIf="currentQuestion.question.category">{{ i18nService.getTranslation('category') }}: {{ currentQuestion.question.category }}</span>
          <span *ngIf="currentQuestion.question.difficulty"> • {{ i18nService.getTranslation('season') }}: {{ currentQuestion.question.difficulty }}</span>
        </div>
        
        <div class="answer-section mt-4">
          <label for="answerText" class="form-label">{{ i18nService.getTranslation('yourAnswer') }}</label>
          <textarea 
            id="answerText"
            class="form-control textarea answer-textarea" 
            [(ngModel)]="currentAnswer"
            [placeholder]="i18nService.getTranslation('enterAnswerHere')"
            rows="4"
            maxlength="1000">
          </textarea>
          <div class="answer-counter">
            {{ currentAnswer.length || 0 }} / 1000 {{ i18nService.getTranslation('characters') }}
          </div>
        </div>
        
        <div class="mt-4">
          <button 
            class="btn" 
            (click)="markAsAnswered()"
            [disabled]="!currentAnswer || currentAnswer.trim() === ''">
            ✅ {{ i18nService.getTranslation('saveAnswer') }}
          </button>
          <button class="btn btn-secondary" (click)="getNewQuestion()" style="margin-left: 12px;">
            🔄 {{ i18nService.getTranslation('newQuestion') }}
          </button>
        </div>
      </div>

      <!-- Keine Fragen verfügbar -->
      <div *ngIf="noQuestionsAvailable && selectedCharacter" class="text-center">
        <h3>🎉 {{ i18nService.getTranslation('allQuestionsAnswered') }}</h3>
        <p>{{ i18nService.getTranslation('allQuestionsAnsweredFor') }} {{ selectedCharacter.name }} {{ i18nService.getTranslation('questions') }}.</p>
        <button class="btn btn-secondary" (click)="resetCharacter()">
          🔄 {{ i18nService.getTranslation('resetCharacter') }}
        </button>
      </div>

      <!-- Lade-Status -->
      <div *ngIf="loading" class="loading">
        <p>{{ i18nService.getTranslation('loading') }}</p>
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
  public readonly i18nService = inject(I18nService);
  
  characters: Character[] = [];
  characterStatus: CharacterStatus[] = [];
  selectedCharacter: Character | null = null;
  selectedSeason: string = '';
  availableSeasons: number[] = [];
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
    this.loadAvailableSeasons();
  }

  loadCharacters() {
    this.loading = true;
    this.apiService.getCharacters().subscribe({
      next: (characters) => {
        this.characters = characters;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorLoadingCharacters') + ' ' + err.message;
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
        console.error(this.i18nService.getTranslation('errorLoadingStats'), err);
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

    // Convert selectedSeason to number if it's not empty
    const season = this.selectedSeason && this.selectedSeason !== '' ? parseInt(this.selectedSeason) : undefined;

    this.apiService.getRandomQuestion(this.selectedCharacter.id, season).subscribe({
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
          this.error = this.i18nService.getTranslation('errorLoadingQuestion') + ' ' + err.message;
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
        this.successMessage = this.i18nService.getTranslation('answerSaved');
        this.currentQuestion = null;
        this.currentAnswer = '';
        this.loadCharacterStatus();
        setTimeout(() => {
          this.getNewQuestion();
        }, 1000);
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorSaving') + ' ' + err.message;
      }
    });
  }

  resetCharacter() {
    if (!this.selectedCharacter) return;

    this.apiService.resetCharacter(this.selectedCharacter.id).subscribe({
      next: () => {
        this.successMessage = this.i18nService.getTranslation('characterReset');
        this.currentQuestion = null;
        this.loadCharacterStatus();
        setTimeout(() => {
          this.getNewQuestion();
        }, 1000);
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
      }
    });
  }

  resetCharacterById(characterId: number) {
    this.apiService.resetCharacter(characterId).subscribe({
      next: () => {
        this.successMessage = this.i18nService.getTranslation('characterReset');
        this.loadCharacterStatus();
        if (this.selectedCharacter?.id === characterId) {
          this.currentQuestion = null;
          this.getNewQuestion();
        }
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
      }
    });
  }

  resetAllCharacters() {
    if (confirm(this.i18nService.getTranslation('confirmResetAll'))) {
      this.apiService.resetAllCharacters().subscribe({
        next: () => {
          this.successMessage = this.i18nService.getTranslation('allCharactersReset');
          this.currentQuestion = null;
          this.loadCharacterStatus();
        },
        error: (err) => {
          this.error = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
        }
      });
    }
  }

  getCharacterStatus(characterId: number): CharacterStatus | undefined {
    return this.characterStatus.find(s => s.id === characterId);
  }

  loadAvailableSeasons() {
    // For now, we'll use seasons 1-5 as available seasons
    // In a real implementation, this could be loaded from the API
    this.availableSeasons = [1, 2, 3, 4];
  }

  onSeasonChange() {
    // Reset current question when season changes
    this.currentQuestion = null;
    this.currentAnswer = '';
    this.error = '';
    this.successMessage = '';
    this.noQuestionsAvailable = false;
    
    // If a character is selected, get a new question for the selected season
    if (this.selectedCharacter) {
      this.getNewQuestion();
    }
  }
}
