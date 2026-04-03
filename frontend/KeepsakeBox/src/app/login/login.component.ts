import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../services/authentication.service';
import { EncryptionService } from '../services/encryption.service';
import { LoginLoadingComponent } from './login-loading/login-loading.component';

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
    // If a token already exists, skip login entirely
    if (this.authenticationService.getCurrentCaregiverToken()) {
      this.router.navigate(['/caregiver/persons']);
    }
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

    const encryptedPassword = this.encryptionService.encrypt(
      "989$%&2!3123KeepsakeBox2021",
      this.currentPassword
    );

    const loginDataPayload = {
      email:    this.loginData.email,
      password: encryptedPassword
    };

    const success = await this.authenticationService.login(loginDataPayload);

    if (success) {
      this.router.navigate(['/caregiver/persons']);
    } else {
      this.validLogin.set(false);
      this.loginIn.set(false);
    }
  }
}