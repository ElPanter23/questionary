import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService, Language } from '../services/i18n.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
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
