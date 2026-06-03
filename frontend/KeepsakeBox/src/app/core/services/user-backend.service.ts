/**
 * Angular service wrapping the Users Service (FastAPI, port 8000).
 *
 * Endpoints
 * ---------
 *   POST /users/onboarding/caregiver    JSON, authenticated (201 / 409 if already onboarded)
 *   POST /users/onboarding/independent  JSON, authenticated (201 / 409 if already onboarded)
 *   GET  /users/me                      returns the current authenticated user
 *
 * Account creation itself happens on Keycloak's register page; these endpoints
 * only create the local profile row after the user has a Keycloak token.
 * The Bearer token is attached automatically by auth.interceptor.ts.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OnboardingCaregiverRequest,
  OnboardingCaregiverResponse,
  OnboardingIndependentRequest,
  OnboardingIndependentResponse,
  MeResponse,
} from '../models/api/user-api.models';

@Injectable({
  providedIn: 'root'
})
export class UserBackendService {

  private readonly base = environment.usersServiceUrl;

  constructor(private http: HttpClient) {}

  // --------------------------------------------------------------------------
  // Onboarding
  // --------------------------------------------------------------------------

  /**
   * Create the local caregiver profile after Keycloak self-registration.
   * Authenticated; returns 409 if the user was already onboarded.
   */
  onboardingCaregiver(
    body: OnboardingCaregiverRequest
  ): Observable<OnboardingCaregiverResponse> {
    return this.http.post<OnboardingCaregiverResponse>(
      `${this.base}/users/onboarding/caregiver`,
      body
    );
  }

  /**
   * Create the local independent-user profile after Keycloak self-registration.
   * Authenticated; returns 409 if the user was already onboarded.
   */
  onboardingIndependent(
    body: OnboardingIndependentRequest
  ): Observable<OnboardingIndependentResponse> {
    return this.http.post<OnboardingIndependentResponse>(
      `${this.base}/users/onboarding/independent`,
      body
    );
  }

  // --------------------------------------------------------------------------
  // Current user
  // --------------------------------------------------------------------------

  /**
   * Fetch the currently authenticated user's profile from the backend.
   * Requires a valid Bearer token (set by auth.interceptor.ts).
   * Returns 404 "No local profile found" when the user has not onboarded yet.
   */
  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.base}/users/me`);
  }
}
