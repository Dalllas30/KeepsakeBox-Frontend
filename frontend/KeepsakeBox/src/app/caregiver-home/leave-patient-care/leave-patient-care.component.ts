/**
 * @author André Santana - fc49451
 */

/* TODO: migrate CaregiverService to return Observables:
         CaregiverService.leavePatientCare still uses .toPromise()
         update leavePatientCare() to subscribe */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { PatientService } from '../../core/services/patient.service';
import { AppService } from '../../core/services/app.service';
import { Caregiver } from '../../core/models/caregiver.model';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-leave-patient-care',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './leave-patient-care.component.html',
  styleUrl: './leave-patient-care.component.css'
})
export class LeavePatientCareComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private patientService        = inject(PatientService);
  private appService            = inject(AppService);

  hideLeaveCare = false;
  hideCareLeft  = true;

  leavingCare = false;
  left        = true;

  currentCaregiver!: Caregiver;
  patient!: Patient;

  ngOnInit(): void {
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient          = this.patientService.getCurrentPatient()!;
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async leavePatientCare(): Promise<void> {
    this.leavingCare = true;
    const token = this.authenticationService.getCurrentCaregiverToken()!;
    if (await this.caregiverService.leavePatientCare(token, this.patientService.getCurrentPatient()!.id)) {
      this.hideLeaveCare = true;
      this.hideCareLeft  = false;
    } else {
      this.left        = false;
      this.leavingCare = false;
    }
  }
}
