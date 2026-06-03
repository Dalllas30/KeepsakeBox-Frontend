// Only lets a logged-in, not-yet-onboarded user onto /onboarding. roleGuard
// handles the inverse (sending such users here from the protected app).

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const onboardingGuard: CanActivateFn = () => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!auth.getNeedsOnboarding()) {
    return router.createUrlTree(['/caregiver/persons']);
  }

  return true;
};
