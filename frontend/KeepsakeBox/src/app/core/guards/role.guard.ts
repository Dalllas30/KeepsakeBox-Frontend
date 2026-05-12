/**
 * Role-aware route guard.
 *
 * Usage on a route definition:
 *   { path: 'caregiver', canActivate: [roleGuard], data: { roles: ['caregiver'] }, ... }
 *
 * Behavior:
 *  - If the user is not logged in, redirect to /login.
 *  - If the route declares `data.roles` and the current role isn't in the
 *    list, redirect the user to their own home (so a caregiver hitting
 *    /independent lands on /caregiver/persons, and vice versa).
 *  - If `data.roles` is absent, fall back to plain authentication check.
 *
 * Post-Keycloak this guard stays the same; only the source of the role
 * changes (it'll come from the token claims via AuthenticationService).
 */

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserRole } from '../models/user-role.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const allowed = (route.data?.['roles'] as UserRole[] | undefined) ?? [];
  if (allowed.length === 0) {
    return true;
  }

  const role = auth.getCurrentUserRole();
  if (role && allowed.includes(role)) {
    return true;
  }

  // Logged in but wrong role — send them to their own home.
  const fallback = role === 'independent' ? '/independent' : '/caregiver/persons';
  return router.createUrlTree([fallback]);
};
