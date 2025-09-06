import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { I18nService } from './services/i18n.service';
import { ThemeToggleComponent } from './components/theme-toggle.component';
import { LanguageSelectorComponent } from './components/language-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ThemeToggleComponent, LanguageSelectorComponent],
  template: `
    <div class="container">
      <header class="text-center mb-4">
        <div class="header-controls">
          <div class="header-title">
            <h1 style="color: var(--text-secondary); font-size: 3rem; font-weight: 700; margin-bottom: 8px;">
              {{ i18nService.getTranslation('questionTool') }}
            </h1>
            <p style="color: var(--text-secondary); font-size: 1.2rem;">
              {{ i18nService.getTranslation('discoverCharacters') }}
            </p>
          </div>
          <div class="header-actions">
            <app-language-selector></app-language-selector>
            <app-theme-toggle></app-theme-toggle>
          </div>
        </div>
      </header>
      
      <nav class="card mb-4">
        <div class="grid grid-4">
          <a routerLink="/game" class="btn btn-secondary" routerLinkActive="active">
            🎮 {{ i18nService.getTranslation('game') }}
          </a>
          <a routerLink="/characters" class="btn btn-secondary" routerLinkActive="active">
            👥 {{ i18nService.getTranslation('characters') }}
          </a>
          <a routerLink="/questions" class="btn btn-secondary" routerLinkActive="active">
            ❓ {{ i18nService.getTranslation('questions') }}
          </a>
          <a routerLink="/admin" class="btn btn-secondary" routerLinkActive="active">
            ⚙️ {{ i18nService.getTranslation('admin') }}
          </a>
        </div>
      </nav>
      
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
    }
    
    nav a {
      text-decoration: none;
      display: block;
      text-align: center;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .grid-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .grid-4 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent {
  public readonly i18nService = inject(I18nService);
  public readonly themeService = inject(ThemeService);
  title = 'question-tool';
}
