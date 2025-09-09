import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './services/i18n.service';
import { ThemeService } from './services/theme.service';
import { LanguageSelectorComponent } from './components/language-selector.component';
import { ThemeToggleComponent } from './components/theme-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LanguageSelectorComponent, ThemeToggleComponent],
  template: `
    <div class="app-container" [class.dark-theme]="themeService.isDarkMode()">
      <!-- Demo-only header -->
      <header class="demo-header">
        <div class="header-content">
          <h1 class="app-title">
            🎮 {{ i18nService.getTranslation('questionTool') }} - {{ i18nService.getTranslation('demoMode') }}
          </h1>
          <div class="header-controls">
            <app-language-selector></app-language-selector>
            <app-theme-toggle></app-theme-toggle>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Demo-only footer -->
      <footer class="demo-footer">
        <p>{{ i18nService.getTranslation('demoModeDescription') }}</p>
        <p class="text-muted">{{ i18nService.getTranslation('demoDisclaimer') }}</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--bg-primary, #f8f9fa);
      color: var(--text-primary, #333);
      transition: all 0.3s ease;
    }

    .demo-header {
      background: var(--bg-secondary, white);
      border-bottom: 2px solid var(--border-color, #e1e5e9);
      box-shadow: var(--shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      padding: 1rem 0;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .app-title {
      margin: 0;
      font-size: 1.5rem;
      color: var(--text-primary, #333);
      font-weight: 600;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .main-content {
      flex: 1;
      padding: 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .demo-footer {
      background: var(--bg-secondary, white);
      border-top: 1px solid var(--border-color, #e1e5e9);
      padding: 1rem;
      text-align: center;
      margin-top: auto;
    }

    .demo-footer p {
      margin: 0.5rem 0;
      color: var(--text-primary, #333);
    }

    .text-muted {
      color: var(--text-muted, #666);
      font-size: 0.9rem;
    }

    /* Dark theme adjustments */
    .dark-theme {
      --bg-primary: #1a1a1a;
      --bg-secondary: #2d2d2d;
      --text-primary: #ffffff;
      --text-muted: #cccccc;
      --border-color: #404040;
      --shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .app-title {
        font-size: 1.2rem;
      }

      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class AppDemoOnlyComponent {
  public readonly i18nService = inject(I18nService);
  public readonly themeService = inject(ThemeService);
}
