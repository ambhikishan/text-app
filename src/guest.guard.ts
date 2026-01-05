// guest.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';


export const guestGuard = () => {
//   const authService = inject(AuthService);
  const router = inject(Router);

  if (localStorage.getItem('token')) {
    // User is already logged in, redirect them away from Login page
    router.navigate(['/chats']);
    return false; // Block access to Login page
  }
  
  return true; // Allow access to Login page
};