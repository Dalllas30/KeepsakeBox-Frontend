import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

export const authGuard = () => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.navigate(['/login']);
};