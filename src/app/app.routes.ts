import { Routes } from '@angular/router';
import { guestGuard } from '../guest.guard';
import { authGuard } from '../auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login),canActivate: [guestGuard] },
  { path: 'signup', loadComponent: () => import('./create-account/create-account').then(m => m.CreateAccount), canActivate: [guestGuard] },
  {path: 'chats', loadComponent: () => import('./chat/chat').then(m => m.Chat),canActivate: [authGuard] },
  {path: 'verifywithotp', loadComponent: () => import('./otp/otp').then(m => m.Otp) , canActivate: [authGuard]},
  {path: 'profile', loadComponent: () => import('./profile-upload/profile-upload').then(m => m.ProfileUpload)},
];
