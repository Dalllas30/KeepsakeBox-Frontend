import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Caregiver } from '../../../core/models/caregiver.model';
import { PatientCaregiver } from '../../../core/models/patient-caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-patient-remove-caregiver',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './patient-remove-caregiver.component.html',
  styleUrls: ['./patient-remove-caregiver.component.css']
})
export class PatientRemoveCaregiverComponent implements OnInit {

  public hideRemove!: boolean;
  public hideRemoved!: boolean;
  public removing: boolean = false;
  public removed: boolean = true;
  public currentCaregiver!: Caregiver;
  public caregiverToRemove!: PatientCaregiver;
  public patient!: Patient;

  constructor(
    private patientService: PatientService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private appService: AppService,
    private router: Router
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state) {
      this.caregiverToRemove = state['caregiver'];
    } else {
      this.caregiverToRemove = new PatientCaregiver(
        new Caregiver("", "", "", "", null, "", "", "", true), false, ""
      );
    }
  }

  async ngOnInit() {
    this.showRemove();
    this.removing = false;
    this.removed = true;
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient = this.patientService.getCurrentPatient()!;
  }

  showRemove() {
    this.hideRemove = false;
    this.hideRemoved = true;
  }

  showRemoved() {
    this.hideRemove = true;
    this.hideRemoved = false;
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async removeCaregiverCare() {
    this.removing = true;
    if (await this.caregiverService.removeCaregiverFromPatientCare(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.caregiverToRemove.caregiver.id,
      this.patientService.getCurrentPatient()!.id)) {
      if (await this.notificationService.notifyRemovedFromPatient(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.caregiverToRemove.caregiver.email,
        this.patientService.getCurrentPatient()!.id)) {
        this.showRemoved();
      } else {
        this.removed = false;
        this.removing = false;
      }
    } else {
      this.removed = false;
      this.removing = false;
    }
  }
}