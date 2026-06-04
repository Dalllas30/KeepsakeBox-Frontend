import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';
import { ObservationService } from '../../../core/services/observation.service';
import { AppService } from '../../../core/services/app.service';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { AddPatientObservationData } from '../../../core/models/add-patient-observation-data.model';
import { CancelScreenComponent } from '../../../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-add-patient-observation',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CancelScreenComponent],
  templateUrl: './add-patient-observation.component.html',
  styleUrl: './add-patient-observation.component.css'
})
export class AddPatientObservationComponent implements OnInit {
  private router                = inject(Router);
  private appService            = inject(AppService);
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private patientService        = inject(PatientService);
  private observationService    = inject(ObservationService);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  hideCancel         = true;
  hideAddObservation = false;

  addingObservation = false;
  added             = true;

  caregiver!: Caregiver;
  patient!: Patient;
  obs!: AddPatientObservationData;

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient   = this.patientService.getCurrentPatient()!;
    this.obs       = new AddPatientObservationData(this.patient.id, this.caregiver.id, "");
  }

  showCancel():          void { this.hideCancel = false; this.hideAddObservation = true; }
  showAddObservation():  void { this.hideCancel = true;  this.hideAddObservation = false; }

  navigateToPatientObservations(): void {
    this.router.navigate(['caregiver/person/observations']);
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async addPatientObservation(): Promise<void> {
    this.addingObservation = true;
    const token = this.authenticationService.getCurrentCaregiverToken()!;
    if (await this.observationService.addPatientObservation(token, this.obs)) {
      this.navigateToPatientObservations();
    } else {
      this.added = false;
      this.addingObservation = false;
    }
  }
}