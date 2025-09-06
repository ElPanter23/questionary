import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="container">
      <header class="text-center mb-4">
        <h1 style="color: white; font-size: 3rem; font-weight: 700; margin-bottom: 8px;">
          Question Tool
        </h1>
        <p style="color: rgba(255, 255, 255, 0.8); font-size: 1.2rem;">
          Entdecke Charaktere durch zufällige Fragen
        </p>
      </header>
      
      <nav class="card mb-4">
        <div class="grid grid-4">
          <a routerLink="/game" class="btn btn-secondary" routerLinkActive="active">
            🎮 Spiel
          </a>
          <a routerLink="/characters" class="btn btn-secondary" routerLinkActive="active">
            👥 Charaktere
          </a>
          <a routerLink="/questions" class="btn btn-secondary" routerLinkActive="active">
            ❓ Fragen
          </a>
          <a routerLink="/admin" class="btn btn-secondary" routerLinkActive="active">
            ⚙️ Admin
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
  title = 'question-tool';
}
