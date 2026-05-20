/**
 * @author André Santana - fc49451
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CaregiverRegisterData } from '../models/caregiver-register-data.model';
import { IndependentUserRegisterData } from '../models/independent-user-register-data.model';
import { LoginData } from '../models/login-data.model';
import { UserRole, USER_ROLES } from '../models/user-role.model';
import { CaregiverService } from './caregiver.service';
import { IndependentUserService } from './independent-user.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //Class Constructor
  constructor(
    private http: HttpClient,
    private caregiverService: CaregiverService,
    private independentUserService: IndependentUserService
  ) {
    //Stores the current session token on cache
    this.currentCaregiverToken =
      new BehaviorSubject<string | null>(localStorage.getItem('currentCaregiverToken'));
    this.currentUserRole =
      new BehaviorSubject<UserRole | null>(
        (localStorage.getItem('currentUserRole') as UserRole | null) ?? null
      );
  }

  //Cache variable for the current session token (caregiver or independent user)
  private currentCaregiverToken: BehaviorSubject<string | null>;

  //Cache variable for the role of the currently logged-in user
  private currentUserRole: BehaviorSubject<UserRole | null>;

  // ------------------------------------------------------------------------
  // Token + role cache
  // ------------------------------------------------------------------------

  /**
   * Sets the current session token on cache.
   * Name kept as `currentCaregiverToken` for backward compatibility with
   * existing call sites; it stores the token regardless of role.
   */
  setCurrentCaregiverToken(token: string): void {
    localStorage.setItem('currentCaregiverToken', token);
    this.currentCaregiverToken.next(token);
  }

  resetCurrentCaregiverToken(): void {
    localStorage.removeItem('currentCaregiverToken');
    this.currentCaregiverToken.next(null);
  }

  getCurrentCaregiverToken(): string | null {
    return this.currentCaregiverToken.value;
  }

  isLoggedIn(): boolean {
    return this.getCurrentCaregiverToken() != null;
  }

  setCurrentUserRole(role: UserRole): void {
    localStorage.setItem('currentUserRole', role);
    this.currentUserRole.next(role);
  }

  resetCurrentUserRole(): void {
    localStorage.removeItem('currentUserRole');
    this.currentUserRole.next(null);
  }

  getCurrentUserRole(): UserRole | null {
    return this.currentUserRole.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserRole.value === role;
  }

  // ------------------------------------------------------------------------
  // Normalization
  // ------------------------------------------------------------------------

  private normalizeCaregiver(caregiver: any): any {
    return {
      ...caregiver,
      profileImageURL: caregiver.profileImageURL ?? caregiver.profileImage ?? '/assets/profileimage-default.png',
      type: caregiver.type ?? caregiver.caregiverType ?? '',
      isActive: caregiver.isActive ?? true
    };
  }

  // ------------------------------------------------------------------------
  // Email validation
  // ------------------------------------------------------------------------

  /**
   * Checks whether an email is free to register, across BOTH caregivers and
   * independent users — emails must be globally unique to support the unified
   * login flow (which doesn't know the role up front).
   */
  async validateEmail(email: string): Promise<boolean> {
    try {
      const [caregivers, independents] = await Promise.all([
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/caregivers?email=${email}`)).catch(() => []),
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/independents?email=${email}`)).catch(() => []),
      ]);
      return (caregivers?.length ?? 0) === 0 && (independents?.length ?? 0) === 0;
    } catch (error) {
      console.error('Email validation error:', error);
      return false;
    }
  }

  // ------------------------------------------------------------------------
  // Register
  // ------------------------------------------------------------------------

  /**
   * Register a new caregiver. Kept as-is for backward compatibility.
   */
  async register(caregiver: CaregiverRegisterData): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${environment.apiUrl}/caregivers`, {
          name: caregiver.name,
          email: caregiver.email,
          phone: caregiver.phone,
          password: caregiver.password,
          birthDate: caregiver.birthDate,
          profileImage: caregiver.profileImageURL,
          profileImageURL: caregiver.profileImageURL,
          caregiverType: caregiver.type,
          speciality: caregiver.speciality,
          token: 'temp-token-' + Date.now(),
          isActive: true
        })
      );
      console.log('Caregiver registration successful:', response);
      return true;
    } catch (error) {
      console.error('Caregiver registration error:', error);
      return false;
    }
  }

  /**
   * Register a new independent user. Delegates to IndependentUserService so
   * the persistence shape stays in one place.
   */
  async registerIndependent(data: IndependentUserRegisterData): Promise<boolean> {
    const user = await this.independentUserService.register(data);
    return user != null;
  }

  // ------------------------------------------------------------------------
  // Login (unified — auto-detects role)
  // ------------------------------------------------------------------------

  /**
   * Unified login: try the caregivers collection first, then independents.
   * Returns the resolved role on success, or null on failure.
   *
   * Side effects on success:
   *  - persists the session token
   *  - persists the user role
   *  - hydrates the matching service's "current user" cache
   *
   * Backward compatibility: existing call sites that treat the return as a
   * boolean still work — a non-null result is truthy.
   *
   * Post-Keycloak this becomes a single OIDC exchange whose token already
   * carries the realm role; this method then reads the role from the token
   * instead of probing two collections.
   */
  async login(loginData: LoginData): Promise<UserRole | null> {
    try {
      // 1) Try caregiver
      const caregivers = await firstValueFrom(
        this.http.get<any[]>(
          `${environment.apiUrl}/caregivers?email=${loginData.email}&password=${loginData.password}`
        )
      ).catch(() => [] as any[]);

      if (caregivers && caregivers.length > 0) {
        const caregiver = this.normalizeCaregiver(caregivers[0]);
        this.setCurrentCaregiverToken(caregiver.token);
        localStorage.setItem('currentCaregiverId', caregiver.id);
        this.caregiverService.setCurrentCaregiver(caregiver);
        this.setCurrentUserRole(USER_ROLES.CAREGIVER);
        return USER_ROLES.CAREGIVER;
      }

      // 2) Try independent user
      const independents = await firstValueFrom(
        this.http.get<any[]>(
          `${environment.apiUrl}/independents?email=${loginData.email}&password=${loginData.password}`
        )
      ).catch(() => [] as any[]);

      if (independents && independents.length > 0) {
        const user = independents[0];
        const normalized = {
          ...user,
          profileImageURL: user.profileImageURL ?? user.profileImage ?? '/assets/profileimage-default.png',
          isActive: user.isActive ?? true,
        };
        this.setCurrentCaregiverToken(normalized.token);
        localStorage.setItem('currentIndependentUserId', normalized.id);
        this.independentUserService.setCurrentIndependentUser(normalized);
        // Also cache as currentCaregiver so components that read caregiverService work for both roles
        this.caregiverService.setCurrentCaregiver(normalized as any);
        this.setCurrentUserRole(USER_ROLES.INDEPENDENT);
        return USER_ROLES.INDEPENDENT;
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // ------------------------------------------------------------------------
  // Logout
  // ------------------------------------------------------------------------

  async logout() {
    this.resetCurrentCaregiverToken();
    this.resetCurrentUserRole();
    localStorage.removeItem('currentCaregiverId');
    localStorage.removeItem('currentCaregiver');
    localStorage.removeItem('currentIndependentUserId');
    localStorage.removeItem('currentIndependentUser');
    this.caregiverService.resetCurrentCaregiver();
    this.independentUserService.resetCurrentIndependentUser();
  }
}
