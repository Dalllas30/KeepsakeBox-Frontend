/**
 * Attaches the Keycloak Bearer token to every request that targets one of the
 * real backend services (Users, Content, Session Management).
 *
 * Requests to json-server (legacy) or other origins are passed through
 * unchanged so the existing code keeps working without modification.
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { KeycloakService } from '../services/keycloak.service';
import { environment } from '../../../environments/environment';

const BACKEND_ORIGINS = [
  environment.usersServiceUrl,
  environment.contentServiceUrl,
  environment.sessionServiceUrl,
];

/** Public registration endpoints — no Authorization header needed (or wanted). */
const PUBLIC_PATHS = [
  '/users/register/caregiver',
  '/users/register/independent',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Only attach tokens on the browser side and for our own backend services
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const isBackendRequest = BACKEND_ORIGINS.some(origin => req.url.startsWith(origin));
  if (!isBackendRequest) {
    return next(req);
  }

  // Skip public endpoints — adding a token causes a CORS preflight that
  // would fail for unauthenticated users hitting the registration endpoints.
  const isPublic = PUBLIC_PATHS.some(path => req.url.includes(path));
  if (isPublic) {
    return next(req);
  }

  const keycloak = inject(KeycloakService);

  return from(keycloak.getToken()).pipe(
    switchMap(token => {
      const cloned = token
        ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
        : req;
      return next(cloned);
    })
  );
};