import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="theme-toggle"
      (click)="toggleTheme()"
      [title]="getToggleTitle()"
      [attr.aria-label]="getToggleTitle()"
    >
      <span class="theme-icon">
        <span class="sun-icon" [class.hidden]="themeService.isDarkMode()">☀️</span>
        <span class="moon-icon" [class.hidden]="themeService.isLightMode()">🌙</span>
      </span>
      <span class="theme-text">
        {{ getCurrentThemeText() }}
      </span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--theme-toggle-bg, #f8f9fa);
      border: 2px solid var(--theme-toggle-border, #dee2e6);
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-toggle-text, #495057);
      
      &:hover {
        background: var(--theme-toggle-bg-hover, #e9ecef);
        border-color: var(--theme-toggle-border-hover, #adb5bd);
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    .theme-icon {
      position: relative;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .sun-icon,
    .moon-icon {
      position: absolute;
      transition: opacity 0.3s ease, transform 0.3s ease;
      font-size: 16px;
    }
    
    .sun-icon.hidden,
    .moon-icon.hidden {
      opacity: 0;
      transform: scale(0.8);
    }
    
    .theme-text {
      white-space: nowrap;
    }
    
    @media (max-width: 768px) {
      .theme-text {
        display: none;
      }
      
      .theme-toggle {
        padding: 8px;
        min-width: 40px;
        justify-content: center;
      }
    }
  `]
})
export class ThemeToggleComponent {
  public readonly themeService = inject(ThemeService);
  public readonly i18nService = inject(I18nService);
  
  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  public getCurrentThemeText(): string {
    return this.themeService.isDarkMode() 
      ? this.i18nService.getTranslation('lightMode')
      : this.i18nService.getTranslation('darkMode');
  }
  
  public getToggleTitle(): string {
    return this.i18nService.getTranslation('toggleTheme');
  }
}
