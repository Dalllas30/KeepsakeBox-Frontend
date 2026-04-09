import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { PatientService } from '../../../core/services/patient.service';
import { ObservationService } from '../../../core/services/observation.service';
import { AppService } from '../../../core/services/app.service';
import { Patient } from '../../../core/models/patient.model';
import { PatientObservation } from '../../../core/models/patient-observation.model';
import { SimpleCaregiver } from '../../../core/models/simple-caregiver.model';

@Component({
  selector: 'app-delete-patient-observation',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './delete-patient-observation.component.html',
  styleUrl: './delete-patient-observation.component.css'
})
export class DeletePatientObservationComponent implements OnInit {
  private router                = inject(Router);
  private appService            = inject(AppService);
  private authenticationService = inject(AuthenticationService);
  private patientService        = inject(PatientService);
  private observationService    = inject(ObservationService);

  deleting = false;
  deleted  = true;

  patient!: Patient;
  obs!: PatientObservation;

  constructor() {
    this.patient = this.patientService.getCurrentPatient()!;
    const state  = this.router.currentNavigation()?.extras?.state;
    this.obs     = state?.['observation'] ?? new PatientObservation("", "",
      new SimpleCaregiver("", "", ""), "", null);
  }

  ngOnInit(): void {}

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async deletePatientObservation(): Promise<void> {
    this.deleting = true;
    const token = this.authenticationService.getCurrentCaregiverToken()!;
    if (await this.observationService.deletePatientObservation(token, this.obs.id)) {
      this.router.navigate(['/caregiver/person/observations']);
    } else {
      this.deleted = false;
      this.deleting = false;
    }
  }
}