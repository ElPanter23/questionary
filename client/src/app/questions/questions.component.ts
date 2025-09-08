import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Question } from '../services/api.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
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
