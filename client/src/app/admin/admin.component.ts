import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
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
