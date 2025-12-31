import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'signup', loadComponent: () => import('./create-account/create-account').then(m => m.CreateAccount) },
  {path: 'chats', loadComponent: () => import('./chat/chat').then(m => m.Chat) },
  {path: 'verifywithotp', loadComponent: () => import('./otp/otp').then(m => m.Otp) },
];
