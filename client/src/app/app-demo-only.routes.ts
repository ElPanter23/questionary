import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/demo', pathMatch: 'full' },
  { path: 'demo', loadComponent: () => import('./demo/demo-landing.component').then(m => m.DemoLandingComponent) },
  { path: 'demo/:id', loadComponent: () => import('./demo/demo-game.component').then(m => m.DemoGameComponent) },
  { path: 'demo/:id/characters', loadComponent: () => import('./demo/demo-characters.component').then(m => m.DemoCharactersComponent) },
  { path: 'demo/:id/questions', loadComponent: () => import('./demo/demo-questions.component').then(m => m.DemoQuestionsComponent) },
  { path: '**', redirectTo: '/demo' }
];
