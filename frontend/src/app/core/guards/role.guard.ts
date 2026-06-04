/**
 * Role-aware route guard.
 *
 * Rules:
 *  - Not logged in at all → redirect to /login.
 *  - Logged in but role not resolved yet (backend was unavailable) → allow.
 *    Both roles share the /caregiver UI tree; blocking here would cause an
 *    infinite redirect loop since both roles land on /caregiver/persons.
 *  - Logged in with a role that IS in the allowed list → allow.
 *  - Logged in with a role NOT in the allowed list → send to /caregiver/persons.
 *    (This case is currently unreachable since all routes allow both roles.)
 */

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserRole } from '../models/user-role.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth   = inject(AuthenticationService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // Authenticated but no local profile yet, needs finish onboarding first.
  if (auth.getNeedsOnboarding()) {
    return router.createUrlTree(['/onboarding']);
  }

  const allowed = (route.data?.['roles'] as UserRole[] | undefined) ?? [];

  // No role restriction on this route — just needs authentication.
  if (allowed.length === 0) {
    return true;
  }

  const role = auth.getCurrentUserRole();

  // Role not resolved yet (e.g. backend timed out during init).
  // Allow access rather than bouncing the user in an infinite loop.
  // The UI will default to caregiver behaviour until a refresh resolves the role.
  if (!role) {
    return true;
  }

  if (allowed.includes(role)) {
    return true;
  }

  // Role is known but not in the allowed list — send home.
  return router.createUrlTree(['/caregiver/persons']);
};





























// /**
//  * Role-aware route guard.
//  *
//  * Usage on a route definition:
//  *   { path: 'caregiver', canActivate: [roleGuard], data: { roles: ['caregiver'] }, ... }
//  *
//  * Behavior:
//  *  - If the user is not logged in, redirect to /login.
//  *  - If the route declares `data.roles` and the current role isn't in the
//  *    list, redirect the user to their own home (so a caregiver hitting
//  *    /independent lands on /caregiver/persons, and vice versa).
//  *  - If `data.roles` is absent, fall back to plain authentication check.
//  *
//  * Post-Keycloak this guard stays the same; only the source of the role
//  * changes (it'll come from the token claims via AuthenticationService).
//  */

// import { inject } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
// import { AuthenticationService } from '../services/authentication.service';
// import { UserRole } from '../models/user-role.model';

// export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
//   const auth = inject(AuthenticationService);
//   const router = inject(Router);

//   if (!auth.isLoggedIn()) {
//     return router.createUrlTree(['/login']);
//   }

//   const allowed = (route.data?.['roles'] as UserRole[] | undefined) ?? [];
//   if (allowed.length === 0) {
//     return true;
//   }

//   const role = auth.getCurrentUserRole();
//   if (role && allowed.includes(role)) {
//     return true;
//   }

//   if (role === 'independent') {
//     return router.createUrlTree(['/caregiver/independent']);
//   }

//   return router.createUrlTree(['/caregiver/persons']);
// };