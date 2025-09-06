import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Character, CharacterAnswers, QuestionAnswer } from '../services/api.service';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="text-center mb-4">👥 Charaktere verwalten</h2>
      
      <!-- Neuen Charakter hinzufügen -->
      <div class="mb-4">
        <h3>Neuen Charakter hinzufügen</h3>
        <form (ngSubmit)="addCharacter()" #characterForm="ngForm">
          <div class="form-group">
            <label class="form-label" for="name">Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              class="form-control" 
              [(ngModel)]="newCharacter.name" 
              required
              placeholder="z.B. Alice">
          </div>
          
          <div class="form-group">
            <label class="form-label" for="description">Beschreibung</label>
            <textarea 
              id="description" 
              name="description" 
              class="form-control textarea" 
              [(ngModel)]="newCharacter.description"
              placeholder="z.B. Neugierige Abenteurerin"></textarea>
          </div>
          
          <button type="submit" class="btn" [disabled]="!characterForm.form.valid || loading">
            {{ loading ? 'Hinzufügen...' : 'Charakter hinzufügen' }}
          </button>
        </form>
      </div>

      <!-- Charaktere-Liste -->
      <div>
        <h3>Vorhandene Charaktere ({{ characters.length }})</h3>
        
        <div *ngIf="characters.length === 0" class="text-center">
          <p>Noch keine Charaktere vorhanden.</p>
        </div>
        
        <div class="grid grid-2" *ngIf="characters.length > 0">
          <div *ngFor="let character of characters" class="character-card">
            <div class="character-header">
              <h3>{{ character.name }}</h3>
              <span class="character-id">#{{ character.id }}</span>
            </div>
            <p class="character-description">{{ character.description || 'Keine Beschreibung' }}</p>
            <div class="character-meta">
              <small class="text-muted">
                Erstellt: {{ formatDate(character.created_at) }}
              </small>
            </div>
            <div class="character-actions mt-4">
              <button (click)="viewCharacterDetails(character)" style="margin-right: 8px; background-color: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;" title="Charakter-Details anzeigen">
                👁️ Details
              </button>
              <button (click)="editCharacter(character)" style="margin-right: 8px; background-color: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                ✏️ Bearbeiten
              </button>
              <button (click)="deleteCharacter(character.id)" style="background-color: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                🗑️ Löschen
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bearbeiten-Modal -->
      <div *ngIf="editingCharacter" class="card mt-4">
        <h3>Charakter bearbeiten</h3>
        <form (ngSubmit)="updateCharacter()" #editForm="ngForm">
          <div class="form-group">
            <label class="form-label" for="editName">Name *</label>
            <input 
              type="text" 
              id="editName" 
              name="editName" 
              class="form-control" 
              [(ngModel)]="editingCharacter.name" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="editDescription">Beschreibung</label>
            <textarea 
              id="editDescription" 
              name="editDescription" 
              class="form-control textarea" 
              [(ngModel)]="editingCharacter.description"></textarea>
          </div>
          
          <div>
            <button type="submit" class="btn" [disabled]="!editForm.form.valid || loading">
              {{ loading ? 'Speichern...' : 'Speichern' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="cancelEdit()" style="margin-left: 12px;">
              Abbrechen
            </button>
          </div>
        </form>
      </div>

      <!-- Lade-Status -->
      <div *ngIf="loading && !editingCharacter" class="loading">
        <p>Lade Charaktere...</p>
      </div>

      <!-- Fehler -->
      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      <!-- Erfolg -->
      <div *ngIf="successMessage" class="success">
        {{ successMessage }}
      </div>

      <!-- Charakter-Details Modal -->
      <div *ngIf="selectedCharacter" class="card mt-4 character-details-modal">
        <div class="character-details-header">
          <h2>{{ selectedCharacter.name }} - Details</h2>
          <button class="btn btn-secondary" (click)="closeCharacterDetails()">
            ✕ Schließen
          </button>
        </div>
        
        <div class="character-details-content">
          <div class="character-info">
            <div class="info-row">
              <label>ID:</label>
              <span>#{{ selectedCharacter.id }}</span>
            </div>
            <div class="info-row">
              <label>Name:</label>
              <span>{{ selectedCharacter.name }}</span>
            </div>
            <div class="info-row">
              <label>Beschreibung:</label>
              <span>{{ selectedCharacter.description || 'Keine Beschreibung' }}</span>
            </div>
            <div class="info-row">
              <label>Erstellt am:</label>
              <span>{{ formatDate(selectedCharacter.created_at) }}</span>
            </div>
          </div>
          
          <div class="character-stats" *ngIf="characterStats">
            <h3>Statistiken</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ characterStats.answered_count || 0 }}</div>
                <div class="stat-label">Beantwortete Fragen</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ characterStats.total_questions || 0 }}</div>
                <div class="stat-label">Verfügbare Fragen</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ getProgressPercentage() }}%</div>
                <div class="stat-label">Fortschritt</div>
              </div>
            </div>
          </div>
          
          <div class="character-actions-details">
            <button class="btn btn-primary" (click)="startGameWithCharacter(selectedCharacter)">
              🎮 Spiel starten
            </button>
            <button class="btn btn-secondary" (click)="editCharacter(selectedCharacter)">
              ✏️ Bearbeiten
            </button>
            <button class="btn btn-warning" (click)="resetCharacterProgress(selectedCharacter.id)">
              🔄 Fortschritt zurücksetzen
            </button>
          </div>
          
          <div class="character-qa-history" *ngIf="characterAnswers.length > 0">
            <h3>Fragen & Antworten ({{ characterAnswers.length }})</h3>
            <div class="qa-list">
              <div *ngFor="let answer of characterAnswers" class="qa-item">
                <div class="qa-question">
                  <strong>Frage #{{ answer.id }}:</strong> {{ answer.question.text }}
                  <span *ngIf="answer.question.category" class="qa-category">{{ answer.question.category }}</span>
                </div>
                <div class="qa-answer">
                  <strong>Antwort:</strong> {{ answer.answer_text }}
                </div>
                <div class="qa-meta">
                  <small class="text-muted">
                    Beantwortet am: {{ formatDate(answer.answered_at) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
          
          <div class="character-qa-history" *ngIf="characterAnswers.length === 0 && characterStats && characterStats.answered_count === 0">
            <h3>Fragen & Antworten</h3>
            <p class="text-muted">Noch keine Fragen beantwortet. Starte das Spiel, um Fragen zu beantworten!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .character-card {
      position: relative;
      transition: all 0.3s ease;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .character-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .character-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .character-id {
      background: #f0f0f0;
      color: #666;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
    }

    .character-description {
      color: #666;
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .character-meta {
      margin-bottom: 16px;
    }

    .character-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .character-actions button {
      flex: 1;
      min-width: 80px;
    }

    .character-details-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 1000;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .character-details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #f8f9fa;
      border-radius: 12px 12px 0 0;
    }

    .character-details-content {
      padding: 20px;
    }

    .character-info {
      margin-bottom: 24px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row label {
      font-weight: bold;
      color: #333;
      min-width: 120px;
    }

    .info-row span {
      color: #666;
      text-align: right;
    }

    .character-stats {
      margin-bottom: 24px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-value {
      font-size: 2em;
      font-weight: bold;
      color: #007bff;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.9em;
      color: #666;
    }

    .character-actions-details {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .character-actions-details button {
      flex: 1;
      min-width: 120px;
    }

    .text-muted {
      color: #6c757d;
    }
    
    .character-qa-history {
      margin-top: 24px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .qa-list {
      margin-top: 16px;
    }
    
    .qa-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .qa-question {
      margin-bottom: 12px;
      line-height: 1.5;
    }
    
    .qa-category {
      background: #007bff;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      margin-left: 8px;
    }
    
    .qa-answer {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
      border-left: 4px solid #28a745;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    
    .qa-meta {
      text-align: right;
    }
  `]
})
export class CharactersComponent implements OnInit {
  characters: Character[] = [];
  newCharacter: Partial<Character> = {};
  editingCharacter: Character | null = null;
  selectedCharacter: Character | null = null;
  characterStats: any = null;
  characterAnswers: QuestionAnswer[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCharacters();
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

  addCharacter() {
    if (!this.newCharacter.name) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.addCharacter(this.newCharacter).subscribe({
      next: (character) => {
        this.characters.unshift(character);
        this.newCharacter = {};
        this.successMessage = 'Charakter erfolgreich hinzugefügt!';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Hinzufügen: ' + err.message;
        this.loading = false;
      }
    });
  }

  editCharacter(character: Character) {
    this.editingCharacter = { ...character };
    this.error = '';
    this.successMessage = '';
  }

  updateCharacter() {
    if (!this.editingCharacter) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.updateCharacter(this.editingCharacter.id, this.editingCharacter).subscribe({
      next: (updatedCharacter) => {
        const index = this.characters.findIndex(c => c.id === updatedCharacter.id);
        if (index !== -1) {
          this.characters[index] = updatedCharacter;
        }
        this.editingCharacter = null;
        this.successMessage = 'Charakter erfolgreich aktualisiert!';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Aktualisieren: ' + err.message;
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.editingCharacter = null;
    this.error = '';
    this.successMessage = '';
  }

  deleteCharacter(characterId: number) {
    if (!confirm('Möchtest du diesen Charakter wirklich löschen?')) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.deleteCharacter(characterId).subscribe({
      next: () => {
        this.characters = this.characters.filter(c => c.id !== characterId);
        this.successMessage = 'Charakter erfolgreich gelöscht!';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Löschen: ' + err.message;
        this.loading = false;
      }
    });
  }

  viewCharacterDetails(character: Character) {
    console.log('Opening character details for:', character);
    this.selectedCharacter = character;
    this.loadCharacterStats(character.id);
    this.loadCharacterAnswers(character.id);
    this.error = '';
    this.successMessage = '';
  }

  closeCharacterDetails() {
    this.selectedCharacter = null;
    this.characterStats = null;
    this.characterAnswers = [];
    this.error = '';
    this.successMessage = '';
  }

  loadCharacterStats(characterId: number) {
    this.apiService.getCharacterStatus().subscribe({
      next: (statusList) => {
        const characterStatus = statusList.find(s => s.id === characterId);
        this.characterStats = characterStatus || { answered_count: 0, total_questions: 0 };
      },
      error: (err) => {
        console.error('Fehler beim Laden der Statistiken:', err);
        this.characterStats = { answered_count: 0, total_questions: 0 };
      }
    });
  }

  loadCharacterAnswers(characterId: number) {
    this.apiService.getCharacterAnswers(characterId).subscribe({
      next: (data) => {
        this.characterAnswers = data.answers;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Antworten:', err);
        this.characterAnswers = [];
      }
    });
  }

  getProgressPercentage(): number {
    if (!this.characterStats || this.characterStats.total_questions === 0) {
      return 0;
    }
    return Math.round((this.characterStats.answered_count / this.characterStats.total_questions) * 100);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  startGameWithCharacter(character: Character) {
    // Navigate to game component with character
    // This would typically use Angular Router
    console.log('Starting game with character:', character);
    // For now, just show a message
    this.successMessage = `Spiel mit ${character.name} gestartet!`;
  }

  resetCharacterProgress(characterId: number) {
    if (!confirm('Möchtest du den Fortschritt dieses Charakters wirklich zurücksetzen?')) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.resetCharacter(characterId).subscribe({
      next: () => {
        this.successMessage = 'Fortschritt erfolgreich zurückgesetzt!';
        this.loadCharacterStats(characterId);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Zurücksetzen: ' + err.message;
        this.loading = false;
      }
    });
  }
}
