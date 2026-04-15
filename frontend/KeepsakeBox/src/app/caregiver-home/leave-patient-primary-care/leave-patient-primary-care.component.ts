/**
 * @author André Santana - fc49451
 */

/* TODO: migrate NotificationService to return Observables:
         NotificationService.notifyPrimaryLeaveCare still uses .toPromise()
         update leavePatientPrimaryCare() to subscribe */

import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { PatientService } from '../../core/services/patient.service';
import { NotificationService } from '../../core/services/notification.service';
import { AppService } from '../../core/services/app.service';
import { Caregiver } from '../../core/models/caregiver.model';
import { Patient } from '../../core/models/patient.model';
import { PatientCaregiver } from '../../core/models/patient-caregiver.model';
import { CancelScreenComponent } from '../../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-leave-patient-primary-care',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, NgbPaginationModule, CancelScreenComponent],
  templateUrl: './leave-patient-primary-care.component.html',
  styleUrl: './leave-patient-primary-care.component.css'
})
export class LeavePatientPrimaryCareComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private patientService        = inject(PatientService);
  private notificationService   = inject(NotificationService);
  private appService            = inject(AppService);

  @Input() page     = 1;
  @Input() pageSize = 2;
  @Input() maxSize  = 3;

  collectionSize = 0;

  hideCancel    = true;
  hideLeaveCare = false;
  hideCareLeft  = true;

  leavingCare = false;
  left        = true;

  currentCaregiver!: Caregiver;
  patient!: Patient;
  patientCaregivers: PatientCaregiver[] = [];
  selectedCaregiver!: Caregiver;

  async ngOnInit(): Promise<void> {
    this.currentCaregiver  = this.caregiverService.getCurrentCaregiver()!;
    this.selectedCaregiver = new Caregiver("", "", "", "", null, "", "", "", true);
    this.patient           = this.patientService.getCurrentPatient()!;
    await this.retrievePatientCaregivers();
    this.removeCurrentCaregiverFromList();
  }

  showCancel(): void {
    this.hideCancel = false; this.hideLeaveCare = true; this.hideCareLeft = true;
  }

  showLeaveCare(): void {
    this.hideCancel = true; this.hideLeaveCare = false; this.hideCareLeft = true;
  }

  navigateToPatientInfo(): void {
    this.appService.isRouteActive('caregiver/person/info');
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async leavePatientPrimaryCare(care: PatientCaregiver): Promise<void> {
    this.leavingCare       = true;
    this.selectedCaregiver = care.caregiver;
    const token = this.authenticationService.getCurrentCaregiverToken()!;
    if (await this.notificationService.notifyPrimaryLeaveCare(
      token, this.selectedCaregiver.email, this.patientService.getCurrentPatient()!.id)) {
      this.hideCancel = true; this.hideLeaveCare = true; this.hideCareLeft = false;
    } else {
      this.left        = false;
      this.leavingCare = false;
    }
  }

  async retrievePatientCaregivers(): Promise<void> {
    const token = this.authenticationService.getCurrentCaregiverToken()!;
    this.patientCaregivers = await this.patientService.getPatientCaregivers(token, this.patient.id);
    this.collectionSize    = this.patientCaregivers.length;
  }

  removeCurrentCaregiverFromList(): void {
    this.patientCaregivers = this.patientCaregivers.filter(
      c => c.caregiver.email !== this.currentCaregiver.email
    );
    this.collectionSize = this.patientCaregivers.length;
  }
}
