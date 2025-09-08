import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'cyberpunk' | 'kawaii' | 'ocean' | 'fire' | 'space' | 'dnd' | 'trade_republic';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _sTheme = signal<Theme>('light');
  
  // Public readonly signal for components to subscribe to
  public readonly sTheme = this._sTheme.asReadonly();
  
  constructor() {
    // Initialize theme from localStorage or system preference
    this._initializeTheme();
  }
  
  private _initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const validThemes = ['light', 'dark', 'cyberpunk', 'kawaii', 'ocean', 'fire', 'space', 'dnd', 'trade_republic'];
    if (savedTheme && validThemes.includes(savedTheme)) {
      this._sTheme.set(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._sTheme.set(prefersDark ? 'dark' : 'light');
    }
    this._applyTheme();
  }
  
  public toggleTheme(): void {
    const newTheme = this._sTheme() === 'light' ? 'dark' : 'light';
    this._sTheme.set(newTheme);
    localStorage.setItem('theme', newTheme);
    this._applyTheme();
  }
  
  public toggleEasterEgg(): void {
    this._sTheme.set('cyberpunk');
    localStorage.setItem('theme', 'cyberpunk');
    this._applyTheme();
  }
  
  public setEasterEggTheme(theme: 'cyberpunk' | 'kawaii' | 'ocean' | 'fire' | 'space' | 'dnd' | 'trade_republic'): void {
    this._sTheme.set(theme);
    localStorage.setItem('theme', theme);
    this._applyTheme();
  }
  
  public setTheme(theme: Theme): void {
    this._sTheme.set(theme);
    localStorage.setItem('theme', theme);
    this._applyTheme();
  }
  
  private _applyTheme(): void {
    const theme = this._sTheme();
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const themeColors = {
      'light': '#667eea',
      'dark': '#1a1a1a',
      'cyberpunk': '#0a0a0a',
      'kawaii': '#ffb6c1',
      'ocean': '#006994',
      'fire': '#ff4500',
      'space': '#4b0082',
      'dnd': '#8B4513',
      'trade_republic': '#00D4AA'
    };
    
    const themeColor = themeColors[theme] || '#667eea';
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = themeColor;
      document.head.appendChild(meta);
    }
  }
  
  public isDarkMode(): boolean {
    return this._sTheme() === 'dark';
  }
  
  public isLightMode(): boolean {
    return this._sTheme() === 'light';
  }
  
  public isEasterEggMode(): boolean {
    const easterEggThemes = ['cyberpunk', 'kawaii', 'ocean', 'fire', 'space', 'dnd', 'trade_republic'];
    return easterEggThemes.includes(this._sTheme());
  }
  
  public getEasterEggTheme(): string | null {
    const easterEggThemes = ['cyberpunk', 'kawaii', 'ocean', 'fire', 'space', 'dnd', 'trade_republic'];
    return easterEggThemes.includes(this._sTheme()) ? this._sTheme() : null;
  }
}
