// auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';


export const authGuard = () => {
 
  const router = inject(Router);

  if (localStorage.getItem('token')) {
    return true; // Allow access
  }

  // Not logged in, redirect to Login
  router.navigate(['/login']);
  return false;
};