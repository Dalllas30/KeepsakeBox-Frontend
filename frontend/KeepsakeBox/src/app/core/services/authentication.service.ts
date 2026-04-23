/**
 * @author André Santana - fc49451
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CaregiverRegisterData } from '../models/caregiver-register-data.model';
import { LoginData } from '../models/login-data.model';
import { CaregiverService } from './caregiver.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //Class Constructor
  constructor(
    private http: HttpClient,
    private caregiverService: CaregiverService
  ) {
    //Stores the current caregiver token on cache
    this.currentCaregiverToken =
    new BehaviorSubject<string | null>(localStorage.getItem('currentCaregiverToken'));
  }

  //Cache variable for the current caregiver token
  private currentCaregiverToken: BehaviorSubject<string | null>;

  /**
   * Sets the current caregiver token on cache
   * @param token - current caregiver token
   */
  setCurrentCaregiverToken(token: string): void {
    localStorage.setItem('currentCaregiverToken', token);
    this.currentCaregiverToken.next(token);
  }

  /**
   * Resets current caregiver token saved on cache
   */
  resetCurrentCaregiverToken(): void {
    localStorage.removeItem('currentCaregiverToken');
    this.currentCaregiverToken.next(null);
  }

  /**
   * Gets the current caregiver token
   * @returns the current caregiver token from cache
   */
  getCurrentCaregiverToken(): string | null {
    return this.currentCaregiverToken.value;
  }

  isLoggedIn(): boolean {
    return this.getCurrentCaregiverToken() != null;
  }

  private normalizeCaregiver(caregiver: any): any {
    return {
      ...caregiver,
      profileImageURL: caregiver.profileImageURL ?? caregiver.profileImage ?? '/assets/profileimage-default.png',
      type: caregiver.type ?? caregiver.caregiverType ?? '',
      isActive: caregiver.isActive ?? true
    };
  }

  /**
   * Request that validates an email by verifying if it exists in database
   * @param email - email to validate with database
   * @returns TRUE if email does not belong to another caregiver
   */
  async validateEmail(email: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/caregivers?email=${email}`)
      );
      // If array is empty, email is valid (doesn't exist)
      return response.length === 0;
    } catch (error) {
      console.error('Email validation error:', error);
      return false;
    }
  }

  /**
   * Request that registers a new caregiver into the application
   * @param caregiver - caregiver data needed to register the caregiver
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
      console.log('Registration successful:', response);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  /**
   * Request that logins a caregiver into the application
   * @param loginData - LoginData for the POST request
   * @returns TRUE if login was succeeded
   */
  async login(loginData: LoginData): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<any[]>(
          `${environment.apiUrl}/caregivers?email=${loginData.email}&password=${loginData.password}`
        )
      );
      
      if (response && response.length > 0) {
        const caregiver = this.normalizeCaregiver(response[0]);
        this.setCurrentCaregiverToken(caregiver.token);
        localStorage.setItem('currentCaregiverId', caregiver.id);
        this.caregiverService.setCurrentCaregiver(caregiver);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  /**
   * Logouts a caregiver from the application
   */
  async logout() {
    this.resetCurrentCaregiverToken();
    localStorage.removeItem('currentCaregiverId');
    localStorage.removeItem('currentCaregiver');
    this.caregiverService.resetCurrentCaregiver();
  }
}
