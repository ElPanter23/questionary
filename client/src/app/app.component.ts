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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public readonly i18nService = inject(I18nService);
  public readonly themeService = inject(ThemeService);
  title = 'question-tool';
}
