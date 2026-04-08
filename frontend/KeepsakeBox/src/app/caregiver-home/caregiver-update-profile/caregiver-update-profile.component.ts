import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Caregiver } from '../../core/models/caregiver.model';
import { BirthDate } from '../../core/models/birth-date.model';
import { ProfileImage } from '../../core/models/profile-image.model';
import { CaregiverType } from '../../core/models/caregiver-type.model';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { CancelScreenComponent } from '../../shared/cancel-screen/cancel-screen.component';
import { ProfileImageComponent } from '../../shared/profile-image/profile-image.component';
import { CaregiverTypeComponent } from '../../shared/caregiver-type/caregiver-type.component';
import { BirthDateInputComponent } from '../../shared/birth-date-input/birth-date-input.component';

@Component({
  selector: 'app-caregiver-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, BirthDateInputComponent,
            CancelScreenComponent, ProfileImageComponent, CaregiverTypeComponent],
  templateUrl: './caregiver-update-profile.component.html',
  styleUrl: './caregiver-update-profile.component.css'
})
export class CaregiverUpdateProfileComponent implements OnInit {
  private router                = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  hideCancel        = true;
  hideEditProfile1  = false;
  hideEditProfile2  = true;

  validEmailInput = true;
  validEmail      = true;
  loading         = false;
  updated         = true;

  currentCaregiver!: Caregiver;
  updatedCaregiver!: Caregiver;
  lastEmailValidated!: string;
  birthDate!: BirthDate;
  profileImage!: ProfileImage;
  caregiverType!: CaregiverType;

  ngOnInit(): void {
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;

    this.updatedCaregiver = new Caregiver(
      this.currentCaregiver.id,
      this.currentCaregiver.name,
      this.currentCaregiver.email,
      this.currentCaregiver.phone,
      this.currentCaregiver.birthDate,
      this.currentCaregiver.profileImageURL,
      this.currentCaregiver.type,
      this.currentCaregiver.speciality,
      this.currentCaregiver.isActive
    );

    this.lastEmailValidated = this.currentCaregiver.email;

    const dateValues = this.currentCaregiver.birthDate.toString()
      .split('-').map(v => Number(v));
    this.birthDate    = new BirthDate(dateValues[2], dateValues[1] - 1, dateValues[0], true);
    this.profileImage = new ProfileImage(this.currentCaregiver.profileImageURL);
    this.caregiverType = new CaregiverType(
      this.currentCaregiver.type,
      this.currentCaregiver.speciality
    );
  }

  showCancel(): void {
    this.hideCancel       = false;
    this.hideEditProfile1 = true;
    this.hideEditProfile2 = true;
  }

  showEditProfile1(): void {
    this.hideCancel       = true;
    this.hideEditProfile1 = false;
    this.hideEditProfile2 = true;
  }

  showEditProfile2(): void {
    this.hideCancel       = true;
    this.hideEditProfile1 = true;
    this.hideEditProfile2 = false;
  }

  navigateToCaregiverProfile(): void {
    this.router.navigate(['/caregiver/profile/info']);
  }

  isValidEmailValue(email: NgModel): void {
    this.validEmailInput = email.valid ?? false;
    if (!this.validEmail) {
      if (this.lastEmailValidated !== this.updatedCaregiver.email
          || this.updatedCaregiver.email === this.currentCaregiver.email) {
        this.validEmail = true;
      }
    }
  }

  async validateEmail(): Promise<void> {
    this.loading = true;
    if (this.updatedCaregiver.email !== this.currentCaregiver.email) {
      if (await this.authenticationService.validateEmail(this.updatedCaregiver.email)) {
        this.lastEmailValidated = this.updatedCaregiver.email;
        this.showEditProfile2();
      } else {
        this.validEmail = false;
      }
    } else {
      this.showEditProfile2();
    }
    this.loading = false;
  }

  areEqualCaregivers(): boolean {
    return this.currentCaregiver.id            === this.updatedCaregiver.id
        && this.currentCaregiver.name          === this.updatedCaregiver.name
        && this.currentCaregiver.email         === this.updatedCaregiver.email
        && this.currentCaregiver.phone         === this.updatedCaregiver.phone
        && this.currentCaregiver.birthDate     === this.updatedCaregiver.birthDate
        && this.currentCaregiver.profileImageURL === this.updatedCaregiver.profileImageURL
        && this.currentCaregiver.type          === this.updatedCaregiver.type
        && this.currentCaregiver.speciality    === this.updatedCaregiver.speciality
        && this.currentCaregiver.isActive      === this.updatedCaregiver.isActive;
  }

  async caregiverUpdate(): Promise<void> {
    this.loading = true;
    this.updatedCaregiver.birthDate      = new Date(
      this.birthDate.year, this.birthDate.month, this.birthDate.day, 0, 0, 0, 0);
    this.updatedCaregiver.profileImageURL = this.profileImage.imageURL;
    this.updatedCaregiver.type           = this.caregiverType.type;
    this.updatedCaregiver.speciality     = this.caregiverType.speciality;

    if (!this.areEqualCaregivers()) {
      const token = this.authenticationService.getCurrentCaregiverToken()!;
      if (await this.caregiverService.caregiverUpdate(token, this.updatedCaregiver)) {
        if (await this.caregiverService.getCaregiver(token)) {
          this.router.navigate(['/caregiver/profile/info']);
        } else {
          this.updated = false;
          this.loading = false;
        }
      } else {
        this.updated = false;
        this.loading = false;
      }
    } else {
      this.router.navigate(['/caregiver/profile/info']);
    }
  }
}