import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { EncryptionService } from '../../../core/services/encryption.service';
import { LoginLoadingComponent } from './login-loading/login-loading.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    TranslateModule,
    LoginLoadingComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private encryptionService = inject(EncryptionService);

  validEmailInput = signal(true);
  validLogin = signal(true);
  loginIn = signal(false);

  loginData = {
    email: ''
  };
  currentPassword: string = '';

  ngOnInit(): void {
    // After the Keycloak redirect back, APP_INITIALIZER has already run
    // resolveCurrentUser(). If the user is authenticated, go straight to
    // the app — both roles share the same home.
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/caregiver/persons']);
      return;
    }

    // Not authenticated — skip the KeepsakeBox login form entirely and
    // redirect straight to the Keycloak login page.  Keycloak will send
    // the user back here after a successful login, at which point the
    // branch above fires and navigates into the app.
    this.authenticationService.login();
  }

  /** Used by login-loading to decide whether to show the overlay */
  existsCurrentCaregiverToken(): boolean {
    return this.authenticationService.getCurrentCaregiverToken() != null
      || this.loginIn();
  }

  /**
   * Checks if email input value is valid
   * @param email - email input to validate
   */
  onEmailBlur(): void {
    // Validate email format using regex
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    this.validEmailInput.set(emailRegex.test(this.loginData.email));
  }

  /**
   * Validates email format
   */
  isValidEmailValue(emailControl: any): void {
    if (emailControl && emailControl.valid) {
      this.validEmailInput.set(true);
    }
  }

  /** Reset login error when user edits either field */
  validateLogin(): void {
    this.validLogin.set(true);
  }

  async caregiverLogin(): Promise<void> {
    if (!this.loginData.email || !this.currentPassword) {
      return;
    }

    this.loginIn.set(true);

    // login() redirects to Keycloak — it never returns a role.
    // Routing happens in ngOnInit after Keycloak redirects back and
    // APP_INITIALIZER resolves the user identity.
    // The email/password fields are kept for UX (pre-fill the Keycloak form
    // via the login_hint parameter) but Keycloak handles the actual auth.
    this.authenticationService.login({
      email: this.loginData.email,
      password: this.currentPassword
    });

    // loginIn stays true while the redirect is in flight — no finally needed.
  }
}