import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
      (click)="onThemeToggle($event)"
      [title]="getToggleTitle()"
      [attr.aria-label]="getToggleTitle()"
    >
      <span class="theme-icon">
        <span class="sun-icon" [class.hidden]="themeService.isDarkMode() || themeService.isEasterEggMode()">☀️</span>
        <span class="moon-icon" [class.hidden]="themeService.isLightMode() || themeService.isEasterEggMode()">🌙</span>
        <span class="cyber-icon" [class.hidden]="themeService.getEasterEggTheme() !== 'cyberpunk'">⚡</span>
        <span class="kawaii-icon" [class.hidden]="themeService.getEasterEggTheme() !== 'kawaii'">🌸</span>
        <span class="ocean-icon" [class.hidden]="themeService.getEasterEggTheme() !== 'ocean'">🌊</span>
        <span class="fire-icon" [class.hidden]="themeService.getEasterEggTheme() !== 'fire'">🔥</span>
        <span class="space-icon" [class.hidden]="themeService.getEasterEggTheme() !== 'space'">🌌</span>
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
      width: 200px;
      
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
    .moon-icon,
    .cyber-icon,
    .kawaii-icon,
    .ocean-icon,
    .fire-icon,
    .space-icon {
      position: absolute;
      transition: opacity 0.3s ease, transform 0.3s ease;
      font-size: 16px;
    }
    
    .sun-icon.hidden,
    .moon-icon.hidden,
    .cyber-icon.hidden,
    .kawaii-icon.hidden,
    .ocean-icon.hidden,
    .fire-icon.hidden,
    .space-icon.hidden {
      opacity: 0;
      transform: scale(0.8);
    }
    
    .cyber-icon {
      animation: cyberPulse 2s infinite;
    }
    
    .kawaii-icon {
      animation: kawaiiBounce 1.5s infinite;
    }
    
    .ocean-icon {
      animation: oceanWave 2s infinite;
    }
    
    .fire-icon {
      animation: fireFlicker 1s infinite;
    }
    
    .space-icon {
      animation: spaceTwinkle 3s infinite;
    }
    
    @keyframes cyberPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    
    @keyframes kawaiiBounce {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.1) rotate(-5deg); }
      75% { transform: scale(1.1) rotate(5deg); }
    }
    
    @keyframes oceanWave {
      0%, 100% { transform: scale(1) translateY(0); }
      50% { transform: scale(1.1) translateY(-2px); }
    }
    
    @keyframes fireFlicker {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.1) rotate(-2deg); }
      50% { transform: scale(0.9) rotate(2deg); }
      75% { transform: scale(1.1) rotate(-1deg); }
    }
    
    @keyframes spaceTwinkle {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
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
export class ThemeToggleComponent implements OnInit, OnDestroy {
  public readonly themeService = inject(ThemeService);
  public readonly i18nService = inject(I18nService);
  
  private _keydownListener?: (event: KeyboardEvent) => void;
  private _keyupListener?: (event: KeyboardEvent) => void;
  private _lastPressedNumber: number = 0;
  private _numberKeyTimeout?: number;
  
  ngOnInit(): void {
    this._keydownListener = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key >= '1' && event.key <= '5') {
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
      if (event.key >= '1' && event.key <= '5') {
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
      // Check for number keys (1-5) for different easter egg themes
      const easterEggThemes = ['cyberpunk', 'kawaii', 'ocean', 'fire', 'space'];
      
      if (this._lastPressedNumber >= 1 && this._lastPressedNumber <= 5) {
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
        'space': 'SPACE MODE'
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
