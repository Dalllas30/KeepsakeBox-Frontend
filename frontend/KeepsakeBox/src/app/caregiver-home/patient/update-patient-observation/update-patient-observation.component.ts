/**
 * @author André Santana - fc49451
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-update-patient-observation',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './update-patient-observation.component.html',
  styleUrls: ['./update-patient-observation.component.css']
})
export class UpdatePatientObservationComponent implements OnInit {
  public caregiver!: Caregiver;
  public patient!: Patient;
  public observation!: PatientObservation;
  public updatedObservationText: string = '';
  public updateError: boolean = false;
  public updating: boolean = false;

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
    this.updatedObservationText = this.observation.observation;
  }

  async updateObservation(): Promise<void> {
    this.updating = true;
    this.updateError = false;
    const token = this.authenticationService.getCurrentCaregiverToken()!;

    const updatedObservation: PatientObservation = {
      ...this.observation,
      observation: this.updatedObservationText
    };

    const success = await this.patientService.updateObservation(token, updatedObservation);
    if (success) {
      this.router.navigate(['/caregiver/person/observations']);
    } else {
      this.updateError = true;
    }
    this.updating = false;
  }

  cancel(): void {
    this.router.navigate(['/caregiver/person/observations']);
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }
}
