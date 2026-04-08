/**
 * @author André Santana - fc49451
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Patient } from '../../../core/models/patient.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { PatientObservation } from '../../../core/models/patient-observation.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-delete-patient-observation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './delete-patient-observation.component.html',
  styleUrls: ['./delete-patient-observation.component.css']
})
export class DeletePatientObservationComponent implements OnInit {
  public caregiver!: Caregiver;
  public patient!: Patient;
  public observation!: PatientObservation;
  public deleteError: boolean = false;
  public deleting: boolean = false;

  constructor(
    private appService: AppService,
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient = this.patientService.getCurrentPatient()!;
    this.observation = this.patientService.getCurrentObservation()!;
  }

  async deleteObservation(): Promise<void> {
    this.deleting = true;
    this.deleteError = false;
    const token = this.authenticationService.getCurrentCaregiverToken()!;

    const success = await this.patientService.deleteObservation(token, this.observation.id);
    if (success) {
      this.patientService.resetCurrentObservation();
      this.router.navigate(['/caregiver/person/observations']);
    } else {
      this.deleteError = true;
    }
    this.deleting = false;
  }

  cancel(): void {
    this.router.navigate(['/caregiver/person/observations']);
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }
}
