import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'game', loadComponent: () => import('./game/game.component').then(m => m.GameComponent) },
  { path: 'characters', loadComponent: () => import('./characters/characters.component').then(m => m.CharactersComponent) },
  { path: 'questions', loadComponent: () => import('./questions/questions.component').then(m => m.QuestionsComponent) },
  { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent) },
  { path: '**', redirectTo: '/game' }
];
