import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  public readonly themeService = inject(ThemeService);
  public readonly i18nService = inject(I18nService);
  
  private _keydownListener?: (event: KeyboardEvent) => void;
  private _keyupListener?: (event: KeyboardEvent) => void;
  private _lastPressedNumber: number = 0;
  private _numberKeyTimeout?: number;
  
  ngOnInit(): void {
    this._keydownListener = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key >= '1' && event.key <= '7') {
        this._lastPressedNumber = parseInt(event.key);
        // Clear any existing timeout
        if (this._numberKeyTimeout) {
          clearTimeout(this._numberKeyTimeout);
        }
        // Set timeout to clear the number after 2 seconds
        this._numberKeyTimeout = window.setTimeout(() => {
          this._lastPressedNumber = 0;
        }, 2000);
      }
    };
    
    this._keyupListener = (event: KeyboardEvent) => {
      if (event.key >= '1' && event.key <= '7') {
        // Keep the number for a bit longer after keyup
        if (this._numberKeyTimeout) {
          clearTimeout(this._numberKeyTimeout);
        }
        this._numberKeyTimeout = window.setTimeout(() => {
          this._lastPressedNumber = 0;
        }, 1000);
      }
    };
    
    document.addEventListener('keydown', this._keydownListener);
    document.addEventListener('keyup', this._keyupListener);
  }
  
  ngOnDestroy(): void {
    if (this._keydownListener) {
      document.removeEventListener('keydown', this._keydownListener);
    }
    if (this._keyupListener) {
      document.removeEventListener('keyup', this._keyupListener);
    }
    if (this._numberKeyTimeout) {
      clearTimeout(this._numberKeyTimeout);
    }
  }
  
  public onThemeToggle(event: MouseEvent): void {
    if (event.ctrlKey) {
      // Check for number keys (1-7) for different easter egg themes
      const easterEggThemes = ['cyberpunk', 'kawaii', 'ocean', 'fire', 'space', 'dnd', 'trade_republic'];
      
      if (this._lastPressedNumber >= 1 && this._lastPressedNumber <= 7) {
        this.themeService.setEasterEggTheme(easterEggThemes[this._lastPressedNumber - 1] as any);
        this._lastPressedNumber = 0; // Reset after use
      } else {
        // Default to cyberpunk if no number key
        this.themeService.toggleEasterEgg();
      }
    } else {
      this.themeService.toggleTheme();
    }
  }
  
  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  public getCurrentThemeText(): string {
    const easterEggTheme = this.themeService.getEasterEggTheme();
    if (easterEggTheme) {
      const themeNames: Record<string, string> = {
        'cyberpunk': 'CYBER MODE',
        'kawaii': 'KAWAII MODE',
        'ocean': 'OCEAN MODE',
        'fire': 'FIRE MODE',
        'space': 'SPACE MODE',
        'dnd': 'DND MODE',
        'trade_republic': 'TRADE REPUBLIC MODE'
      };
      return themeNames[easterEggTheme] || 'EASTER EGG';
    }
    return this.themeService.isDarkMode() 
      ? this.i18nService.getTranslation('lightMode')
      : this.i18nService.getTranslation('darkMode');
  }
  
  public getToggleTitle(): string {
    return this.i18nService.getTranslation('toggleTheme');
  }
}
