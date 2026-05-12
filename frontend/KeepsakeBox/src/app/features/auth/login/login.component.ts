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
    // If a token already exists, skip login entirely — route by role.
    if (this.authenticationService.getCurrentCaregiverToken()) {
      const role = this.authenticationService.getCurrentUserRole();
      this.router.navigate([role === 'independent' ? '/independent' : '/caregiver/persons']);
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

    try {
      const passwordToUse = environment.useEncryption
        ? this.encryptionService.encrypt(environment.encryptionKey, this.currentPassword)
        : this.currentPassword;

      const role = await this.authenticationService.login({
        email: this.loginData.email,
        password: passwordToUse
      });

      if (role === 'caregiver') {
        await this.router.navigate(['/caregiver/persons']);
      } else if (role === 'independent') {
        await this.router.navigate(['/independent']);
      } else {
        this.validLogin.set(false);
      }
    } finally {
      this.loginIn.set(false);
    }
  }
}