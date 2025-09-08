import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Question } from '../services/api.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="text-center mb-4">❓ {{ i18nService.getTranslation('manageQuestions') }}</h2>
      
      <!-- Neue Frage hinzufügen -->
      <div class="mb-4">
        <h3>{{ i18nService.getTranslation('addNewQuestion') }}</h3>
        <form (ngSubmit)="addQuestion()" #questionForm="ngForm">
          <div class="form-group">
            <label class="form-label" for="text">{{ i18nService.getTranslation('questionText') }} *</label>
            <textarea 
              id="text" 
              name="text" 
              class="form-control textarea" 
              [(ngModel)]="newQuestion.text" 
              required
              [placeholder]="i18nService.getTranslation('placeholderQuestionText')"></textarea>
          </div>
          
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label" for="category">{{ i18nService.getTranslation('category') }}</label>
              <input 
                type="text" 
                id="category" 
                name="category" 
                class="form-control" 
                [(ngModel)]="newQuestion.category"
                [placeholder]="i18nService.getTranslation('placeholderCategory')">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="difficulty">{{ i18nService.getTranslation('seasonLevel') }}</label>
              <input 
                type="number" 
                id="difficulty" 
                name="difficulty" 
                class="form-control" 
                [(ngModel)]="newQuestion.difficulty"
                min="1" 
                max="4"
                [placeholder]="i18nService.getTranslation('placeholderSeason')">
            </div>
          </div>
          
          <button type="submit" class="btn" [disabled]="!questionForm.form.valid || loading">
            {{ loading ? i18nService.getTranslation('addingQuestion') : i18nService.getTranslation('addQuestion') }}
          </button>
        </form>
      </div>

      <!-- Bulk Import -->
      <div class="card mb-4">
        <h3>📥 {{ i18nService.getTranslation('importMultipleQuestions') }}</h3>
        <p>{{ i18nService.getTranslation('addMultipleQuestions') }}</p>
        <form (ngSubmit)="importQuestions()" #importForm="ngForm">
          <div class="form-group">
            <label class="form-label" for="bulkText">{{ i18nService.getTranslation('questionsOnePerLine') }}</label>
            <textarea 
              id="bulkText" 
              name="bulkText" 
              class="form-control textarea" 
              [(ngModel)]="bulkImportText" 
              required
              [placeholder]="i18nService.getTranslation('placeholderMultipleQuestions')"></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="bulkCategory">{{ i18nService.getTranslation('standardCategory') }}</label>
            <input 
              type="text" 
              id="bulkCategory" 
              name="bulkCategory" 
              class="form-control" 
              [(ngModel)]="bulkCategory"
              [placeholder]="i18nService.getTranslation('placeholderCustomCategory')">
          </div>
          
          <button type="submit" class="btn" [disabled]="!importForm.form.valid || loading">
            {{ loading ? i18nService.getTranslation('importing') : i18nService.getTranslation('importQuestions') }}
          </button>
        </form>
      </div>

      <!-- Web Scraping -->
      <div class="card mb-4">
        <h3>🌐 {{ i18nService.getTranslation('importFromWeb') }}</h3>
        
        <!-- 100-fragen.de Scraping -->
        <div class="mb-4">
          <h4>{{ i18nService.getTranslation('importFrom100Fragen') }}</h4>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label" for="scrapingCategory">{{ i18nService.getTranslation('selectCategory') }}</label>
              <select id="scrapingCategory" class="form-control" [(ngModel)]="selectedScrapingCategory">
                <option *ngFor="let category of scrapingCategories" [value]="category.key">
                  {{ category.name }} - {{ category.description }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <button class="btn" (click)="scrapeFrom100Fragen()" [disabled]="scraping">
                {{ scraping ? i18nService.getTranslation('importing') : i18nService.getTranslation('importFrom100FragenButton') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Custom URL Scraping -->
        <div>
          <h4>{{ i18nService.getTranslation('importFromCustomUrl') }}</h4>
          <form (ngSubmit)="scrapeFromCustomUrl()" #customForm="ngForm">
            <div class="form-group">
              <label class="form-label" for="customUrl">{{ i18nService.getTranslation('url') }}</label>
              <input 
                type="url" 
                id="customUrl" 
                name="customUrl" 
                class="form-control" 
                [(ngModel)]="customUrl" 
                required
                [placeholder]="i18nService.getTranslation('placeholderUrl')">
            </div>
            
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label" for="customCategory">{{ i18nService.getTranslation('customCategory') }}</label>
                <input 
                  type="text" 
                  id="customCategory" 
                  name="customCategory" 
                  class="form-control" 
                  [(ngModel)]="customCategory"
                  [placeholder]="i18nService.getTranslation('placeholderCustomCategory')">
              </div>
              
              <div class="form-group">
                <label class="form-label" for="customDifficulty">{{ i18nService.getTranslation('customSeason') }}</label>
                <input 
                  type="number" 
                  id="customDifficulty" 
                  name="customDifficulty" 
                  class="form-control" 
                  [(ngModel)]="customDifficulty"
                  min="1" 
                  max="4">
              </div>
            </div>
            
            <button type="submit" class="btn" [disabled]="!customForm.form.valid || scraping">
              {{ scraping ? i18nService.getTranslation('importing') : i18nService.getTranslation('importFromUrlButton') }}
            </button>
          </form>
        </div>
      </div>

      <!-- Fragen-Liste -->
      <div>
        <div class="mb-4">
          <h3>{{ i18nService.getTranslation('existingQuestions') }} ({{ questions.length }})</h3>
          <div class="grid grid-2">
            <div>
              <label class="form-label" for="filterCategory">{{ i18nService.getTranslation('filterByCategory') }}</label>
              <select id="filterCategory" class="form-control" [(ngModel)]="filterCategory" (ngModelChange)="filterQuestions()">
                <option value="">{{ i18nService.getTranslation('allCategories') }}</option>
                <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="searchText">{{ i18nService.getTranslation('search') }}</label>
              <input 
                type="text" 
                id="searchText" 
                class="form-control" 
                [(ngModel)]="searchText" 
                (ngModelChange)="filterQuestions()"
                [placeholder]="i18nService.getTranslation('searchQuestionText')">
            </div>
          </div>
        </div>
        
        <div *ngIf="filteredQuestions.length === 0" class="text-center">
          <p *ngIf="questions.length === 0">{{ i18nService.getTranslation('noQuestionsYet') }}</p>
          <p *ngIf="questions.length > 0">{{ i18nService.getTranslation('noQuestionsMatchFilter') }}</p>
        </div>
        
        <div class="grid grid-2" *ngIf="filteredQuestions.length > 0">
          <div *ngFor="let question of filteredQuestions" class="card">
            <h4>{{ question.text }}</h4>
            <div class="mt-2">
              <span *ngIf="question.category" class="status-badge">{{ question.category }}</span>
              <span *ngIf="question.difficulty" class="status-badge" style="margin-left: 8px;">
                {{ i18nService.getTranslation('seasonLevelLabel') }} {{ question.difficulty }}
              </span>
            </div>
            <div class="mt-4">
              <button class="btn btn-danger" (click)="deleteQuestion(question.id)">
                🗑️ {{ i18nService.getTranslation('delete') }}
              </button>
            </div>
          </div>
        </div>
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
    .card {
      margin-bottom: 16px;
    }
    
    .card h4 {
      margin-bottom: 12px;
      line-height: 1.4;
    }
  `]
})
export class QuestionsComponent implements OnInit {
  public readonly i18nService = inject(I18nService);
  
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  newQuestion: Partial<Question> = {};
  bulkImportText = '';
  bulkCategory = '';
  filterCategory = '';
  searchText = '';
  categories: string[] = [];
  loading = false;
  error = '';
  successMessage = '';
  
  // Scraping
  scrapingCategories: any[] = [];
  selectedScrapingCategory = 'all';
  customUrl = '';
  customCategory = 'Gescrapt';
  customDifficulty = 2;
  scraping = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadQuestions();
    this.loadScrapingCategories();
  }

  loadQuestions() {
    this.loading = true;
    this.apiService.getQuestions().subscribe({
      next: (questions) => {
        this.questions = questions;
        this.updateCategories();
        this.filterQuestions();
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorLoadingQuestions') + ' ' + err.message;
        this.loading = false;
      }
    });
  }

  loadScrapingCategories() {
    this.apiService.getScrapingCategories().subscribe({
      next: (categories) => {
        this.scrapingCategories = categories;
      },
      error: (err) => {
        console.error(this.i18nService.getTranslation('errorLoadingStats'), err);
      }
    });
  }

  updateCategories() {
    const categorySet = new Set<string>();
    this.questions.forEach(q => {
      if (q.category) {
        categorySet.add(q.category);
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  filterQuestions() {
    this.filteredQuestions = this.questions.filter(question => {
      const matchesCategory = !this.filterCategory || question.category === this.filterCategory;
      const matchesSearch = !this.searchText || 
        question.text.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  addQuestion() {
    if (!this.newQuestion.text) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.addQuestion(this.newQuestion).subscribe({
      next: (question) => {
        this.questions.unshift(question);
        this.updateCategories();
        this.filterQuestions();
        this.newQuestion = {};
        this.successMessage = this.i18nService.getTranslation('questionAdded');
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorAddingQuestion') + ' ' + err.message;
        this.loading = false;
      }
    });
  }

  importQuestions() {
    if (!this.bulkImportText.trim()) return;

    const questionTexts = this.bulkImportText
      .split('\n')
      .map(text => text.trim())
      .filter(text => text.length > 0);

    if (questionTexts.length === 0) {
      this.error = this.i18nService.getTranslation('noValidQuestionsFound');
      return;
    }

    const questions = questionTexts.map(text => ({
      text,
      category: this.bulkCategory || 'Allgemein',
      difficulty: 1
    }));

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.addQuestions(questions).subscribe({
      next: (result) => {
        this.bulkImportText = '';
        this.bulkCategory = '';
        this.loadQuestions();
        this.successMessage = `${result.success} ${this.i18nService.getTranslation('questionsImported')}`;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorImporting') + ' ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteQuestion(questionId: number) {
    if (!confirm(this.i18nService.getTranslation('confirmDeleteQuestion'))) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.deleteQuestion(questionId).subscribe({
      next: () => {
        this.questions = this.questions.filter(q => q.id !== questionId);
        this.updateCategories();
        this.filterQuestions();
        this.successMessage = this.i18nService.getTranslation('questionDeleted');
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorDeletingQuestion') + ' ' + err.message;
        this.loading = false;
      }
    });
  }

  // Scraping-Methoden
  scrapeFrom100Fragen() {
    this.scraping = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.scrapeFrom100Fragen(this.selectedScrapingCategory).subscribe({
      next: (result) => {
        this.loadQuestions();
        this.successMessage = `${result.success} ${this.i18nService.getTranslation('questionsImported')}`;
        this.scraping = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorScraping') + ' ' + err.message;
        this.scraping = false;
      }
    });
  }

  scrapeFromCustomUrl() {
    if (!this.customUrl.trim()) {
      this.error = this.i18nService.getTranslation('pleaseEnterUrl');
      return;
    }

    this.scraping = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.scrapeFromCustomUrl(this.customUrl, this.customCategory, this.customDifficulty).subscribe({
      next: (result) => {
        this.loadQuestions();
        this.successMessage = `${result.success} ${this.i18nService.getTranslation('questionsImported')}`;
        this.customUrl = '';
        this.scraping = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorScraping') + ' ' + err.message;
        this.scraping = false;
      }
    });
  }
}
