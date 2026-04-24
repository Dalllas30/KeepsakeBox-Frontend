/**
 * @author André Santana - fc49451
 */

/* TODO: migrate NotificationService to return Observables:
         NotificationService.notifyPrimaryCareTransfer still uses .toPromise()
         update notifyPrimaryCareTransfer() to subscribe */

import { Component, inject, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { PatientService } from '../../core/services/patient.service';
import { NotificationService } from '../../core/services/notification.service';
import { AppService } from '../../core/services/app.service';
import { Caregiver } from '../../core/models/caregiver.model';
import { PatientCaregiver } from '../../core/models/patient-caregiver.model';
import { Patient } from '../../core/models/patient.model';
import { CancelScreenComponent } from '../../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-principal-share-patient',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, NgbPaginationModule, CancelScreenComponent],
  templateUrl: './principal-share-patient.component.html',
  styleUrl: './principal-share-patient.component.css'
})
export class PrincipalSharePatientComponent implements OnInit {
  private router                = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private patientService        = inject(PatientService);
  private notificationService   = inject(NotificationService);
  private appService            = inject(AppService);
  private cdr                   = inject(ChangeDetectorRef);

  // Number of pages to show
  @Input() page     = 1;
  // Number of caregivers per page
  @Input() pageSize = 2;
  // Max size of pagination buttons
  @Input() maxSize  = 3;

  hideCancel        = true;
  hideSharePatient  = false;
  hidePatientShared = true;

  notifyingPatient  = false;
  notified          = true;

  collectionSize    = 0;
  currentCaregiver!: Caregiver;
  patientCaregivers: PatientCaregiver[] = [];
  patient!:          Patient;
  selectedCaregiver  = new Caregiver("", "", "", "", null, "", "", "", true);

  async ngOnInit(): Promise<void> {
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient          = this.patientService.getCurrentPatient()!;
    await this.retrievePatientCaregivers();
    this.getReferenceToCurrentCaregiver();
    this.cdr.detectChanges();
  }

  showCancel(): void {
    this.hideCancel = false; 
    this.hideSharePatient = true; 
    this.hidePatientShared = true;
  }

  showSharePatient(): void {
    this.hideCancel = true; 
    this.hideSharePatient = false; 
    this.hidePatientShared = true;
  }

  showPatientShared(): void {
    this.hideCancel = true; 
    this.hideSharePatient = true; 
    this.hidePatientShared = false;
  }

  navigateToPatientInfo(): void {
    this.router.navigate(['caregiver/person/info']);
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async notifyPrimaryCareTransfer(care: PatientCaregiver): Promise<void> {
    this.notifyingPatient    = true;
    this.selectedCaregiver   = care.caregiver;
    const token              = this.authenticationService.getCurrentCaregiverToken()!;
    const patientId          = this.patientService.getCurrentPatient()!.id;
    if (await this.notificationService.notifyPrimaryCareTransfer(
      token, this.selectedCaregiver.email, patientId)) {
      this.showPatientShared();
    } else {
      this.notified        = false;
      this.notifyingPatient = false;
    }
  }

  async retrievePatientCaregivers(): Promise<void> {
    const token             = this.authenticationService.getCurrentCaregiverToken()!;
    this.patientCaregivers  = await this.patientService.getPatientCaregivers(token, this.patient.id);
    this.collectionSize     = this.patientCaregivers.length;
  }

  getReferenceToCurrentCaregiver(): void {
    this.patientCaregivers = this.patientCaregivers.filter(
      care => care.caregiver.email !== this.currentCaregiver.email
    );
    this.collectionSize = this.patientCaregivers.length;
  }
}
