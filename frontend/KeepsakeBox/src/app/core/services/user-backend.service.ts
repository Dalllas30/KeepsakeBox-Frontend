/**
 * Angular service wrapping the Users Service (FastAPI, port 8000).
 *
 * Endpoints
 * ---------
 *   POST /users/register/caregiver   — multipart/form-data
 *   POST /users/register/independent — multipart/form-data
 *   GET  /users/me                   — returns the current authenticated user
 *
 * Registration shape
 * ------------------
 * Both registration endpoints accept multipart/form-data with:
 *   - `data`            : JSON string of the user fields
 *   - `profile_picture` : optional image File / Blob
 *
 * The Bearer token is attached automatically by auth.interceptor.ts.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RegisterCaregiverData,
  RegisterCaregiverResponse,
  RegisterIndependentData,
  RegisterIndependentResponse,
  MeResponse,
} from '../models/api/user-api.models';

@Injectable({
  providedIn: 'root'
})
export class UserBackendService {

  private readonly base = environment.usersServiceUrl;

  constructor(private http: HttpClient) {}

  // --------------------------------------------------------------------------
  // Registration helpers
  // --------------------------------------------------------------------------

  /**
   * Builds a FormData payload used by both register endpoints.
   * @param data   The user-specific fields, serialised to JSON.
   * @param file   Optional profile picture file.
   */
  private buildFormData(data: object, file?: File | null): FormData {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    if (file) {
      form.append('profile_picture', file, file.name);
    }
    return form;
  }

  // --------------------------------------------------------------------------
  // Register caregiver
  // --------------------------------------------------------------------------

  /**
   * Register a new caregiver account.
   *
   * @param data            Caregiver fields (email, password, name, …).
   * @param profilePicture  Optional profile photo.
   */
  registerCaregiver(
    data: RegisterCaregiverData,
    profilePicture?: File | null
  ): Observable<RegisterCaregiverResponse> {
    const form = this.buildFormData(data, profilePicture);
    return this.http.post<RegisterCaregiverResponse>(
      `${this.base}/users/register/caregiver`,
      form
    );
  }

  // --------------------------------------------------------------------------
  // Register independent user
  // --------------------------------------------------------------------------

  /**
   * Register a new independent user account.
   *
   * @param data            Independent user fields (email, password, name, …).
   * @param profilePicture  Optional profile photo.
   */
  registerIndependent(
    data: RegisterIndependentData,
    profilePicture?: File | null
  ): Observable<RegisterIndependentResponse> {
    const form = this.buildFormData(data, profilePicture);
    return this.http.post<RegisterIndependentResponse>(
      `${this.base}/users/register/independent`,
      form
    );
  }

  // --------------------------------------------------------------------------
  // Current user
  // --------------------------------------------------------------------------

  /**
   * Fetch the currently authenticated user's profile from the backend.
   * Requires a valid Bearer token (set by auth.interceptor.ts).
   */
  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.base}/users/me`);
  }
}
