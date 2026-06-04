/**
 * Attaches the `X-Caregiver-ID` header to every request directed at the
 * Session Management Service.
 *
 * The value is the caregiver's `user_id` returned by GET /users/me and stored
 * in localStorage under `currentCaregiverId` by AuthenticationService.
 *
 * Requests to any other origin are passed through unchanged.
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';

export const caregiverIdInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  if (!req.url.startsWith(environment.sessionServiceUrl)) {
    return next(req);
  }

  const caregiverId = localStorage.getItem('currentCaregiverId');
  if (!caregiverId) {
    return next(req);
  }

  return next(req.clone({
    headers: req.headers.set('X-Caregiver-ID', caregiverId)
  }));
};
