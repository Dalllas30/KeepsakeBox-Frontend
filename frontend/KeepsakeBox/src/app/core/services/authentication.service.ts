/**
 * @author André Santana - fc49451
 *
 * Unified authentication service.
 *
 * LOGIN / LOGOUT
 * --------------
 * Delegates entirely to Keycloak (OIDC Authorization Code + PKCE S256).
 * login() redirects the browser to the Keycloak login page.
 * logout() invalidates the session and redirects back to the app root.
 *
 * IDENTITY
 * --------
 * After a successful Keycloak login, resolveCurrentUser() calls GET /users/me
 * to load the user's profile and role, then hydrates the token cache and the
 * matching service (CaregiverService or IndependentUserService) so all
 * existing call sites keep working without modification.
 *
 * BACKWARD COMPATIBILITY
 * ----------------------
 * All public methods that existed before (getCurrentCaregiverToken, isLoggedIn,
 * setCurrentUserRole, hasRole, validateEmail, register, registerIndependent)
 * are preserved with the same signatures.
 *
 * REGISTRATION
 * ------------
 * register() and registerIndependent() now delegate to UserBackendService
 * which POSTs multipart/form-data to the Users Service.
 * email-validation falls back to the Users Service /users/me probe approach
 * once the backend exposes a dedicated endpoint; for now it keeps the old
 * json-server check so the register flow is not broken mid-migration.
 */

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CaregiverRegisterData } from '../models/caregiver-register-data.model';
import { IndependentUserRegisterData } from '../models/independent-user-register-data.model';
import { LoginData } from '../models/login-data.model';
import { UserRole, USER_ROLES } from '../models/user-role.model';
import { CaregiverService } from './caregiver.service';
import { IndependentUserService } from './independent-user.service';
import { KeycloakService } from './keycloak.service';
import { UserBackendService } from './user-backend.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // --------------------------------------------------------------------------
  // In-memory cache (token + role)
  // --------------------------------------------------------------------------

  /** Stores the raw Keycloak access token (or null when logged out). */
  private currentCaregiverToken: BehaviorSubject<string | null>;

  /** Role of the currently authenticated user. */
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
  // Token + role cache (public API — backward compatible)
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

  getCurrentCaregiverToken(): string | null {
    // Always prefer the live Keycloak token when available
    const liveToken = this.keycloakService.getRawToken();
    return liveToken ?? this.currentCaregiverToken.value;
  }

  isLoggedIn(): boolean {
    return this.keycloakService.isAuthenticated() || this.getCurrentCaregiverToken() != null;
  }

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
  // Post-login identity resolution
  // --------------------------------------------------------------------------

  /**
   * Call this after Keycloak redirects back to the app.
   * Fetches GET /users/me, caches the token and role, and hydrates
   * the matching service (CaregiverService or IndependentUserService).
   *
   * Returns the resolved UserRole on success, null on failure.
   */
  async resolveCurrentUser(): Promise<UserRole | null> {
    if (!this.keycloakService.isAuthenticated()) {
      return null;
    }

    try {
      const me = await firstValueFrom(this.userBackendService.getMe());

      // Store token
      const token = this.keycloakService.getRawToken() ?? '';
      this.setCurrentCaregiverToken(token);

      // Determine role from Keycloak realm roles
      const roles = me.roles ?? this.keycloakService.getRoles();
      const isCaregiver = roles.includes('caregiver');
      const isIndependent = roles.includes('independent');

      if (isCaregiver) {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentCaregiverId', me.user_id);
        }
        // Hydrate CaregiverService with a shape compatible with Caregiver model
        this.caregiverService.setCurrentCaregiver({
          id: me.user_id,
          name: me.name,
          email: me.email,
          phone: me.phone ?? '',
          birthDate: me.birth_date ? new Date(me.birth_date) : new Date(''),
          profileImageURL: me.profile_picture_url ?? '/assets/profileimage-default.png',
          type: me.caregiver_type ?? '',
          speciality: me.speciality ?? '',
          isActive: true,
        });
        this.setCurrentUserRole(USER_ROLES.CAREGIVER);
        return USER_ROLES.CAREGIVER;
      }

      if (isIndependent) {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentIndependentUserId', me.user_id);
        }
        this.independentUserService.setCurrentIndependentUser({
          id: me.user_id,
          name: me.name,
          email: me.email,
          phone: me.phone ?? '',
          birthDate: me.birth_date ? new Date(me.birth_date) : new Date(''),
          profileImageURL: me.profile_picture_url ?? '/assets/profileimage-default.png',
          isActive: true,
        });
        this.setCurrentUserRole(USER_ROLES.INDEPENDENT);
        return USER_ROLES.INDEPENDENT;
      }

      console.warn('[AuthService] User has no recognised realm role:', roles);
      return null;
    } catch (err) {
      console.error('[AuthService] resolveCurrentUser error:', err);
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // Login — now delegates to Keycloak
  // --------------------------------------------------------------------------

  /**
   * Initiate a Keycloak login flow (browser redirect).
   *
   * For backward compatibility, this method still accepts LoginData, but the
   * credentials are NOT sent anywhere — Keycloak handles authentication.
   * The parameter is ignored; call login() without arguments if preferred.
   *
   * Returns null immediately (the real result arrives via resolveCurrentUser()
   * after the Keycloak redirect).
   */
  async login(_loginData?: LoginData): Promise<UserRole | null> {
    this.keycloakService.login();
    return null;
  }

  // --------------------------------------------------------------------------
  // Email validation
  // --------------------------------------------------------------------------

  /**
   * Checks whether an email address is free to register.
   * Still queries json-server during the migration period while the Users
   * Service does not expose a dedicated /users/check-email endpoint.
   *
   * TODO: replace with a call to the Users Service once available.
   */
  async validateEmail(email: string): Promise<boolean> {
    try {
      const [caregivers, independents] = await Promise.all([
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/caregivers?email=${email}`)).catch(() => []),
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/independents?email=${email}`)).catch(() => []),
      ]);
      return (caregivers?.length ?? 0) === 0 && (independents?.length ?? 0) === 0;
    } catch {
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Register caregiver
  // --------------------------------------------------------------------------

  /**
   * Register a new caregiver via the Users Service (multipart/form-data).
   * Optionally pass a profile picture File.
   */
  async register(
    caregiver: CaregiverRegisterData,
    profilePicture?: File | null
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.userBackendService.registerCaregiver(
          {
            email: caregiver.email,
            password: caregiver.password,
            name: caregiver.name,
            phone: caregiver.phone,
            birth_date: caregiver.birthDate instanceof Date
              ? caregiver.birthDate.toISOString().split('T')[0]
              : caregiver.birthDate,
            caregiver_type: caregiver.type as any,
            speciality: caregiver.speciality,
          },
          profilePicture
        )
      );
      return true;
    } catch (err) {
      console.error('[AuthService] register caregiver error:', err);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Register independent user
  // --------------------------------------------------------------------------

  /**
   * Register a new independent user via the Users Service (multipart/form-data).
   */
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
            phone: data.phone,
            birth_date: data.birthDate instanceof Date
              ? data.birthDate.toISOString().split('T')[0]
              : (data.birthDate as any),
            primary_caregiver_id: data.primaryCaregiverId,
          },
          profilePicture
        )
      );
      return true;
    } catch (err) {
      console.error('[AuthService] register independent error:', err);
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

    // Redirect to Keycloak logout (ends the SSO session)
    this.keycloakService.logout();
  }

  // --------------------------------------------------------------------------
  // Normalisation helper (kept for any internal use)
  // --------------------------------------------------------------------------

  private normalizeCaregiver(caregiver: any): any {
    return {
      ...caregiver,
      profileImageURL: caregiver.profileImageURL ?? caregiver.profileImage ?? '/assets/profileimage-default.png',
      type: caregiver.type ?? caregiver.caregiverType ?? '',
      isActive: caregiver.isActive ?? true,
    };
  }
}
