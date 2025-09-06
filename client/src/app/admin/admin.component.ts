import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="text-center mb-4">🔧 {{ i18nService.getTranslation('adminInterface') }}</h2>
      
      <!-- Database Statistics -->
      <div class="mb-4">
        <h3>📊 {{ i18nService.getTranslation('databaseStatistics') }}</h3>
        <div class="grid grid-3 gap-3" *ngIf="databaseStats">
          <div class="stat-card">
            <div class="stat-number">{{ databaseStats.questionsCount }}</div>
            <div class="stat-label">{{ i18nService.getTranslation('questionsCount') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ databaseStats.charactersCount }}</div>
            <div class="stat-label">{{ i18nService.getTranslation('charactersCount') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ databaseStats.answeredQuestionsCount }}</div>
            <div class="stat-label">{{ i18nService.getTranslation('answeredQuestionsCount') }}</div>
          </div>
        </div>
        <button class="btn btn-primary" (click)="loadStats()" [disabled]="loading">
          {{ loading ? i18nService.getTranslation('loading') : i18nService.getTranslation('updateStatistics') }}
        </button>
      </div>

      <!-- Database Management -->
      <div class="mb-4">
        <h3>🗄️ {{ i18nService.getTranslation('databaseManagement') }}</h3>
        <div class="admin-actions">
          <button 
            class="btn btn-danger" 
            (click)="clearDatabase()" 
            [disabled]="loading"
            [title]="i18nService.getTranslation('clearDatabaseTooltip')">
            🗑️ {{ i18nService.getTranslation('clearDatabase') }}
          </button>
          <button 
            class="btn btn-success" 
            (click)="preloadExampleData()" 
            [disabled]="loading"
            [title]="i18nService.getTranslation('loadExampleDataTooltip')">
            📥 {{ i18nService.getTranslation('loadExampleData') }}
          </button>
        </div>
      </div>

      <!-- Character Management -->
      <div class="mb-4">
        <h3>👥 {{ i18nService.getTranslation('characterManagement') }}</h3>
        <div class="admin-actions">
          <button 
            class="btn btn-warning" 
            (click)="resetAllCharacters()" 
            [disabled]="loading"
            [title]="i18nService.getTranslation('resetAllCharactersTooltip')">
            🔄 {{ i18nService.getTranslation('resetAllCharacters') }}
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
            <button class="btn btn-secondary" (click)="cancelAction()">{{ i18nService.getTranslation('cancel') }}</button>
            <button class="btn btn-danger" (click)="confirmAction()">{{ i18nService.getTranslation('confirm') }}</button>
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
  public readonly i18nService = inject(I18nService);
  
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
        this.showMessage(this.i18nService.getTranslation('errorLoadingStats'), 'error');
        this.loading = false;
      }
    });
  }

  clearDatabase() {
    this.confirmTitle = this.i18nService.getTranslation('confirmClearDatabase');
    this.confirmMessage = this.i18nService.getTranslation('confirmClearDatabaseMessage');
    this.pendingAction = () => this.executeClearDatabase();
    this.showConfirmDialog = true;
  }

  executeClearDatabase() {
    this.loading = true;
    this.apiService.clearDatabase().subscribe({
      next: () => {
        this.showMessage(this.i18nService.getTranslation('databaseCleared'), 'success');
        this.loadStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error clearing database:', error);
        this.showMessage(this.i18nService.getTranslation('errorClearingDatabase'), 'error');
        this.loading = false;
      }
    });
  }

  preloadExampleData() {
    this.confirmTitle = this.i18nService.getTranslation('confirmLoadExampleData');
    this.confirmMessage = this.i18nService.getTranslation('confirmLoadExampleDataMessage');
    this.pendingAction = () => this.executePreloadData();
    this.showConfirmDialog = true;
  }

  executePreloadData() {
    this.loading = true;
    this.apiService.preloadExampleData().subscribe({
      next: (result) => {
        this.showMessage(this.i18nService.getTranslation('exampleDataLoaded'), 'success');
        this.loadStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error preloading data:', error);
        this.showMessage(this.i18nService.getTranslation('errorLoadingExampleData'), 'error');
        this.loading = false;
      }
    });
  }

  resetAllCharacters() {
    this.confirmTitle = this.i18nService.getTranslation('confirmResetAllCharacters');
    this.confirmMessage = this.i18nService.getTranslation('confirmResetAllCharactersMessage');
    this.pendingAction = () => this.executeResetAllCharacters();
    this.showConfirmDialog = true;
  }

  executeResetAllCharacters() {
    this.loading = true;
    this.apiService.resetAllCharacters().subscribe({
      next: () => {
        this.showMessage(this.i18nService.getTranslation('allCharactersReset'), 'success');
        this.loadStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error resetting characters:', error);
        this.showMessage(this.i18nService.getTranslation('errorResettingCharacters'), 'error');
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
