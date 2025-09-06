import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService, Language } from '../services/i18n.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="language-selector">
      <select 
        id="language-select"
        class="language-select"
        [value]="currentLanguage()"
        (change)="onLanguageChange($event)"
        [title]="i18nService.getTranslation('selectLanguage')"
      >
        <option 
          *ngFor="let lang of availableLanguages" 
          [value]="lang.code"
        >
          {{ lang.flag }} {{ lang.name }}
        </option>
      </select>
    </div>
  `,
  styles: [`
    .language-selector {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 200px;
    }
    
    .language-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--language-label-color, #6c757d);
      margin-bottom: 2px;
    }
    
    .language-select {
      background: var(--language-select-bg, #ffffff);
      border: 2px solid var(--language-select-border, #dee2e6);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--language-select-text, #495057);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: var(--language-select-focus, #667eea);
        box-shadow: 0 0 0 3px var(--language-select-shadow, rgba(102, 126, 234, 0.1));
      }
      
      &:hover {
        border-color: var(--language-select-hover, #adb5bd);
      }
      
      option {
        padding: 8px;
        background: var(--language-option-bg, #ffffff);
        color: var(--language-option-text, #495057);
      }
    }
    
    @media (max-width: 768px) {
      .language-selector {
        min-width: 150px;
      }
      
      .language-label {
        display: none;
      }
      
      .language-select {
        font-size: 13px;
        padding: 6px 10px;
      }
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  public readonly i18nService = inject(I18nService);
  public readonly availableLanguages = this.i18nService.getAvailableLanguages();
  
  // Create a computed signal that always reflects the current language
  public readonly currentLanguage = computed(() => this.i18nService.sLanguage());
  
  constructor() {
    // Use effect to update the select element when language changes
    effect(() => {
      const currentLang = this.currentLanguage();
      setTimeout(() => {
        const selectElement = document.getElementById('language-select') as HTMLSelectElement;
        if (selectElement && selectElement.value !== currentLang) {
          selectElement.value = currentLang;
        }
      }, 0);
    });
  }
  
  ngOnInit(): void {
    // Ensure the select is set to the current language on init
    setTimeout(() => {
      const selectElement = document.getElementById('language-select') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = this.currentLanguage();
      }
    }, 0);
  }
  
  public onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLanguage = target.value as Language;
    this.i18nService.setLanguage(selectedLanguage);
  }
}
