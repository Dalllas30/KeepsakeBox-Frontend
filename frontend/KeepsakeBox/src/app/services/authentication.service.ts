/**
 * @author André Santana - fc49451
 */

import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { LoginData } from '../models/login-data.model';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResponseBasic } from '../models/response-basic.model';
import { CaregiverRegisterData } from '../models/caregiver-register-data.model';

import { environment } from '../../environments/environment';

//Request URLs
const serverURL = "194.117.20.219"
//const serverURL = "localhost"
const getCaregiverIdByEmailURL = `http://${serverURL}:8080/caregiver/id?email=`;
const caregiverRegisterURL = `http://${serverURL}:8080/register`;
const caregiverLoginURL = `http://${serverURL}:8080/login`;
const caregiverLogoutURL = `http://${serverURL}:8080/logout?token=`;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //Class Constructor
  constructor(private http: HttpClient) {
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

  /**
   * Request that validates an email by verifying if it exists in database
   * @param email - email to validate with database
   * @returns TRUE if email does not belong to another caregiver
   */
  async validateEmail(email: string): Promise<boolean> {
    let validEmail = true;
    await this.http.get(`${getCaregiverIdByEmailURL}${email}`).toPromise()
    .then(response => {
      if (response) {
        let resp: ResponseBasic = JSON.parse(JSON.stringify(response));
        validEmail = (resp.result == null)
      }
    }).catch(error => {
      validEmail = false;
    });
    return validEmail;
  }

  /**
   * Request that registers a new caregiver into the application
   * @param caregiver - caregiver data needed to register the caregiver
   */
  async register(caregiver: CaregiverRegisterData) {
    // let registered = true;
    // await this.http.post(caregiverRegisterURL, caregiver).toPromise()
    // .catch(error => {
    //   registered = false;
    // });
    // return registered;
    return this.http.post(`${environment.apiUrl}/auth/register`, caregiver);
  }

  // /**
  //  * Request that logins a caregiver into the application
  //  * @param loginData - LoginData for the POST request
  //  * @param validLogin - Variable that shows if LoginData is valid
  //  *                     after the request
  //  * @returns TRUE if login was succeeded
  //  */
  // async login(loginData: LoginData) : Promise<boolean> {
  //   let validLogin = true;
  //   await this.http.post(caregiverLoginURL, loginData).toPromise()
  //   .then(response => {
  //     if (response) {
  //       let resp: ResponseBasic = JSON.parse(JSON.stringify(response));
  //       this.setCurrentCaregiverToken(resp.result);
  //     }else{
  //       validLogin = false;
  //     }
  //   }).catch(err => {
  //     validLogin =  false;
  //   });
  //   return validLogin;
  // }
  login(credentials: any) {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  /**
   * Logouts a caregiver from the application
   */
  async logout() {
    //await this.http.get(`${caregiverLogoutURL}${this.getCurrentCaregiverToken()}`).toPromise();
    await firstValueFrom(
      this.http.get(`${environment.apiUrl}/auth/logout?token=${this.getCurrentCaregiverToken()}`)
    );
  }
}
