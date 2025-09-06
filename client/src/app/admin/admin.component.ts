import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="text-center mb-4">🔧 Admin Interface</h2>
      
      <!-- Database Statistics -->
      <div class="mb-4">
        <h3>📊 Datenbank Statistiken</h3>
        <div class="grid grid-3 gap-3" *ngIf="databaseStats">
          <div class="stat-card">
            <div class="stat-number">{{ databaseStats.questionsCount }}</div>
            <div class="stat-label">Fragen</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ databaseStats.charactersCount }}</div>
            <div class="stat-label">Charaktere</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ databaseStats.answeredQuestionsCount }}</div>
            <div class="stat-label">Beantwortete Fragen</div>
          </div>
        </div>
        <button class="btn btn-primary" (click)="loadStats()" [disabled]="loading">
          {{ loading ? 'Lädt...' : 'Statistiken aktualisieren' }}
        </button>
      </div>

      <!-- Database Management -->
      <div class="mb-4">
        <h3>🗄️ Datenbank Management</h3>
        <div class="admin-actions">
          <button 
            class="btn btn-danger" 
            (click)="clearDatabase()" 
            [disabled]="loading"
            title="Löscht alle Daten aus der Datenbank">
            🗑️ Datenbank leeren
          </button>
          <button 
            class="btn btn-success" 
            (click)="preloadExampleData()" 
            [disabled]="loading"
            title="Lädt Beispiel-Daten in die Datenbank">
            📥 Beispiel-Daten laden
          </button>
        </div>
      </div>

      <!-- Character Management -->
      <div class="mb-4">
        <h3>👥 Charakter Management</h3>
        <div class="admin-actions">
          <button 
            class="btn btn-warning" 
            (click)="resetAllCharacters()" 
            [disabled]="loading"
            title="Setzt alle Charaktere zurück (löscht beantwortete Fragen)">
            🔄 Alle Charaktere zurücksetzen
          </button>
        </div>
      </div>

      <!-- Status Messages -->
      <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-danger'">
        {{ message }}
      </div>

      <!-- Confirmation Dialog -->
      <div *ngIf="showConfirmDialog" class="modal-overlay">
        <div class="modal">
          <h3>{{ confirmTitle }}</h3>
          <p>{{ confirmMessage }}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="cancelAction()">Abbrechen</button>
            <button class="btn btn-danger" (click)="confirmAction()">Bestätigen</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .admin-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .admin-actions .btn {
      min-width: 200px;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal h3 {
      margin-top: 0;
      color: #333;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class AdminComponent implements OnInit {
  databaseStats: any = null;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  showConfirmDialog = false;
  confirmTitle = '';
  confirmMessage = '';
  pendingAction: (() => void) | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.apiService.getDatabaseStats().subscribe({
      next: (stats) => {
        this.databaseStats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.showMessage('Fehler beim Laden der Statistiken', 'error');
        this.loading = false;
      }
    });
  }

  clearDatabase() {
    this.confirmTitle = 'Datenbank leeren';
    this.confirmMessage = 'Möchten Sie wirklich alle Daten aus der Datenbank löschen? Diese Aktion kann nicht rückgängig gemacht werden!';
    this.pendingAction = () => this.executeClearDatabase();
    this.showConfirmDialog = true;
  }

  executeClearDatabase() {
    this.loading = true;
    this.apiService.clearDatabase().subscribe({
      next: () => {
        this.showMessage('Datenbank wurde erfolgreich geleert', 'success');
        this.loadStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error clearing database:', error);
        this.showMessage('Fehler beim Leeren der Datenbank', 'error');
        this.loading = false;
      }
    });
  }

  preloadExampleData() {
    this.confirmTitle = 'Beispiel-Daten laden';
    this.confirmMessage = 'Möchten Sie Beispiel-Daten in die Datenbank laden? Bestehende Daten werden nicht überschrieben.';
    this.pendingAction = () => this.executePreloadData();
    this.showConfirmDialog = true;
  }

  executePreloadData() {
    this.loading = true;
    this.apiService.preloadExampleData().subscribe({
      next: (result) => {
        this.showMessage('Beispiel-Daten wurden erfolgreich geladen', 'success');
        this.loadStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error preloading data:', error);
        this.showMessage('Fehler beim Laden der Beispiel-Daten', 'error');
        this.loading = false;
      }
    });
  }

  resetAllCharacters() {
    this.confirmTitle = 'Alle Charaktere zurücksetzen';
    this.confirmMessage = 'Möchten Sie wirklich alle Charaktere zurücksetzen? Alle beantworteten Fragen werden gelöscht.';
    this.pendingAction = () => this.executeResetAllCharacters();
    this.showConfirmDialog = true;
  }

  executeResetAllCharacters() {
    this.loading = true;
    this.apiService.resetAllCharacters().subscribe({
      next: () => {
        this.showMessage('Alle Charaktere wurden erfolgreich zurückgesetzt', 'success');
        this.loadStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error resetting characters:', error);
        this.showMessage('Fehler beim Zurücksetzen der Charaktere', 'error');
        this.loading = false;
      }
    });
  }

  confirmAction() {
    if (this.pendingAction) {
      this.pendingAction();
    }
    this.showConfirmDialog = false;
    this.pendingAction = null;
  }

  cancelAction() {
    this.showConfirmDialog = false;
    this.pendingAction = null;
  }

  showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
