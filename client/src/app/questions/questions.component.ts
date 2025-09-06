import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Question } from '../services/api.service';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="text-center mb-4">❓ Fragen verwalten</h2>
      
      <!-- Neue Frage hinzufügen -->
      <div class="mb-4">
        <h3>Neue Frage hinzufügen</h3>
        <form (ngSubmit)="addQuestion()" #questionForm="ngForm">
          <div class="form-group">
            <label class="form-label" for="text">Fragentext *</label>
            <textarea 
              id="text" 
              name="text" 
              class="form-control textarea" 
              [(ngModel)]="newQuestion.text" 
              required
              placeholder="z.B. Was ist dein größter Traum?"></textarea>
          </div>
          
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label" for="category">Kategorie</label>
              <input 
                type="text" 
                id="category" 
                name="category" 
                class="form-control" 
                [(ngModel)]="newQuestion.category"
                placeholder="z.B. Persönlich">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="difficulty">Schwierigkeit (1-5)</label>
              <input 
                type="number" 
                id="difficulty" 
                name="difficulty" 
                class="form-control" 
                [(ngModel)]="newQuestion.difficulty"
                min="1" 
                max="5"
                placeholder="1">
            </div>
          </div>
          
          <button type="submit" class="btn" [disabled]="!questionForm.form.valid || loading">
            {{ loading ? 'Hinzufügen...' : 'Frage hinzufügen' }}
          </button>
        </form>
      </div>

      <!-- Bulk Import -->
      <div class="card mb-4">
        <h3>📥 Mehrere Fragen importieren</h3>
        <p>Füge mehrere Fragen gleichzeitig hinzu. Eine Frage pro Zeile:</p>
        <form (ngSubmit)="importQuestions()" #importForm="ngForm">
          <div class="form-group">
            <label class="form-label" for="bulkText">Fragen (eine pro Zeile)</label>
            <textarea 
              id="bulkText" 
              name="bulkText" 
              class="form-control textarea" 
              [(ngModel)]="bulkImportText" 
              required
              placeholder="Was ist dein größter Traum?&#10;Welche Farbe beschreibt dich am besten?&#10;Was würdest du tun, wenn du unsichtbar wärst?"></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="bulkCategory">Standard-Kategorie</label>
            <input 
              type="text" 
              id="bulkCategory" 
              name="bulkCategory" 
              class="form-control" 
              [(ngModel)]="bulkCategory"
              placeholder="z.B. Allgemein">
          </div>
          
          <button type="submit" class="btn" [disabled]="!importForm.form.valid || loading">
            {{ loading ? 'Importieren...' : 'Fragen importieren' }}
          </button>
        </form>
      </div>

      <!-- Web Scraping -->
      <div class="card mb-4">
        <h3>🌐 Fragen von Webseiten importieren</h3>
        
        <!-- 100-fragen.de Scraping -->
        <div class="mb-4">
          <h4>Von 100-fragen.de importieren</h4>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label" for="scrapingCategory">Kategorie</label>
              <select id="scrapingCategory" class="form-control" [(ngModel)]="selectedScrapingCategory">
                <option *ngFor="let category of scrapingCategories" [value]="category.key">
                  {{ category.name }} - {{ category.description }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <button class="btn" (click)="scrapeFrom100Fragen()" [disabled]="scraping">
                {{ scraping ? 'Scraping...' : '🚀 Von 100-fragen.de importieren' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Custom URL Scraping -->
        <div>
          <h4>Von beliebiger URL importieren</h4>
          <form (ngSubmit)="scrapeFromCustomUrl()" #customForm="ngForm">
            <div class="form-group">
              <label class="form-label" for="customUrl">URL</label>
              <input 
                type="url" 
                id="customUrl" 
                name="customUrl" 
                class="form-control" 
                [(ngModel)]="customUrl" 
                required
                placeholder="https://example.com/questions">
            </div>
            
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label" for="customCategory">Kategorie</label>
                <input 
                  type="text" 
                  id="customCategory" 
                  name="customCategory" 
                  class="form-control" 
                  [(ngModel)]="customCategory"
                  placeholder="z.B. Gescrapt">
              </div>
              
              <div class="form-group">
                <label class="form-label" for="customDifficulty">Schwierigkeit (1-5)</label>
                <input 
                  type="number" 
                  id="customDifficulty" 
                  name="customDifficulty" 
                  class="form-control" 
                  [(ngModel)]="customDifficulty"
                  min="1" 
                  max="5">
              </div>
            </div>
            
            <button type="submit" class="btn" [disabled]="!customForm.form.valid || scraping">
              {{ scraping ? 'Scraping...' : '🌐 Von URL importieren' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Fragen-Liste -->
      <div>
        <div class="mb-4">
          <h3>Vorhandene Fragen ({{ questions.length }})</h3>
          <div class="grid grid-2">
            <div>
              <label class="form-label" for="filterCategory">Nach Kategorie filtern:</label>
              <select id="filterCategory" class="form-control" [(ngModel)]="filterCategory" (ngModelChange)="filterQuestions()">
                <option value="">Alle Kategorien</option>
                <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="searchText">Suchen:</label>
              <input 
                type="text" 
                id="searchText" 
                class="form-control" 
                [(ngModel)]="searchText" 
                (ngModelChange)="filterQuestions()"
                placeholder="Fragentext durchsuchen">
            </div>
          </div>
        </div>
        
        <div *ngIf="filteredQuestions.length === 0" class="text-center">
          <p *ngIf="questions.length === 0">Noch keine Fragen vorhanden.</p>
          <p *ngIf="questions.length > 0">Keine Fragen entsprechen den Filterkriterien.</p>
        </div>
        
        <div class="grid grid-2" *ngIf="filteredQuestions.length > 0">
          <div *ngFor="let question of filteredQuestions" class="card">
            <h4>{{ question.text }}</h4>
            <div class="mt-2">
              <span *ngIf="question.category" class="status-badge">{{ question.category }}</span>
              <span *ngIf="question.difficulty" class="status-badge" style="margin-left: 8px;">
                Schwierigkeit: {{ question.difficulty }}
              </span>
            </div>
            <div class="mt-4">
              <button class="btn btn-danger" (click)="deleteQuestion(question.id)">
                🗑️ Löschen
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lade-Status -->
      <div *ngIf="loading" class="loading">
        <p>Lade Fragen...</p>
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
        this.error = 'Fehler beim Laden der Fragen: ' + err.message;
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
        console.error('Fehler beim Laden der Scraping-Kategorien:', err);
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
        this.successMessage = 'Frage erfolgreich hinzugefügt!';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Hinzufügen: ' + err.message;
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
      this.error = 'Keine gültigen Fragen gefunden.';
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
        this.successMessage = `${result.success} Fragen erfolgreich importiert!`;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Importieren: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteQuestion(questionId: number) {
    if (!confirm('Möchtest du diese Frage wirklich löschen?')) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.deleteQuestion(questionId).subscribe({
      next: () => {
        this.questions = this.questions.filter(q => q.id !== questionId);
        this.updateCategories();
        this.filterQuestions();
        this.successMessage = 'Frage erfolgreich gelöscht!';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Löschen: ' + err.message;
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
        this.successMessage = `${result.success} Fragen erfolgreich importiert!`;
        this.scraping = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Scraping: ' + err.message;
        this.scraping = false;
      }
    });
  }

  scrapeFromCustomUrl() {
    if (!this.customUrl.trim()) {
      this.error = 'Bitte gib eine URL ein';
      return;
    }

    this.scraping = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.scrapeFromCustomUrl(this.customUrl, this.customCategory, this.customDifficulty).subscribe({
      next: (result) => {
        this.loadQuestions();
        this.successMessage = `${result.success} Fragen erfolgreich importiert!`;
        this.customUrl = '';
        this.scraping = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Scraping: ' + err.message;
        this.scraping = false;
      }
    });
  }
}
