/**
 * @author André Santana - fc49451
 *
 * Unified authentication service — Keycloak edition.
 *
 * LOGIN / LOGOUT
 * --------------
 * Delegates to Keycloak (OIDC Authorization Code + PKCE S256).
 * login() triggers a browser redirect to the Keycloak login page.
 * logout() ends the Keycloak session and redirects back to the app root.
 *
 * IDENTITY RESOLUTION
 * -------------------
 * After Keycloak redirects back, APP_INITIALIZER calls resolveCurrentUser().
 * It tries GET /users/me (5 s timeout). If the Users Service is unavailable it
 * falls back to the JWT claims already present in the Keycloak token — so the
 * app always finishes loading even when the backend is down.
 *
 * Both roles (caregiver and independent) land on the same /caregiver UI.
 * Components that are caregiver-only gate themselves with @if (isCaregiver()).
 *
 * REGISTRATION
 * ------------
 * register() / registerIndependent() POST to the Users Service with a 15 s
 * timeout. On success they call login() to start the Keycloak OIDC flow.
 *
 * EMAIL VALIDATION
 * ----------------
 * Still queries json-server during the migration period.
 * TODO: replace once the Users Service exposes a check-email endpoint.
 */

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { CaregiverRegisterData } from '../models/caregiver-register-data.model';
import { IndependentUserRegisterData } from '../models/independent-user-register-data.model';
import { LoginData } from '../models/login-data.model';
import { UserRole, USER_ROLES } from '../models/user-role.model';
import { mapCaregiverType } from '../models/api/user-api.models';
import { CaregiverService } from './caregiver.service';
import { IndependentUserService } from './independent-user.service';
import { KeycloakService } from './keycloak.service';
import { UserBackendService } from './user-backend.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentCaregiverToken: BehaviorSubject<string | null>;
  private currentUserRole: BehaviorSubject<UserRole | null>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private caregiverService: CaregiverService,
    private independentUserService: IndependentUserService,
    private keycloakService: KeycloakService,
    private userBackendService: UserBackendService,
  ) {
    const storedToken = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('currentCaregiverToken')
      : null;
    const storedRole = isPlatformBrowser(this.platformId)
      ? (localStorage.getItem('currentUserRole') as UserRole | null)
      : null;

    this.currentCaregiverToken = new BehaviorSubject<string | null>(storedToken);
    this.currentUserRole = new BehaviorSubject<UserRole | null>(storedRole);
  }

  // --------------------------------------------------------------------------
  // Token helpers
  // --------------------------------------------------------------------------

  setCurrentCaregiverToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentCaregiverToken', token);
    }
    this.currentCaregiverToken.next(token);
  }

  resetCurrentCaregiverToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentCaregiverToken');
    }
    this.currentCaregiverToken.next(null);
  }

  /** Returns the live Keycloak token when present, falls back to localStorage. */
  getCurrentCaregiverToken(): string | null {
    return this.keycloakService.getRawToken() ?? this.currentCaregiverToken.value;
  }

  isLoggedIn(): boolean {
    return this.keycloakService.isAuthenticated() || this.getCurrentCaregiverToken() != null;
  }

  // --------------------------------------------------------------------------
  // Role helpers
  // --------------------------------------------------------------------------

  setCurrentUserRole(role: UserRole): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUserRole', role);
    }
    this.currentUserRole.next(role);
  }

  resetCurrentUserRole(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUserRole');
    }
    this.currentUserRole.next(null);
  }

  getCurrentUserRole(): UserRole | null {
    return this.currentUserRole.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserRole.value === role;
  }

  // --------------------------------------------------------------------------
  // Post-login identity resolution  (called by APP_INITIALIZER)
  // --------------------------------------------------------------------------

  /**
   * Called after keycloak.init() returns true.
   *
   * Strategy:
   *  1. Store the raw Keycloak token so legacy call-sites work immediately.
   *  2. Try GET /users/me (5 s timeout) to get the full profile + backend roles.
   *  3. If the Users Service is unavailable, fall back to JWT token claims so
   *     the app still loads and the user can navigate.
   *  4. Hydrate CaregiverService (shared by both roles) and, for independents,
   *     IndependentUserService as well.
   */
  async resolveCurrentUser(): Promise<UserRole | null> {
    if (!this.keycloakService.isAuthenticated()) {
      return null;
    }

    // Always cache the live token first so isLoggedIn() and getCurrentCaregiverToken()
    // return something meaningful even before the backend call finishes.
    const rawToken = this.keycloakService.getRawToken() ?? '';
    this.setCurrentCaregiverToken(rawToken);

    // --- 1. Try the Users Service (with timeout) ---
    let me: any = null;
    try {
      me = await firstValueFrom(
        this.userBackendService.getMe().pipe(timeout(5000))
      );
    } catch (err) {
      if (err instanceof TimeoutError) {
        console.warn('[AuthService] GET /users/me timed out — using JWT claims as fallback');
      } else {
        console.warn('[AuthService] GET /users/me failed — using JWT claims as fallback', err);
      }
    }

    // --- 2. Determine role ---
    // MeResponse does not carry roles — always read from Keycloak JWT realm_access.roles.
    // Roles assigned by the Users Service on registration:
    //   caregiver  → 'informal_caregiver' | 'formal_caregiver'
    //   independent → 'independent_user'
    const jwtRoles: string[] = this.keycloakService.getRoles();
    const isCaregiverRole = jwtRoles.some(r =>
      r === 'informal_caregiver' || r === 'formal_caregiver' || r === 'caregiver'
    );
    const isIndependentRole = jwtRoles.some(r =>
      r === 'independent_user' || r === 'independent'
    );
    const isIndependent = isIndependentRole && !isCaregiverRole;
    const resolvedRole: UserRole = isIndependent ? USER_ROLES.INDEPENDENT : USER_ROLES.CAREGIVER;

    // --- 3. Build profile ---
    // MeResponse only has user_id/older_adult_id/cared_for_pwd_ids.
    // All profile fields come from JWT claims.
    const parsed = this.keycloakService.getTokenParsed() ?? {};
    const userId       = me?.user_id?.toString() ?? parsed['sub'] ?? '';
    const name         = parsed['name']           ?? parsed['preferred_username'] ?? 'User';
    const email        = parsed['email']          ?? '';
    const phone        = '';
    const birthDate    = null;
    const profileImage = '/assets/profileimage-default.png';
    const caregiverType = '';
    const speciality   = '';

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentCaregiverId', userId);
      if (isIndependent) {
        localStorage.setItem('currentIndependentUserId', userId);
      }
    }

    // --- 4. Hydrate CaregiverService (both roles use it) ---
    this.caregiverService.setCurrentCaregiver({
      id: userId, name, email, phone,
      birthDate,
      profileImageURL: profileImage,
      type: caregiverType,
      speciality,
      isActive: true,
    } as any);

    if (isIndependent) {
      this.independentUserService.setCurrentIndependentUser({
        id: userId, name, email, phone,
        birthDate,
        profileImageURL: profileImage,
        isActive: true,
      } as any);
    }

    this.setCurrentUserRole(resolvedRole);
    return resolvedRole;
  }

  // --------------------------------------------------------------------------
  // Login
  // --------------------------------------------------------------------------

  /**
   * Triggers the Keycloak login redirect.
   * loginData is accepted for backward compatibility but is not sent anywhere.
   * After the redirect back, APP_INITIALIZER calls resolveCurrentUser() and
   * the login component's ngOnInit routes the user to /caregiver/persons.
   */
  async login(_loginData?: LoginData): Promise<UserRole | null> {
    this.keycloakService.login();
    return null;
  }

  // --------------------------------------------------------------------------
  // Email validation
  // --------------------------------------------------------------------------

  async validateEmail(_email: string): Promise<boolean> {
    // TODO: replace with a real duplicate-check endpoint on the Users Service
    // once it is implemented.  For now we always return true so that
    // step-1 validation does not fire json-server queries that break the
    // registration flow when json-server isn't running.
    return true;
  }

  // --------------------------------------------------------------------------
  // Register caregiver
  // --------------------------------------------------------------------------

  async register(
    caregiver: CaregiverRegisterData,
    profilePicture?: File | null
  ): Promise<boolean> {
    try {
      const { caregiver_type_code, role } = mapCaregiverType(caregiver.type ?? 'Informal');
      await firstValueFrom(
        this.userBackendService.registerCaregiver(
          {
            email: caregiver.email,
            password: caregiver.password,
            name: caregiver.name,
            role,
            phone_number: caregiver.phone || undefined,
            birth_date: caregiver.birthDate instanceof Date
              ? caregiver.birthDate.toISOString().split('T')[0]
              : (caregiver.birthDate as any) || undefined,
            caregiver_type_code,
          },
          profilePicture
        ).pipe(timeout(15000))
      );
      return true;
    } catch (err: any) {
      console.error('[AuthService] register caregiver error:', err);
      if (err?.error) {
        console.error('[AuthService] response body:', err.error);
      }
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Register independent user
  // --------------------------------------------------------------------------

  async registerIndependent(
    data: IndependentUserRegisterData,
    profilePicture?: File | null
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.userBackendService.registerIndependent(
          {
            email: data.email,
            password: data.password,
            name: data.name,
            phone_number: data.phone || undefined,
            birth_date: data.birthDate instanceof Date
              ? data.birthDate.toISOString().split('T')[0]
              : (data.birthDate as any) || undefined,
          },
          profilePicture
        ).pipe(timeout(15000))
      );
      return true;
    } catch (err: any) {
      console.error('[AuthService] register independent error:', err);
      if (err?.error) {
        console.error('[AuthService] response body:', err.error);
      }
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Logout
  // --------------------------------------------------------------------------

  async logout(): Promise<void> {
    this.resetCurrentCaregiverToken();
    this.resetCurrentUserRole();

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentCaregiverId');
      localStorage.removeItem('currentCaregiver');
      localStorage.removeItem('currentIndependentUserId');
      localStorage.removeItem('currentIndependentUser');
    }

    this.caregiverService.resetCurrentCaregiver();
    this.independentUserService.resetCurrentIndependentUser();

    this.keycloakService.logout();
  }
}
