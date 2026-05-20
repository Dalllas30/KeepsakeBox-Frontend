import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';
import { CaregiverRegisterData } from '../../../core/models/caregiver-register-data.model';
import { IndependentUserRegisterData } from '../../../core/models/independent-user-register-data.model';
import { LoginData } from '../../../core/models/login-data.model';
import { RegisterStep1Data } from '../../../core/models/register-step1-data.model';
import { BirthDate } from '../../../core/models/birth-date.model';
import { RegisterStep2Data } from '../../../core/models/register-step2-data.model';
import { ProfileImage } from '../../../core/models/profile-image.model';
import { CaregiverType } from '../../../core/models/caregiver-type.model';
import { EncryptionService } from '../../../core/services/encryption.service';
import { RegisterStep2Component } from './register-step2/register-step2.component';
import { RegisterStep1Component } from './register-step1/register-step1.component';
import { TranslateModule } from '@ngx-translate/core';
import { CancelScreenComponent } from '../../../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RegisterStep1Component, RegisterStep2Component, CommonModule, TranslateModule, CancelScreenComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  public hideCancel: boolean = true;
  public hideStep1: boolean = false;
  public hideStep2: boolean = true;
  public step1Data!: RegisterStep1Data;
  public step2Data!: RegisterStep2Data;

  private router = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private encryptionService = inject(EncryptionService);

  ngOnInit(): void {
    // If the user lands here while already authenticated (e.g. after Keycloak
    // redirects back to /register post-login), send them straight to the app.
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/caregiver/persons']);
      return;
    }

    this.showStep1();
    this.step1Data = new RegisterStep1Data("", new BirthDate(0, -1, 0, true), "", "", "", "", 'caregiver');
    this.step2Data = new RegisterStep2Data(new ProfileImage(""), new CaregiverType("Informal", ""), false, true);
  }

  showCancel(): void {
    this.hideCancel = false;
    this.hideStep1 = true;
    this.hideStep2 = true;
  }

  showStep1(): void {
    this.hideCancel = true;
    this.hideStep1 = false;
    this.hideStep2 = true;
  }

  showStep2(): void {
    this.hideCancel = true;
    this.hideStep1 = true;
    this.hideStep2 = false;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Step-2 submit entry point.
   * Branches on the role chosen in step 1 — keeps the template's submit
   * handler stable while routing the two registration flows separately.
   */
  async submitRegister(): Promise<void> {
    if (this.step1Data.role === 'independent') {
      return this.independentRegister();
    }
    return this.caregiverRegister();
  }

  async caregiverRegister(): Promise<void> {
    this.step2Data.submittingRegister = true;
    const caregiver = new CaregiverRegisterData(
      this.step1Data.name,
      this.step1Data.email,
      this.step1Data.phone,
      // Send the raw password — Keycloak handles hashing server-side.
      // Encrypting here would cause login to fail because Keycloak would
      // store the ciphertext and never match the user's real password.
      this.step1Data.password,
      new Date(this.step1Data.birthDate.year, this.step1Data.birthDate.month,
        this.step1Data.birthDate.day, 0, 0, 0, 0),
      this.step2Data.profileImage.imageURL,
      this.step2Data.caregiverType.type,
      this.step2Data.caregiverType.speciality
    );
    if (await this.authenticationService.register(caregiver)) {
      // Account created in the backend. Redirect to Keycloak login so the user
      // gets a proper OIDC session. login() triggers a browser redirect and
      // never returns — no role check needed here.
      this.authenticationService.login();
    } else {
      this.step2Data.submittingRegister = false;
      this.step2Data.registered = false;
    }
  }

  async independentRegister(): Promise<void> {
    this.step2Data.submittingRegister = true;
    const independent = new IndependentUserRegisterData(
      this.step1Data.name,
      this.step1Data.email,
      this.step1Data.phone,
      // Raw password — same reasoning as caregiverRegister above.
      this.step1Data.password,
      new Date(this.step1Data.birthDate.year, this.step1Data.birthDate.month,
        this.step1Data.birthDate.day, 0, 0, 0, 0),
      this.step2Data.profileImage.imageURL,
      // primaryCaregiverId intentionally left undefined — independent users
      // self-register; a caregiver association can be added later.
    );
    if (await this.authenticationService.registerIndependent(independent)) {
      // Same as above: redirect to Keycloak login.
      this.authenticationService.login();
    } else {
      this.step2Data.submittingRegister = false;
      this.step2Data.registered = false;
    }
  }
}