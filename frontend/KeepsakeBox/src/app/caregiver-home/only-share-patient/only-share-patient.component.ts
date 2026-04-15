/**
 * @author André Santana - fc49451
 */

/* TODO: migrate NotificationService to return Observables:
         NotificationService.notifySharePatient still uses .toPromise()
         update notifySharePatient() to subscribe */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { PatientService } from '../../core/services/patient.service';
import { NotificationService } from '../../core/services/notification.service';
import { AppService } from '../../core/services/app.service';
import { Caregiver } from '../../core/models/caregiver.model';
import { Patient } from '../../core/models/patient.model';
import { CancelScreenComponent } from '../../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-only-share-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, CancelScreenComponent],
  templateUrl: './only-share-patient.component.html',
  styleUrl: './only-share-patient.component.css'
})
export class OnlySharePatientComponent implements OnInit {
  private router                = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private patientService        = inject(PatientService);
  private notificationService   = inject(NotificationService);
  private appService            = inject(AppService);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  hideCancel        = true;
  hideSharePatient  = false;
  hidePatientShared = true;

  sharingPatient  = false;
  shared          = true;
  validEmailInput = true;

  currentCaregiver!: Caregiver;
  patient!: Patient;
  receiverEmail = '';

  ngOnInit(): void {
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient          = this.patientService.getCurrentPatient()!;
  }

  showCancel(): void {
    this.hideCancel = false; this.hideSharePatient = true; this.hidePatientShared = true;
  }

  showSharePatient(): void {
    this.hideCancel = true; this.hideSharePatient = false; this.hidePatientShared = true;
  }

  navigateToPatientInfo(): void {
    this.router.navigate(['caregiver/person/info']);
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  isValidEmailValue(email: NgModel): void {
    if (!this.shared) this.shared = true;
    this.validEmailInput = email.valid ?? false;
  }

  async notifySharePatient(): Promise<void> {
    this.sharingPatient = true;
    const token = this.authenticationService.getCurrentCaregiverToken()!;
    if (await this.notificationService.notifySharePatient(
      token, this.receiverEmail, this.patientService.getCurrentPatient()!.id)) {
      this.hideCancel = true; this.hideSharePatient = true; this.hidePatientShared = false;
    } else {
      this.shared         = false;
      this.sharingPatient = false;
    }
  }
}
