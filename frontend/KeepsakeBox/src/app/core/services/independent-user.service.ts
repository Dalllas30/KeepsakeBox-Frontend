/**
 * IndependentUserService — CRUD + cache for the independent-user entity.
 *
 * Mirrors the shape of CaregiverService (BehaviorSubject-backed cache,
 * localStorage rehydration, normalize() helper) so the rest of the app
 * has a consistent integration surface.
 *
 * Notes:
 *  - Endpoints currently hit json-server collections `independents` and
 *    `independentCaregivers`. The same paths will work once the real
 *    backend is in place; only the host changes (environment.apiUrl).
 *  - This service intentionally stays minimal until the games requirements
 *    validation is done. Additional fields / endpoints (statistics, game
 *    history, etc.) should be added incrementally in a separate service
 *    or here as the schema firms up.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { IndependentUser } from '../models/independent-user.model';
import { IndependentUserRegisterData } from '../models/independent-user-register-data.model';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class IndependentUserService {

  private currentIndependentUser: BehaviorSubject<IndependentUser | null>;

  constructor(private http: HttpClient) {
    this.currentIndependentUser = new BehaviorSubject<IndependentUser | null>(
      JSON.parse(localStorage.getItem('currentIndependentUser') || 'null')
    );
  }

  // ------------------------------------------------------------------------
  // Cache accessors
  // ------------------------------------------------------------------------

  setCurrentIndependentUser(user: IndependentUser): void {
    localStorage.setItem('currentIndependentUser', JSON.stringify(user));
    this.currentIndependentUser.next(user);
  }

  resetCurrentIndependentUser(): void {
    localStorage.removeItem('currentIndependentUser');
    this.currentIndependentUser.next(null);
  }

  getCurrentIndependentUser(): IndependentUser | null {
    return this.currentIndependentUser.value;
  }

  getCurrentIndependentUser$(): Observable<IndependentUser | null> {
    return this.currentIndependentUser.asObservable();
  }

  // ------------------------------------------------------------------------
  // Normalization
  // ------------------------------------------------------------------------

  private normalize(user: any): IndependentUser {
    return {
      ...user,
      profileImageURL:
        user.profileImageURL ?? user.profileImage ?? '/assets/profileimage-default.png',
      isActive: user.isActive ?? true,
    } as IndependentUser;
  }

  // ------------------------------------------------------------------------
  // Queries
  // ------------------------------------------------------------------------

  /** Fetch an independent user by current session token (json-server compatible). */
  async getByToken(token: string): Promise<IndependentUser | null> {
    const users = await firstValueFrom(
      this.http.get<any[]>(`${apiUrl}/independents?token=${token}`)
    ).catch(() => null);
    return users && users[0] ? this.normalize(users[0]) : null;
  }

  /** Fetch by primary key. */
  async getById(id: string): Promise<IndependentUser | null> {
    const user = await firstValueFrom(
      this.http.get<any>(`${apiUrl}/independents/${id}`)
    ).catch(() => null);
    return user ? this.normalize(user) : null;
  }

  // ------------------------------------------------------------------------
  // Mutations
  // ------------------------------------------------------------------------

  /**
   * Register a new independent user.
   * Returns the persisted record (with backend-generated id) on success, null on failure.
   */
  async register(data: IndependentUserRegisterData): Promise<IndependentUser | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${apiUrl}/independents`, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          birthDate: data.birthDate,
          profileImage: data.profileImageURL,
          profileImageURL: data.profileImageURL,
          primaryCaregiverId: data.primaryCaregiverId ?? null,
          token: 'temp-token-' + Date.now(),
          isActive: true,
        })
      );
      return response ? this.normalize(response) : null;
    } catch (error) {
      console.error('Independent user registration error:', error);
      return null;
    }
  }

  /** Update an independent user (PATCH-style to avoid clobbering server-only fields). */
  async update(id: string, partial: Partial<IndependentUser>): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.patch(`${apiUrl}/independents/${id}`, partial)
      );
      return true;
    } catch {
      return false;
    }
  }

  // ------------------------------------------------------------------------
  // Caregiver linkage
  // ------------------------------------------------------------------------

  /**
   * Associate this independent user with a caregiver. Backed by a join
   * collection `independentCaregivers` so multiple caregivers can be linked,
   * mirroring how `patientCaregivers` works.
   */
  async linkCaregiver(independentUserId: string, caregiverId: string, isPrimary = false): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.post(`${apiUrl}/independentCaregivers`, {
          independentUserId,
          caregiverId,
          isPrimary,
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  /** List caregivers linked to this independent user (resolves caregiver records). */
  async listLinkedCaregivers(independentUserId: string): Promise<any[]> {
    try {
      const links = await firstValueFrom(
        this.http.get<any[]>(`${apiUrl}/independentCaregivers?independentUserId=${independentUserId}`)
      ) ?? [];
      const caregiverIds = [...new Set(links.map(l => l.caregiverId?.toString()).filter(Boolean))];
      const caregivers = await Promise.all(
        caregiverIds.map(id =>
          firstValueFrom(this.http.get<any>(`${apiUrl}/caregivers/${id}`)).catch(() => null)
        )
      );
      return caregivers.filter(Boolean);
    } catch {
      return [];
    }
  }
}