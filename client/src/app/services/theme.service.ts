import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

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
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
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
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#667eea');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = theme === 'dark' ? '#1a1a1a' : '#667eea';
      document.head.appendChild(meta);
    }
  }
  
  public isDarkMode(): boolean {
    return this._sTheme() === 'dark';
  }
  
  public isLightMode(): boolean {
    return this._sTheme() === 'light';
  }
}
